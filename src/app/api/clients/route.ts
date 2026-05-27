import { auth } from "@clerk/nextjs/server";

import { prisma } from "~/lib/prisma";
import { error, success } from "~/lib/api-response";

export async function GET() {
  try {
    const authObj = await auth();
    const clerkId = authObj.userId;

    if (!clerkId) {
      return error("Não autorizado.", 401);
    }

    const providerUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!providerUser || providerUser.role !== "provider") {
      return error("Apenas profissionais podem listar seus clientes.", 403);
    }

    // Buscar todos os agendamentos marcados com este profissional, trazendo os clientes
    const appointments = await prisma.appointment.findMany({
      where: { providerId: providerUser.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        date: "desc", // Ordena por data mais recente primeiro
      },
    });

    // Agrupar por cliente de forma a contar agendamentos e pegar o mais recente
    const clientsMap: Record<
      string,
      {
        id: string;
        name: string | null;
        email: string;
        totalBookings: number;
        lastBookingDate: Date;
      }
    > = {};

    for (const appt of appointments) {
      const client = appt.user;
      
      if (client) {
        if (!clientsMap[client.id]) {
          clientsMap[client.id] = {
            id: client.id,
            name: client.name,
            email: client.email,
            totalBookings: 0,
            lastBookingDate: appt.date,
          };
        }
        clientsMap[client.id].totalBookings += 1;
        if (appt.date > clientsMap[client.id].lastBookingDate) {
          clientsMap[client.id].lastBookingDate = appt.date;
        }
      } else if (appt.clientEmail) {
        const guestKey = `guest:${appt.clientEmail}`;
        if (!clientsMap[guestKey]) {
          clientsMap[guestKey] = {
            id: guestKey,
            name: appt.clientName || "Visitante",
            email: appt.clientEmail,
            totalBookings: 0,
            lastBookingDate: appt.date,
          };
        }
        clientsMap[guestKey].totalBookings += 1;
        if (appt.date > clientsMap[guestKey].lastBookingDate) {
          clientsMap[guestKey].lastBookingDate = appt.date;
        }
      }
    }

    // Converter para array e ordenar por mais agendamentos (fidelidade)
    const uniqueClients = Object.values(clientsMap).sort(
      (a, b) => b.totalBookings - a.totalBookings
    );

    return success(uniqueClients);
  } catch (err: unknown) {
    console.error("[GET /api/clients]", err);
    return error("Erro interno ao buscar lista de clientes.", 500);
  }
}

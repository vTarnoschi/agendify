import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { addMinutes, parse, startOfDay, endOfDay } from "date-fns";

import { prisma } from "~/lib/prisma";
import { error, success } from "~/lib/api-response";

import { calculateAvailableSlots } from "~/lib/schedule-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const dateStr = searchParams.get("date"); // YYYY-MM-DD
    const serviceId = searchParams.get("serviceId"); // Opcional

    if (!slug || !dateStr) {
      return error("Slug e data são obrigatórios.", 400);
    }

    const provider = await prisma.user.findUnique({
      where: { slug, role: "provider" },
    });

    if (!provider || !provider.clerkId) {
      return error("Profissional não encontrado.", 404);
    }

    // Converter a data e verificar se o profissional trabalha nesse dia da semana
    const targetDate = parse(dateStr, "yyyy-MM-dd", new Date());
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayOfWeekName = daysOfWeek[targetDate.getDay()];

    // Se o profissional não trabalhar nesse dia da semana, retorna lista vazia
    if (!provider.workingDays.includes(dayOfWeekName)) {
      return success({ slots: [], hasGoogleIntegration: false });
    }

    // Determinar a duração do slot de acordo com o serviço escolhido
    let slotDuration = 30; // 30 minutos padrão de fallback
    if (serviceId && serviceId !== "default") {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        select: { duration: true },
      });
      if (service) {
        slotDuration = service.duration;
      }
    }

    // Tentar obter o token de acesso do Google OAuth via Clerk
    let googleToken: string | null = null;
    try {
      const client = await clerkClient();
      const oauthResponse = await client.users.getUserOauthAccessToken(
        provider.clerkId,
        "oauth_google"
      );

      googleToken = oauthResponse.data[0]?.token || null;
    } catch (oauthErr: unknown) {
      const err = oauthErr as { status?: number; message?: string };
      if (err?.status === 422) {
        console.warn(`[Aviso] O profissional (${provider.slug}) não possui a integração com o Google Calendar vinculada.`);
      } else {
        console.warn("Erro ao buscar token do Google OAuth para o provider:", err?.message || oauthErr);
      }
    }

    // Define o início e fim do dia para consulta no Google
    const dayStart = startOfDay(targetDate);
    const dayEnd = endOfDay(targetDate);

    let busySlots: Array<{ start: string; end: string }> = [];

    // Ocupados do Google Calendar
    if (googleToken) {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: googleToken });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      try {
        const response = await calendar.freebusy.query({
          requestBody: {
            timeMin: dayStart.toISOString(),
            timeMax: dayEnd.toISOString(),
            items: [{ id: "primary" }],
          },
        });

        const calendars = response.data.calendars;
        if (calendars && calendars.primary && calendars.primary.busy) {
          busySlots = calendars.primary.busy.map((slot) => ({
            start: slot.start!,
            end: slot.end!,
          }));
        }
      } catch (calErr) {
        console.error("Erro ao consultar a API FreeBusy do Google Calendar:", calErr);
      }
    }

    // Ocupados do nosso próprio banco de dados (Agendify)
    // Busca agendamentos do prestador neste dia
    const agendamentosAgendify = await prisma.appointment.findMany({
      where: {
        providerId: provider.id,
        date: {
          gte: dayStart,
          lt: dayEnd,
        },
      },
      select: {
        date: true,
        duration: true,
      },
    });

    agendamentosAgendify.forEach((appt) => {
      const duration = appt.duration || 30; // 30 min fallback
      const apptStart = appt.date;
      const apptEnd = addMinutes(appt.date, duration);
      busySlots.push({
        start: apptStart.toISOString(),
        end: apptEnd.toISOString(),
      });
    });

    // Delegando a matemática pesada para a Engine Pura
    const slots = calculateAvailableSlots({
      targetDate,
      slotDuration,
      workStart: provider.workStart,
      workEnd: provider.workEnd,
      busySlots,
    });

    return success({ slots, hasGoogleIntegration: !!googleToken });
  } catch (err: unknown) {
    console.error("Erro na rota de disponibilidade:", err);
    return error("Erro interno no servidor.", 500);
  }
}

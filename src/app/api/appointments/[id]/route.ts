import { NextRequest } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import { prisma } from "~/lib/prisma";
import { error, success } from "~/lib/api-response";
import { resend } from "~/lib/mail";
import BookingCancellationEmail from "~/emails/BookingCancellation";

interface DeleteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(_req: NextRequest, { params }: DeleteParams) {
  try {
    const authObj = await auth();
    const clerkId = authObj.userId;

    if (!clerkId) {
      return error("Não autorizado.", 401);
    }

    const { id } = await params;

    // Buscar o agendamento no Prisma
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: {
        id: true,
        googleEventId: true,
        title: true,
        date: true,
        clientName: true,
        clientEmail: true,
        user: {
          select: { clerkId: true, email: true, name: true },
        },
        provider: {
          select: {
            clerkId: true,
            name: true,
            businessName: true,
            brandColor: true,
          },
        },
      },
    });

    if (!appointment) {
      return error("Agendamento não encontrado.", 404);
    }

    // Verificar se o usuário autenticado é o dono do agendamento (cliente ou profissional)
    const isOwner =
      (appointment.user && appointment.user.clerkId === clerkId) ||
      appointment.provider.clerkId === clerkId;

    if (!isOwner) {
      return error(
        "Você não tem permissão para cancelar este agendamento.",
        403,
      );
    }

    // Tentar deletar o evento do Google Calendar se houver integração
    if (appointment.googleEventId && appointment.provider.clerkId) {
      let googleToken: string | null = null;
      try {
        const clerk = await clerkClient();
        const oauthResponse = await clerk.users.getUserOauthAccessToken(
          appointment.provider.clerkId,
          "oauth_google",
        );
        googleToken = oauthResponse.data[0]?.token || null;
      } catch (oauthErr) {
        console.warn(
          "Não foi possível carregar token para deletar no Google Agenda:",
          oauthErr,
        );
      }

      if (googleToken) {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: googleToken });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        try {
          await calendar.events.delete({
            calendarId: "primary",
            eventId: appointment.googleEventId,
          });
          console.log(
            `Evento ${appointment.googleEventId} deletado do Google Calendar.`,
          );
        } catch (calErr) {
          console.error("Erro ao deletar o evento do Google Calendar:", calErr);
          // Prosseguimos com o delete no Prisma mesmo se falhar no Google
        }
      }
    }

    // Deleta do Prisma
    await prisma.appointment.delete({
      where: { id },
    });

    // Identificar informações de contato finais do cliente
    const guestName = appointment.user
      ? appointment.user.name
      : appointment.clientName;
    const guestEmail = appointment.user
      ? appointment.user.email
      : appointment.clientEmail;

    // Enviar e-mail de cancelamento via Resend (não-bloqueante)
    if (guestEmail) {
      try {
        const formattedDate = format(
          appointment.date,
          "dd 'de' MMMM 'de' yyyy",
          { locale: ptBR },
        );
        const formattedTime = format(appointment.date, "HH:mm");

        resend.emails
          .send({
            from:
              process.env.RESEND_FROM_EMAIL ||
              "Agendify <onboarding@resend.dev>",
            to: guestEmail,
            subject: `Cancelamento de Agendamento: ${appointment.title}`,
            react: BookingCancellationEmail({
              clientName: guestName,
              providerName:
                appointment.provider.name ||
                appointment.provider.businessName ||
                "Profissional",
              serviceTitle: appointment.title,
              date: formattedDate,
              time: formattedTime,
              brandColor: appointment.provider.brandColor,
            }),
          })
          .catch((err) =>
            console.error(
              "Erro assíncrono ao enviar email Resend de cancelamento:",
              err,
            ),
          );
      } catch (emailErr) {
        console.error(
          "Erro ao preparar email Resend de cancelamento:",
          emailErr,
        );
      }
    }

    return success({ message: "Agendamento cancelado com sucesso." });
  } catch (err: unknown) {
    console.error("[DELETE /api/appointments/[id]]", err);
    return error("Erro interno ao deletar o agendamento.", 500);
  }
}


import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { google } from "googleapis";
import { addMinutes, parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import { prisma } from "~/lib/prisma";
import { error, failure, success } from "~/lib/api-response";
import { formatZodError } from "~/lib/zod-utils";
import { resend } from "~/lib/mail";
import BookingConfirmationEmail from "~/emails/BookingConfirmation";

const SLOT_DURATION_MINUTES = 30;

const appointmentSchema = z.object({
  slug: z.string().min(1, "Slug do profissional é obrigatório"),
  date: z.string().datetime("Data inválida"),
  title: z.string().min(1, "Título / Serviço é obrigatório"),
  description: z.string().optional(),
  clientName: z.string().optional(),
  clientEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
  clientPhone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const authObj = await auth();
    const clientClerkId = authObj.userId;

    const body = await req.json();
    const parsed = appointmentSchema.safeParse(body);

    if (!parsed.success) {
      const errors = formatZodError(parsed.error);
      return failure("Dados inválidos", errors, 400);
    }

    const { slug, date, title, description, clientName, clientEmail, clientPhone } = parsed.data;

    // Se o cliente NÃO estiver logado, Nome e E-mail passam a ser obrigatórios no corpo da requisição
    if (!clientClerkId) {
      if (!clientName?.trim()) {
        return failure("Dados inválidos", [{ field: "clientName", message: "Nome é obrigatório para agendamento de visitante." }], 400);
      }
      if (!clientEmail?.trim()) {
        return failure("Dados inválidos", [{ field: "clientEmail", message: "E-mail é obrigatório para agendamento de visitante." }], 400);
      }
    }

    // Buscar o cliente logado no banco de dados local, se houver Clerk ID
    let clientUser = null;
    if (clientClerkId) {
      clientUser = await prisma.user.findUnique({
        where: { clerkId: clientClerkId },
      });
      if (!clientUser) {
        return error("Cadastro do cliente logado não encontrado no banco.", 404);
      }
    }

    // Buscar o profissional pelo slug
    const providerUser = await prisma.user.findUnique({
      where: { slug, role: "provider" },
    });

    if (!providerUser || !providerUser.clerkId) {
      return error("Profissional não encontrado.", 404);
    }

    // Buscar o serviço para obter preço e duração históricos
    const service = await prisma.service.findFirst({
      where: {
        providerId: providerUser.id,
        name: { equals: title, mode: "insensitive" },
      },
    });

    const price = service ? service.price : null;
    const duration = service ? service.duration : SLOT_DURATION_MINUTES;

    const startDateTime = parseISO(date);
    const endDateTime = addMinutes(startDateTime, duration);

    // Identificar informações de contato finais (seja do usuário logado ou do visitante)
    const guestName = clientUser ? clientUser.name : clientName;
    const guestEmail = clientUser ? clientUser.email : clientEmail;
    const guestPhone = clientUser ? "" : clientPhone;

    // Salvar o agendamento local no banco de dados
    const appointment = await prisma.appointment.create({
      data: {
        title,
        description,
        date: startDateTime,
        userId: clientUser ? clientUser.id : null,
        providerId: providerUser.id,
        price,
        duration,
        clientName: clientUser ? null : clientName || null,
        clientEmail: clientUser ? null : clientEmail || null,
        clientPhone: clientUser ? null : clientPhone || null,
      },
    });

    // Enviar e-mail de confirmação via Resend (não-bloqueante)
    if (guestEmail) {
      try {
        const formattedDate = format(startDateTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        const formattedTime = format(startDateTime, "HH:mm");

        resend.emails.send({
          from: "Agendify <onboarding@resend.dev>", // Sandbox default do Resend
          to: guestEmail,
          subject: `Confirmação de Agendamento: ${title}`,
          react: BookingConfirmationEmail({
            clientName: guestName,
            providerName: providerUser.name || providerUser.businessName || "Profissional",
            serviceTitle: title,
            date: formattedDate,
            time: formattedTime,
            brandColor: providerUser.brandColor,
          }),
        }).catch(err => console.error("Erro assíncrono ao enviar email Resend:", err));
      } catch (emailErr) {
        console.error("Erro ao preparar email Resend:", emailErr);
      }
    }

    // Tentar obter o token de acesso do Google OAuth do PROFISSIONAL via Clerk
    let googleToken: string | null = null;
    try {
      const clerk = await clerkClient();
      const oauthResponse = await clerk.users.getUserOauthAccessToken(
        providerUser.clerkId,
        "oauth_google"
      );

      googleToken = oauthResponse.data[0]?.token || null;
    } catch (oauthErr: unknown) {
      const err = oauthErr as { status?: number; message?: string };
      if (err?.status === 422) {
        console.warn(`[Aviso] O profissional (${providerUser.slug}) não possui a integração com o Google Calendar vinculada.`);
      } else {
        console.warn("Sem token do Google OAuth para o provider:", err?.message || oauthErr);
      }
    }

    // Se o profissional tiver integração com o Google Calendar, injeta o evento lá
    if (googleToken) {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: googleToken });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      try {
        const calResponse = await calendar.events.insert({
          calendarId: "primary",
          requestBody: {
            summary: `Agendify: ${title}`,
            description: description || `Agendamento realizado via Agendify.\nCliente: ${guestName || "Visitante"} (${guestEmail || ""})${guestPhone ? `\nTelefone: ${guestPhone}` : ""}`,
            start: {
              dateTime: startDateTime.toISOString(),
            },
            end: {
              dateTime: endDateTime.toISOString(),
            },
            attendees: guestEmail ? [
              { email: guestEmail, displayName: guestName || undefined },
            ] : [],
            reminders: {
              useDefault: true,
            },
          },
        });
        
        const googleEventId = calResponse.data.id;
        if (googleEventId) {
          await prisma.appointment.update({
            where: { id: appointment.id },
            data: { googleEventId },
          });
        }
        
        console.log(`Evento inserido com sucesso na agenda do profissional: ${providerUser.email}`);
      } catch (calErr) {
        console.error("Erro ao injetar evento no Google Calendar:", calErr);
        // Mesmo se falhar o Google Calendar, não quebramos a resposta pois o agendamento já foi salvo no Prisma.
      }
    }

    return success(appointment);
  } catch (err: unknown) {
    console.error("[POST /api/appointments]", err);
    return error("Erro interno ao criar o agendamento.", 500);
  }
}

export async function GET() {
  try {
    const authObj = await auth();
    const clerkId = authObj.userId;

    if (!clerkId) {
      return error("Não autorizado", 401);
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return error("Usuário não encontrado.", 404);
    }

    let appointments = [];
    let services: Array<{ id: string; name: string; price: number | null }> = [];

    if (dbUser.role === "provider") {
      // Se for profissional, lista todos os agendamentos marcados com ele
      appointments = await prisma.appointment.findMany({
        where: { providerId: dbUser.id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      });

      // Busca os serviços do profissional para cruzamento de preços no painel
      services = await prisma.service.findMany({
        where: { providerId: dbUser.id },
        select: {
          id: true,
          name: true,
          price: true,
        },
      });
    } else {
      // Se for cliente comum, lista os agendamentos que ele marcou
      appointments = await prisma.appointment.findMany({
        where: { userId: dbUser.id },
        include: {
          provider: {
            select: {
              name: true,
              businessName: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    }

    return success({ appointments, services });
  } catch (err: unknown) {
    console.error("[GET /api/appointments]", err);
    return error("Erro interno ao buscar agendamentos.", 500);
  }
}

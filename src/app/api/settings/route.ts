import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { prisma } from "~/lib/prisma";
import { error, failure, success } from "~/lib/api-response";
import { formatZodError } from "~/lib/zod-utils";

const settingsSchema = z.object({
  workingDays: z.array(z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ])).min(1, "Selecione pelo menos um dia de trabalho").optional(),
  workStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário de início inválido").optional(),
  workEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário de término inválido").optional(),
  brandColor: z.string().nullable().optional(),
  brandLogo: z.string().nullable().optional(),
});

export async function PUT(req: Request) {
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
      return error("Apenas profissionais podem configurar expediente.", 403);
    }

    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      const errors = formatZodError(parsed.error);
      return failure("Dados inválidos", errors, 400);
    }

    const { workingDays, workStart, workEnd, brandColor, brandLogo } = parsed.data;

    // Validar se o horário de término é após o de início se ambos forem informados
    if (workStart && workEnd) {
      const startMins = parseInt(workStart.split(":")[0]) * 60 + parseInt(workStart.split(":")[1]);
      const endMins = parseInt(workEnd.split(":")[0]) * 60 + parseInt(workEnd.split(":")[1]);

      if (endMins <= startMins) {
        return error("O horário de término deve ser após o horário de início.", 400);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: providerUser.id },
      data: {
        ...(workingDays && { workingDays }),
        ...(workStart && { workStart }),
        ...(workEnd && { workEnd }),
        ...(brandColor !== undefined && { brandColor }),
        ...(brandLogo !== undefined && { brandLogo }),
      },
    });

    return success({
      workingDays: updatedUser.workingDays,
      workStart: updatedUser.workStart,
      workEnd: updatedUser.workEnd,
      brandColor: updatedUser.brandColor,
      brandLogo: updatedUser.brandLogo,
    });
  } catch (err: unknown) {
    console.error("[PUT /api/settings]", err);
    return error("Erro interno ao salvar configurações.", 500);
  }
}

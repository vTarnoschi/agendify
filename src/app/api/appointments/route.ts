import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

import { prisma } from "~/lib/prisma";
import { verifyToken } from "~/lib/auth";
import { error, failure } from "~/lib/api-response";
import { formatZodError } from "~/lib/zod-utils";

const appointmentSchema = z.object({
  date: z.string().datetime(),
  description: z.string().optional(),
  title: z.string().nonempty("Título é obrigatório"),
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return error("Token ausente", 401);
    }

    const payload = await verifyToken(token);
    const userId = payload?.id;

    const body = await req.json();

    const parsed = appointmentSchema.safeParse(body);
    if (!parsed.success) {
      const errors = formatZodError(parsed.error);
      return failure("Dados inválidos", errors, 400);
    }

    const { date, description, title } = parsed.data;
    const appointment = await prisma.appointment.create({
      data: {
        title,
        userId,
        description,
        date: new Date(date),
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (err: unknown) {
    console.error("[POST /api/appointments]", err);
    return error("Erro interno ao criar agendamento", 500);
  }
}

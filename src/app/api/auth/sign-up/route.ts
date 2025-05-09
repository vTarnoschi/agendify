import { z } from "zod";
import { NextRequest } from "next/server";

import { prisma } from "~/lib/prisma";
import { hashPassword } from "~/lib/auth";
import { formatZodError } from "~/lib/zod-utils";
import { created, error, failure } from "~/lib/api-response";

const signupSchema = z.object({
  email: z
    .string()
    .nonempty("Este campo é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .nonempty("Este campo é obrigatório")
    .min(6, "Senha muito curta"),
  role: z.enum(["client", "provider"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    const errors = formatZodError(parsed.error);
    return failure("Dados inválidos", errors, 400);
  }

  const { email, role, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return error("Este email já está em uso.", 409);
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        role,
        email,
        password: hashedPassword,
      },
    });

    return created(req, user.id);
  } catch (err: unknown) {
    console.log("[POST /api/sign-up]", err);
    return error("Erro interno ao salvar usuário.", 500);
  }
}

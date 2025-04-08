import { z } from "zod";
import { NextRequest } from "next/server";

import { prisma } from "~/lib/prisma";
import { hashPassword } from "~/lib/auth";
import { formatZodError } from "~/lib/zod-utils";
import { created, error, failure } from "~/lib/api-response";

const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Nome muito curto")
    .max(50, "Nome muito longo")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no minímo 6 caracteres"),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    const errors = formatZodError(parsed.error);
    return failure("Dados inválidos", errors, 400);
  }

  const { email, name, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return error("Este email já está em uso.", 409);
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return created(req, user.id);
  } catch (err: unknown) {
    console.log("Erro ao salvar usuário: ", err);
    return error("Erro interno ao salvar usuário.", 500);
  }
}

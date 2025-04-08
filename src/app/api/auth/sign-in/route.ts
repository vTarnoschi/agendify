import { z } from "zod";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { prisma } from "~/lib/prisma";
import { generateToken } from "~/lib/auth";
import { formatZodError } from "~/lib/zod-utils";
import { comparePasswords } from "~/lib/auth";
import { failure, success, error } from "~/lib/api-response";

const signinSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha muito curta"),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = signinSchema.safeParse(body);
  if (!parsed.success) {
    const errors = formatZodError(parsed.error);
    return failure("Dados inválidos.", errors, 400);
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return error("Usuário não encontrado.", 404);
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return error("Senha incorreta.", 401);
    }

    const token = generateToken({ id: user.id });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });

    return success();
  } catch (err: unknown) {
    console.log("Erro ao realizar login: ", err);
    return error("Erro interno no servidor.", 500);
  }
}

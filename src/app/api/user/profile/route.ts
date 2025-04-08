import { NextRequest } from "next/server";

import { prisma } from "~/lib/prisma";
import { verifyToken } from "~/lib/auth";
import { error, success } from "~/lib/api-response";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return error("Token não encontrado", 401);
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    return error("Token inválido", 401);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
    });

    return success(user);
  } catch (err: unknown) {
    console.log("Erro ao buscar o perfil do usuário: ", err);
    return error("Erro interno no servidor.", 500);
  }
}

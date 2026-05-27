import { auth } from "@clerk/nextjs/server";

import { prisma } from "~/lib/prisma";
import { error, success } from "~/lib/api-response";

export async function GET() {
  try {
    const authObj = await auth();
    const clerkId = authObj.userId;

    if (!clerkId) {
      return error("Não autorizado", 401);
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        slug: true,
        workingDays: true,
        workStart: true,
        workEnd: true,
        brandColor: true,
        brandLogo: true,
        createdAt: true
      },
    });

    if (!user) {
      return error("Usuário não encontrado", 404);
    }

    return success(user);
  } catch (err: unknown) {
    console.error("Erro ao buscar o perfil do usuário: ", err);
    return error("Erro interno no servidor.", 500);
  }
}

import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { prisma } from "~/lib/prisma";
import { error, success, failure } from "~/lib/api-response";
import { formatZodError } from "~/lib/zod-utils";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

const updateServiceSchema = z.object({
  name: z.string().nonempty("Nome do serviço é obrigatório"),
  description: z.string().optional().nullable(),
  price: z.number().nullable().optional(),
  duration: z.number().min(5, "Duração mínima de 5 minutos"),
});

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const authObj = await auth();
    const clerkId = authObj.userId;

    if (!clerkId) {
      return error("Não autorizado.", 401);
    }

    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        providerId: true,
        provider: {
          select: { clerkId: true },
        },
      },
    });

    if (!service) {
      return error("Serviço não encontrado.", 404);
    }

    if (service.provider.clerkId !== clerkId) {
      return error("Você não tem permissão para editar este serviço.", 403);
    }

    const body = await req.json();
    const parsed = updateServiceSchema.safeParse(body);

    if (!parsed.success) {
      const errors = formatZodError(parsed.error);
      return failure("Dados inválidos", errors, 400);
    }

    const { name, description, price, duration } = parsed.data;

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        description: description ?? null,
        price: price ?? null,
        duration,
      },
    });

    return success(updatedService);
  } catch (err: unknown) {
    console.error("[PUT /api/services/[id]]", err);
    return error("Erro interno ao atualizar o serviço.", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const authObj = await auth();
    const clerkId = authObj.userId;

    if (!clerkId) {
      return error("Não autorizado.", 401);
    }

    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
      select: {
        id: true,
        provider: {
          select: { clerkId: true },
        },
      },
    });

    if (!service) {
      return error("Serviço não encontrado.", 404);
    }

    if (service.provider.clerkId !== clerkId) {
      return error("Você não tem permissão para remover este serviço.", 403);
    }

    await prisma.service.delete({
      where: { id },
    });

    return success({ message: "Serviço excluído com sucesso." });
  } catch (err: unknown) {
    console.error("[DELETE /api/services/[id]]", err);
    return error("Erro interno ao deletar o serviço.", 500);
  }
}

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { prisma } from "~/lib/prisma";
import { error, failure, success } from "~/lib/api-response";
import { formatZodError } from "~/lib/zod-utils";

const serviceSchema = z.object({
  name: z.string().nonempty("Nome do serviço é obrigatório"),
  description: z.string().optional().nullable(),
  price: z
    .number()
    .min(0, "O preço não pode ser negativo")
    .optional()
    .nullable(),
  duration: z
    .number()
    .min(5, "A duração mínima é de 5 minutos")
    .max(480, "Duração máxima de 8 horas"),
});

export async function GET() {
  try {
    const authObj = await auth();
    const clerkId = authObj.userId;

    if (!clerkId) {
      return error("Não autorizado.", 401);
    }

    const providerUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!providerUser) {
      return error("Usuário não encontrado.", 404);
    }

    const services = await prisma.service.findMany({
      where: { providerId: providerUser.id },
      orderBy: { createdAt: "desc" },
    });

    return success(services);
  } catch (err: unknown) {
    console.error("[GET /api/services]", err);
    return error("Erro interno ao buscar serviços.", 500);
  }
}

export async function POST(req: Request) {
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
      return error("Apenas profissionais podem cadastrar serviços.", 403);
    }

    const body = await req.json();
    const parsed = serviceSchema.safeParse(body);

    if (!parsed.success) {
      const errors = formatZodError(parsed.error);
      return failure("Dados inválidos", errors, 400);
    }

    const { name, description, price, duration } = parsed.data;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        duration,
        providerId: providerUser.id,
      },
    });

    return success(service);
  } catch (err: unknown) {
    console.error("[POST /api/services]", err);
    return error("Erro interno ao criar serviço.", 500);
  }
}

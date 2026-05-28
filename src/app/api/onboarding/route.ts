import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { prisma } from "~/lib/prisma";
import { error, success } from "~/lib/api-response";
import { formatZodError } from "~/lib/zod-utils";

const onboardingSchema = z.object({
  businessName: z
    .string()
    .min(2, "O nome do negócio precisa ter pelo menos 2 caracteres."),
  slug: z
    .string()
    .min(3, "O link personalizado precisa ter pelo menos 3 caracteres.")
    .regex(
      /^[a-z0-9-]+$/,
      "O link só pode conter letras minúsculas, números e hifens.",
    ),
});

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return error("Não autorizado", 401);
    }

    const clerkId = clerkUser.id;

    const body = await req.json();
    const validation = onboardingSchema.safeParse(body);

    if (!validation.success) {
      const formatted = formatZodError(validation.error);
      return error(formatted.map((err) => err.message).join(", "), 400);
    }

    const { businessName, slug } = validation.data;

    // Verificar se o slug já existe para OUTRO usuário
    const existingSlug = await prisma.user.findUnique({
      where: { slug },
    });

    if (existingSlug && existingSlug.clerkId !== clerkId) {
      return error(
        "Este link já está em uso por outro profissional. Escolha outro.",
        400,
      );
    }

    const primaryEmail =
      clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress || "";

    const name =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null;

    // Atualiza ou Cria o Prisma
    await prisma.user.upsert({
      where: { clerkId },
      update: {
        businessName,
        slug,
        role: "provider",
      },
      create: {
        clerkId,
        email: primaryEmail,
        name: name,
        businessName,
        slug,
        role: "provider",
      },
    });

    // Atualiza o Metadata do Clerk
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkId, {
      publicMetadata: {
        role: "provider",
      },
    });

    return success({ message: "Perfil configurado com sucesso!" });
  } catch (err: unknown) {
    console.error("Erro no onboarding: ", err);
    return error("Erro interno no servidor.", 500);
  }
}

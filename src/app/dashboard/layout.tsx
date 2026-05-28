import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

import { prisma } from "~/lib/prisma";
import DashboardShell from "~/features/dashboard/components/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();

  if (user) {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        role: true,
        slug: true,
      },
    });

    let dbRole = existingUser?.role ?? "client";

    if (!existingUser) {
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId,
      )?.emailAddress;

      if (primaryEmail) {
        const legacyUser = await prisma.user.findUnique({
          where: { email: primaryEmail },
          select: { id: true, role: true, email: true, clerkId: true },
        });

        if (legacyUser) {
          // Migração de usuário legado para Clerk Auth
          dbRole = legacyUser.role;
          await prisma.user.update({
            where: { email: primaryEmail },
            data: { clerkId: user.id },
          });
        } else {
          // Criação automática no fallback
          await prisma.user.create({
            data: {
              clerkId: user.id,
              email: primaryEmail,
              name:
                `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
              role: "client", // Role padrão
            },
          });
        }
      }
    }
    // Sincroniza o role para o publicMetadata do Clerk se ainda não existir ou estiver dessincronizado
    if (user.publicMetadata.role !== dbRole) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(user.id, {
        publicMetadata: {
          role: dbRole,
        },
      });
    }

    const finalExistingUser =
      existingUser ??
      (await prisma.user.findUnique({
        where: { clerkId: user.id },
        select: { id: true, role: true, slug: true },
      }));

    // Usuário novo ou sem slug ainda → manda para o onboarding para configurar o negócio.
    // Isso cobre o caso de usuários recém-cadastrados que ainda não definiram seu papel.
    if (!finalExistingUser?.slug) {
      redirect("/onboarding");
    }

    // Usuário já estabelecido como cliente tentando acessar o dashboard → redireciona para a Home.
    if (finalExistingUser?.role !== "provider") {
      redirect("/");
    }
  }

  return <DashboardShell>{children}</DashboardShell>;
}

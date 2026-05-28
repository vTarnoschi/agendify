import { notFound } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { CalendarX2 } from "lucide-react";
import { prisma } from "~/lib/prisma";
import PublicBooking from "~/features/booking/components/public-booking";

interface PublicProfileProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicProfilePage({
  params,
}: PublicProfileProps) {
  const { slug } = await params;

  // Busca o profissional pelo slug
  const provider = await prisma.user.findUnique({
    where: { slug, role: "provider" },
    select: {
      clerkId: true,
      name: true,
      businessName: true,
      category: true,
      brandColor: true,
      brandLogo: true,
      services: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          duration: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!provider || !provider.clerkId) {
    notFound();
  }

  // Verifica se o profissional vinculou o Google Calendar
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(provider.clerkId);
  const hasGoogleConnected = clerkUser.externalAccounts.some(
    (acc) => acc.provider === "oauth_google" || acc.provider === "google",
  );

  if (!hasGoogleConnected) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <CalendarX2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Agenda Indisponível</h2>
          <p className="text-muted-foreground">
            {provider.businessName || provider.name} ainda não ativou a
            sincronização de agenda. Por favor, tente novamente mais tarde ou
            entre em contato diretamente.
          </p>
        </div>
      </div>
    );
  }

  if (provider.services.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <CalendarX2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Agenda Indisponível</h2>
          <p className="text-muted-foreground">
            Este profissional ainda está configurando seus serviços. Por favor,
            volte mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <PublicBooking
        slug={slug}
        providerName={provider.name || ""}
        businessName={provider.businessName}
        category={provider.category}
        brandColor={provider.brandColor}
        brandLogo={provider.brandLogo}
        initialServices={provider.services}
      />
    </div>
  );
}

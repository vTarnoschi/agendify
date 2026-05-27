import { notFound } from "next/navigation";
import { prisma } from "~/lib/prisma";
import PublicBooking from "~/features/booking/components/public-booking";

interface PublicProfileProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicProfilePage({ params }: PublicProfileProps) {
  const { slug } = await params;

  // Busca o profissional pelo slug
  const provider = await prisma.user.findUnique({
    where: { slug, role: "provider" },
    select: {
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
    }
  });

  if (!provider) {
    notFound();
  }

  return (
    <div className="forced-light min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
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

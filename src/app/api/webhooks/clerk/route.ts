import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "~/lib/prisma";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const email = evt.data.email_addresses[0]?.email_address;
    const name =
      `${evt.data.first_name || ""} ${evt.data.last_name || ""}`.trim() || null;

    if (email && id) {
      // Sincroniza usuário com o Prisma
      const legacyUser = await prisma.user.findUnique({
        where: { email },
      });

      let dbRole = "client";
      let localUser = null;

      if (legacyUser) {
        dbRole = legacyUser.role;
        localUser = await prisma.user.update({
          where: { email },
          data: { clerkId: id, name },
        });
      } else {
        localUser = await prisma.user.upsert({
          where: { clerkId: id },
          update: { email, name },
          create: {
            clerkId: id,
            email,
            name,
            role: "client", // Default role for new users
          },
        });
      }

      // Unificação Retroativa: Vincula agendamentos passados do visitante ao novo userId
      if (localUser) {
        await prisma.appointment.updateMany({
          where: {
            clientEmail: email,
            userId: null,
          },
          data: {
            userId: localUser.id,
          },
        });
      }

      // Sincroniza metadata no Clerk
      const client = await clerkClient();
      await client.users.updateUserMetadata(id, {
        publicMetadata: {
          role: dbRole,
        },
      });
    }
  }

  return new Response("Webhook received", { status: 200 });
}

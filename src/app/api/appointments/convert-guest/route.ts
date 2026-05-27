import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { error, failure, success } from "~/lib/api-response";
import { formatZodError } from "~/lib/zod-utils";

const convertGuestSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = convertGuestSchema.safeParse(body);

    if (!parsed.success) {
      const errors = formatZodError(parsed.error);
      return failure("Dados inválidos", errors, 400);
    }

    const { name, email, password } = parsed.data;

    const clerk = await clerkClient();

    try {
      // Criar o usuário de forma programática usando o Clerk Backend API
      const clerkUser = await clerk.users.createUser({
        emailAddress: [email],
        password: password,
        firstName: name,
        publicMetadata: {
          role: "client",
        },
      });

      return success({
        id: clerkUser.id,
        email: email,
        name: name,
        role: "client",
      });
    } catch (clerkErr: unknown) {
      console.error("Erro interno do Clerk no createUser:", clerkErr);
      
      const errorPayload = clerkErr as {
        errors?: Array<{ code?: string; message?: string }>;
        message?: string;
      };

      // Capturar mensagens de erro específicas do Clerk (ex: email já cadastrado, senha fraca, etc.)
      const isDuplicateEmail = errorPayload.errors?.some(
        (e) => e.code === "form_identifier_exists" || e.message?.includes("already exists")
      );

      if (isDuplicateEmail) {
        return error("Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.", 400);
      }

      const errorMessage = errorPayload.errors?.[0]?.message || errorPayload.message || "Erro desconhecido ao criar usuário no Clerk.";
      return error(errorMessage, 400);
    }
  } catch (err: unknown) {
    console.error("[POST /api/appointments/convert-guest]", err);
    return error("Erro interno ao processar a conversão do visitante.", 500);
  }
}

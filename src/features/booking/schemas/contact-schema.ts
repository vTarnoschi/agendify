import * as z from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "O nome completo é obrigatório"),
  email: z.string().email("Endereço de e-mail inválido"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .refine(
      (val) => val.replace(/\D/g, "").length >= 10,
      "Telefone inválido — informe DDD + número (ex: (11) 99999-9999)"
    ),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

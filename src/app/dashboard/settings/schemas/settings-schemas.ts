import { z } from "zod";

export const expedienteSchema = z.object({
  workingDays: z.array(z.string()).min(1, {
    message: "Selecione pelo menos um dia útil para atendimento.",
  }),
  workStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Horário de início inválido.",
  }),
  workEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Horário de término inválido.",
  }),
});

export type ExpedienteFormValues = z.infer<typeof expedienteSchema>;

export const serviceSchema = z.object({
  name: z.string().min(2, {
    message: "O nome do serviço deve ter pelo menos 2 caracteres.",
  }),
  description: z
    .string()
    .max(200, {
      message: "A descrição deve ter no máximo 200 caracteres.",
    })
    .optional()
    .nullable(),
  price: z.string().optional().nullable(),
  duration: z.string(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const visualSchema = z.object({
  brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, {
    message: "A cor do tema deve ser um hexadecimal válido (ex: #7c3aed).",
  }),
  brandLogo: z.string().optional().nullable(),
});

export type VisualFormValues = z.infer<typeof visualSchema>;

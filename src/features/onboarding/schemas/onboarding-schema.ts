import { z } from "zod";

export const onboardingSchema = z.object({
  businessName: z.string().min(2, {
    message: "O nome do negócio deve ter pelo menos 2 caracteres.",
  }),
  slug: z
    .string()
    .min(2, {
      message: "O link personalizado deve ter pelo menos 2 caracteres.",
    })
    .max(40, {
      message: "O link personalizado deve ter no máximo 40 caracteres.",
    })
    .regex(/^[a-z0-9-]+$/, {
      message: "O link deve conter apenas letras minúsculas, números e hifens.",
    }),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

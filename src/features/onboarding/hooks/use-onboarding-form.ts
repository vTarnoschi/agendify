import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboardingMutation } from "../queries/use-onboarding";
import {
  onboardingSchema,
  OnboardingFormValues,
} from "../schemas/onboarding-schema";

export function useOnboardingForm() {
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onboardingMutation = useOnboardingMutation();
  const router = useRouter();

  // Instanciando o React Hook Form com Zod resolver
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      businessName: "",
      slug: "",
    },
    mode: "onChange",
  });

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("businessName", value, { shouldValidate: true });

    // Se o usuário não mexeu no slug manualmente, geramos um automaticamente
    if (!isSlugManuallyEdited) {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .normalize("NFD") // Remove acentos
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres não alfanuméricos exceto espaços/hifens
        .replace(/\s+/g, "-") // Troca espaços por hifens
        .replace(/-+/g, "-") // Evita múltiplos hifens seguidos
        .substring(0, 40); // Limite de 40 caracteres

      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    const value = e.target.value;
    const formattedSlug = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    form.setValue("slug", formattedSlug, { shouldValidate: true });
  };

  const onSubmit = (values: OnboardingFormValues) => {
    setError(null);

    // Limpeza final do slug antes de enviar (tira hifens das pontas)
    const finalSlug = values.slug.replace(/^-+|-+$/g, "");

    onboardingMutation.mutate(
      { businessName: values.businessName, slug: finalSlug },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (err: Error) => {
          setError(err.message || "Erro ao salvar os dados.");
        },
      },
    );
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    form,
    handleBusinessNameChange,
    handleSlugChange,
    handleSubmit,
    loading: onboardingMutation.isPending,
    error,
  };
}

export type OnboardingFormType = ReturnType<typeof useOnboardingForm>;

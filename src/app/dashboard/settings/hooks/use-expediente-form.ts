import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "~/features/auth/queries/use-auth";
import { useUpdateSettingsMutation } from "~/queries/use-settings";
import {
  expedienteSchema,
  ExpedienteFormValues,
} from "../schemas/settings-schemas";

export function useExpedienteForm() {
  const { user } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const updateSettingsMutation = useUpdateSettingsMutation();

  const form = useForm<ExpedienteFormValues>({
    resolver: zodResolver(expedienteSchema),
    defaultValues: {
      workingDays: user?.workingDays || [],
      workStart: user?.workStart || "09:00",
      workEnd: user?.workEnd || "18:00",
    },
    mode: "onChange",
  });

  // Sincroniza com dados do backend quando o user carregar
  useEffect(() => {
    if (user) {
      form.reset({
        workingDays: user.workingDays || [],
        workStart: user.workStart || "09:00",
        workEnd: user.workEnd || "18:00",
      });
    }
  }, [user, form]);

  const onSubmit = (values: ExpedienteFormValues) => {
    setErrorMsg("");

    updateSettingsMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Jornada de trabalho atualizada com sucesso!");
      },
      onError: (err: Error) => {
        const msg = err.message || "Erro ao salvar expediente.";
        setErrorMsg(msg);
        toast.error(msg);
      },
    });
  };

  const handleToggleDay = (dayId: string) => {
    const currentDays = form.getValues("workingDays") || [];
    const newDays = currentDays.includes(dayId)
      ? currentDays.filter((d) => d !== dayId)
      : [...currentDays, dayId];

    form.setValue("workingDays", newDays, { shouldValidate: true });
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    handleToggleDay,
    errorMsg,
    loading: updateSettingsMutation.isPending,
  };
}

export type ExpedienteFormType = ReturnType<typeof useExpedienteForm>;

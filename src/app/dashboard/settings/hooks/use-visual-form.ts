import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "~/features/auth/queries/use-auth";
import { useUpdateSettingsMutation } from "~/queries/use-settings";
import { visualSchema, VisualFormValues } from "../schemas/settings-schemas";

export function useVisualForm() {
  const { user } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const updateSettingsMutation = useUpdateSettingsMutation();

  const form = useForm<VisualFormValues>({
    resolver: zodResolver(visualSchema),
    defaultValues: {
      brandColor: user?.brandColor || "#18181b",
      brandLogo: user?.brandLogo || "",
    },
    mode: "onChange",
  });

  // Sincroniza com dados do backend quando o user carregar
  useEffect(() => {
    if (user) {
      form.reset({
        brandColor: user.brandColor || "#18181b",
        brandLogo: user.brandLogo || "",
      });
    }
  }, [user, form]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    setErrorMsg("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
        form.setValue("brandLogo", compressedBase64, { shouldValidate: true });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: VisualFormValues) => {
    setErrorMsg("");

    updateSettingsMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Identidade visual salva com sucesso!");
      },
      onError: (err: Error) => {
        const msg = err.message || "Erro ao salvar personalização visual.";
        setErrorMsg(msg);
        toast.error(msg);
      },
    });
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    handleLogoUpload,
    errorMsg,
    loading: updateSettingsMutation.isPending,
  };
}

export type VisualFormType = ReturnType<typeof useVisualForm>;

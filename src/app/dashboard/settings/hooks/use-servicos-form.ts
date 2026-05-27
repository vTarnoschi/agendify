import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation
} from "~/queries/use-services";
import { ServiceType } from "~/services/services-service";
import { serviceSchema, ServiceFormValues } from "../schemas/settings-schemas";

export function useServicosForm() {
  const { data: services = [], isLoading: loadingServices } = useServicesQuery();
  const createServiceMutation = useCreateServiceMutation();
  const updateServiceMutation = useUpdateServiceMutation();
  const deleteServiceMutation = useDeleteServiceMutation();

  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      duration: "30",
    },
    mode: "onChange",
  });

  const handleStartEdit = (srv: ServiceType) => {
    setEditingService(srv);
    form.reset({
      name: srv.name,
      description: srv.description || "",
      price: srv.price !== null && srv.price !== undefined ? srv.price.toFixed(2) : "",
      duration: srv.duration.toString(),
    });
    setErrorMsg("");
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    form.reset({
      name: "",
      description: "",
      price: "",
      duration: "30",
    });
    setErrorMsg("");
  };

  const handlePriceBlur = () => {
    const value = form.getValues("price")
    if (value) {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        form.setValue("price", parsed.toFixed(2), { shouldValidate: true });
      }
    }
  };

  const onSubmit = (values: ServiceFormValues) => {
    setErrorMsg("");

    const payload = {
      name: values.name,
      description: values.description || null,
      price: values.price ? parseFloat(values.price) : null,
      duration: parseInt(values.duration, 10),
    };

    if (editingService) {
      updateServiceMutation.mutate(
        { id: editingService.id, payload },
        {
          onSuccess: () => {
            handleCancelEdit();
            toast.success("Serviço atualizado com sucesso!");
          },
          onError: (err: Error) => {
            const msg = err.message || "Erro ao atualizar o serviço.";
            setErrorMsg(msg);
            toast.error(msg);
          },
        }
      );
    } else {
      createServiceMutation.mutate(payload, {
        onSuccess: () => {
          handleCancelEdit();
          toast.success("Serviço adicionado com sucesso!");
        },
        onError: (err: Error) => {
          const msg = err.message || "Erro ao cadastrar serviço.";
          setErrorMsg(msg);
          toast.error(msg);
        },
      });
    }
  };

  const handleDeleteService = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    if (editingService?.id === id) {
      handleCancelEdit();
    }

    setErrorMsg("");

    deleteServiceMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Serviço removido com sucesso!");
      },
      onError: (err: Error) => {
        const msg = err.message || "Erro ao excluir o serviço.";
        setErrorMsg(msg);
        toast.error(msg);
      },
    });
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    services,
    loadingServices,
    editingService,
    handleStartEdit,
    handleCancelEdit,
    handlePriceBlur,
    handleDeleteService,
    errorMsg,
    creatingService: createServiceMutation.isPending || updateServiceMutation.isPending,
    deletingServiceId: deleteServiceMutation.isPending ? deleteServiceMutation.variables : null,
  };
}

export type ServicosFormType = ReturnType<typeof useServicosForm>;

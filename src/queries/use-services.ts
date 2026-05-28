import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  ServiceType,
  ServicePayload,
} from "~/services/services-service";

export function useServicesQuery() {
  return useQuery<ServiceType[]>({
    queryKey: ["services"],
    queryFn: getServices,
  });
}

export function useCreateServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation<ServiceType, Error, ServicePayload>({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ServiceType,
    Error,
    { id: string; payload: ServicePayload }
  >({
    mutationFn: ({ id, payload }) => updateService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSettings, SettingsPayload } from "~/services/settings-service";
import { ApiResponse } from "~/services/services-service";

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<SettingsPayload>, Error, SettingsPayload>({
    mutationFn: updateSettings,
    onSuccess: () => {
      // Invalida a query do usuário logado para manter sidebar e componentes sincronizados
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  submitOnboarding,
  OnboardingPayload,
} from "~/services/onboarding-service";

export function useOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, OnboardingPayload>({
    mutationFn: submitOnboarding,
    onSuccess: () => {
      // Invalida a query do usuario para sincronizar que ele agora tem slug e completou o onboarding
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

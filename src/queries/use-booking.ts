import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAvailability,
  createPublicAppointment,
  convertGuestAccount,
  AvailabilityParams,
  CreateBookingPayload,
  ConvertGuestPayload,
} from "~/services/booking-service";
import { useSignIn, useClerk } from "@clerk/nextjs";

export function useAvailabilityQuery(
  params: AvailabilityParams,
  enabled: boolean = true,
) {
  return useQuery<string[]>({
    queryKey: ["availability", params.slug, params.date, params.serviceId],
    queryFn: () => getAvailability(params),
    enabled,
    staleTime: 0, // Garante que a disponibilidade seja sempre fresca
  });
}

export function useCreatePublicAppointmentMutation() {
  return useMutation<boolean, Error, CreateBookingPayload>({
    mutationFn: createPublicAppointment,
  });
}

export function useConvertGuestMutation() {
  const { signIn } = useSignIn() as unknown as {
    signIn?: {
      create: (params: {
        identifier: string;
        password?: string;
      }) => Promise<{ status: string; createdSessionId: string | null }>;
    };
  };
  const { setActive } = useClerk();

  return useMutation<boolean, Error, ConvertGuestPayload>({
    mutationFn: async (payload) => {
      // 1. Criar o usuário localmente e no Clerk via API
      await convertGuestAccount(payload);

      // 2. Fazer login transparente via useSignIn do Clerk
      if (signIn && payload.password) {
        const result = await signIn.create({
          identifier: payload.email,
          password: payload.password,
        });

        if (result.status === "complete" && setActive) {
          await setActive({ session: result.createdSessionId });
          return true;
        } else {
          throw new Error(
            "Não foi possível realizar o login automático. Use o formulário padrão.",
          );
        }
      }
      return false;
    },
  });
}

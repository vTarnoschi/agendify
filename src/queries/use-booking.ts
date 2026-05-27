import { useQuery, useMutation } from "@tanstack/react-query";
import { getAvailability, createPublicAppointment, AvailabilityParams, CreateBookingPayload } from "~/services/booking-service";

export function useAvailabilityQuery(params: AvailabilityParams, enabled: boolean = true) {
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

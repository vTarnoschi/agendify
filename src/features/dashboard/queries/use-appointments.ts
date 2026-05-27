import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAppointments, cancelAppointment, AppointmentsResponseData } from "~/services/appointments-service";

export function useAppointmentsQuery() {
  return useQuery<AppointmentsResponseData>({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });
}

export function useCancelAppointmentMutation() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

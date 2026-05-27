import { useState, useMemo, useCallback } from "react";
import { parseISO, isToday } from "date-fns";
import { useAuth } from "~/features/auth/queries/use-auth";
import { useAppointmentsQuery, useCancelAppointmentMutation } from "../queries/use-appointments";

export function useDashboardState() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  // React Query Calls
  const { data, isLoading: loadingAppointments, error: appointmentsError } = useAppointmentsQuery();
  const cancelMutation = useCancelAppointmentMutation();

  const appointments = useMemo(() => data?.appointments || [], [data?.appointments]);
  const dbServices = useMemo(() => data?.services || [], [data?.services]);

  // Local state for copy link feedback
  const [copied, setCopied] = useState(false);
  const [cancelErrorMsg, setCancelErrorMsg] = useState("");

  const errorMsg = cancelErrorMsg || (appointmentsError?.message ? appointmentsError.message : "");

  const handleCopyLink = useCallback(() => {
    if (!user?.slug) return;
    const publicLink = `${window.location.origin}/${user.slug}`;
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [user?.slug]);

  const handleCancelAppointment = useCallback(async (id: string) => {
    setCancelErrorMsg("");
    cancelMutation.mutate(id, {
      onError: (err: Error) => {
        setCancelErrorMsg(err.message || "Erro ao cancelar o agendamento.");
      }
    });
  }, [cancelMutation]);

  const metrics = useMemo(() => {
    const totalBookings = appointments.length;

    const todayBookings = appointments.filter((appt) => {
      const apptDate = parseISO(appt.date);
      return isToday(apptDate);
    }).length;

    const nextAppointment = appointments
      .filter((appt) => parseISO(appt.date) > new Date())
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())[0];

    const estimatedRevenue = appointments.reduce((sum, appt) => {
      if (appt.price !== undefined && appt.price !== null) {
        return sum + appt.price;
      }
      const matchedService = dbServices.find(
        (srv) => srv.name.toLowerCase() === appt.title.toLowerCase()
      );
      const price = matchedService ? (matchedService.price ?? 0) : 50;
      return sum + price;
    }, 0);

    const daysCounts = [0, 0, 0, 0, 0, 0, 0];
    appointments.forEach((appt) => {
      const dateObj = parseISO(appt.date);
      daysCounts[dateObj.getDay()] += 1;
    });

    const orderedCounts = [
      daysCounts[1], // Seg
      daysCounts[2], // Ter
      daysCounts[3], // Qua
      daysCounts[4], // Qui
      daysCounts[5], // Sex
      daysCounts[6], // Sáb
      daysCounts[0], // Dom
    ];
    const orderedLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
    const maxCount = Math.max(...orderedCounts, 1);

    return {
      totalBookings,
      todayBookings,
      nextAppointment,
      estimatedRevenue,
      orderedCounts,
      orderedLabels,
      maxCount,
    };
  }, [appointments, dbServices]);

  return {
    // Auth and status states
    user,
    authLoading,
    isAuthenticated,
    loading: loadingAppointments,
    errorMsg,
    setCancelErrorMsg,

    // Link states
    copied,
    handleCopyLink,

    // Appointments states & mutations
    appointments,
    cancellingId: cancelMutation.isPending ? cancelMutation.variables : null,
    handleCancelAppointment,

    // Computed metrics
    totalBookings: metrics.totalBookings,
    todayBookings: metrics.todayBookings,
    estimatedRevenue: metrics.estimatedRevenue,
    nextAppointment: metrics.nextAppointment,

    // Chart metrics
    orderedCounts: metrics.orderedCounts,
    orderedLabels: metrics.orderedLabels,
    maxCount: metrics.maxCount,
  };
}

export type DashboardStateType = ReturnType<typeof useDashboardState>;

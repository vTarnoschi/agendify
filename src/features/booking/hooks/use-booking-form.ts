import { useState, useEffect, useMemo, useCallback } from "react";
import { format, startOfWeek, addDays, startOfDay } from "date-fns";
import { useAvailabilityQuery, useCreatePublicAppointmentMutation } from "~/queries/use-booking";

export interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  duration: number;
}

interface UseBookingFormProps {
  slug: string;
  initialServices: ServiceType[];
  defaultServices: ServiceType[];
}

export function useBookingForm({ slug, initialServices, defaultServices }: UseBookingFormProps) {
  const servicesList = initialServices.length > 0 ? initialServices : defaultServices;

  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [bookingStatus, setBookingStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceType>(servicesList[0]);

  // Estados exclusivos para o fluxo de visitante (Guest Booking)
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Controle de paginação da semana do calendário
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // React Query para buscar disponibilidade
  const formattedDateStr = format(selectedDate, "yyyy-MM-dd");
  const { data: slots = [], isLoading: loadingSlots } = useAvailabilityQuery(
    {
      slug,
      date: formattedDateStr,
      serviceId: selectedService.id,
    },
    bookingStatus !== "success"
  );

  const createAppointmentMutation = useCreatePublicAppointmentMutation();

  // Zera o horário selecionado ao mudar de data ou serviço
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate, selectedService]);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  }, []);

  const handlePrevWeek = useCallback(() => {
    // Evita navegar para semanas passadas
    const minWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    setCurrentWeekStart((prev) => (prev > minWeek ? addDays(prev, -7) : prev));
  }, []);

  const handleConfirmBooking = useCallback(async (guestData?: { name: string; email: string; phone?: string }) => {
    if (!selectedTime) return;
    setBookingStatus("submitting");
    setErrorMessage("");

    const timeParts = selectedTime.split(":");
    const bookingDateTime = new Date(selectedDate);
    bookingDateTime.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);

    // Salvar no estado se fornecido via argumento do modal de visitante
    if (guestData) {
      setClientName(guestData.name);
      setClientEmail(guestData.email);
      if (guestData.phone) setClientPhone(guestData.phone);
    }

    createAppointmentMutation.mutate(
      {
        slug,
        date: bookingDateTime.toISOString(),
        title: selectedService.name,
        description: notes,
        clientName: guestData?.name || clientName || undefined,
        clientEmail: guestData?.email || clientEmail || undefined,
        clientPhone: guestData?.phone || clientPhone || undefined,
      },
      {
        onSuccess: (success) => {
          if (success) {
            setBookingStatus("success");
          } else {
            setBookingStatus("error");
            setErrorMessage("Erro ao processar o agendamento.");
          }
        },
        onError: (err: Error) => {
          setBookingStatus("error");
          setErrorMessage(err.message || "Erro de conexão com o servidor.");
        },
      }
    );
  }, [selectedTime, selectedDate, selectedService, notes, clientName, clientEmail, clientPhone, slug, createAppointmentMutation]);

  // Gerar dias da semana atual memoizado
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  return {
    servicesList,
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    notes,
    setNotes,
    bookingStatus,
    setBookingStatus,
    errorMessage,
    setErrorMessage,
    currentWeekStart,
    handleNextWeek,
    handlePrevWeek,
    slots,
    loadingSlots,
    handleConfirmBooking,
    weekDays,
    // Estados expostos para o modal de visitante
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientPhone,
    setClientPhone,
    isContactModalOpen,
    setIsContactModalOpen,
  };
}

export type BookingFormType = ReturnType<typeof useBookingForm>;

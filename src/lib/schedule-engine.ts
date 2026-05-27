import { addMinutes, format, parseISO, isBefore, startOfDay } from "date-fns";

export interface ScheduleEngineParams {
  targetDate: Date;
  slotDuration: number;
  workStart: string; // "HH:mm"
  workEnd: string; // "HH:mm"
  busySlots: Array<{ start: string; end: string }>;
  now?: Date; // Opcional para injeção de dependência em testes
}

/**
 * Motor puro de cálculo de horários.
 * Avalia expediente, duração de serviço, e filtra conflitos (ocupados e passados).
 */
export function calculateAvailableSlots({
  targetDate,
  slotDuration,
  workStart,
  workEnd,
  busySlots,
  now = new Date(),
}: ScheduleEngineParams): string[] {
  const dayStart = startOfDay(targetDate);

  const startParts = workStart.split(":");
  const startHour = parseInt(startParts[0]);
  const startMin = parseInt(startParts[1]);

  const endParts = workEnd.split(":");
  const endHour = parseInt(endParts[0]);
  const endMin = parseInt(endParts[1]);

  const slots: string[] = [];
  let currentSlot = addMinutes(dayStart, startHour * 60 + startMin);
  const workEndSlot = addMinutes(dayStart, endHour * 60 + endMin);

  while (isBefore(currentSlot, workEndSlot)) {
    const slotStart = currentSlot;
    const slotEnd = addMinutes(currentSlot, slotDuration);

    // Garante que o slot gerado não ultrapasse o final do expediente
    if (slotEnd > workEndSlot) {
      break;
    }

    // Verifica se o slot está dentro de algum período ocupado (Banco ou Google)
    const isBusy = busySlots.some((busy) => {
      const busyStart = parseISO(busy.start);
      const busyEnd = parseISO(busy.end);

      // Um slot está ocupado se há sobreposição (overlap)
      return slotStart < busyEnd && slotEnd > busyStart;
    });

    // Só adiciona se o horário não estiver ocupado e for no futuro
    if (!isBusy && slotStart > now) {
      slots.push(format(slotStart, "HH:mm"));
    }

    currentSlot = slotEnd;
  }

  return slots;
}

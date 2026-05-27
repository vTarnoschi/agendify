import { describe, it, expect } from "vitest";
import { calculateAvailableSlots } from "../lib/schedule-engine";

describe("Schedule Engine", () => {
  // Use local time without 'Z' to avoid UTC offsets making the date jump to the previous day
  const baseDate = new Date("2026-05-22T12:00:00");

  it("deve gerar horários básicos de 30 minutos", () => {
    const slots = calculateAvailableSlots({
      targetDate: baseDate,
      slotDuration: 30,
      workStart: "08:00",
      workEnd: "10:00",
      busySlots: [],
      now: new Date("2026-05-21T12:00:00"),
    });

    expect(slots).toEqual(["08:00", "08:30", "09:00", "09:30"]);
  });

  it("deve filtrar horários no passado", () => {
    const slots = calculateAvailableSlots({
      targetDate: baseDate,
      slotDuration: 30,
      workStart: "08:00",
      workEnd: "10:00",
      busySlots: [],
      // 'now' às 09:15 do mesmo dia (horário local)
      now: new Date("2026-05-22T09:15:00"),
    });

    // Os slots de 08:00, 08:30 e 09:00 ficaram no passado
    expect(slots).toEqual(["09:30"]);
  });

  it("não deve agendar serviços longos próximos ao fim do expediente", () => {
    // Serviço de 90 minutos (1h30). Expediente termina às 10:00.
    const slots = calculateAvailableSlots({
      targetDate: baseDate,
      slotDuration: 90,
      workStart: "08:00",
      workEnd: "10:00",
      busySlots: [],
      now: new Date("2026-05-21T12:00:00"),
    });

    // Como o sistema pula de N em N minutos (N = slotDuration = 90),
    // o 1º slot testado é 08:00. O 2º testado é 09:30.
    // Mas o slot de 09:30 terminaria às 11:00 (passa das 10:00).
    // Então apenas 08:00 sobrevive.
    expect(slots).toEqual(["08:00"]);
  });

  it("deve bloquear horários sobrepostos (Edge Case de Duplicidade ou Google Calendar)", () => {
    // Ocupado das 08:30 às 09:00 (horário local)
    const busy = [
      {
        start: "2026-05-22T08:30:00",
        end: "2026-05-22T09:00:00",
      },
    ];

    const slots = calculateAvailableSlots({
      targetDate: baseDate,
      slotDuration: 30,
      workStart: "08:00",
      workEnd: "10:00",
      busySlots: busy,
      now: new Date("2026-05-21T12:00:00"),
    });

    // 08:30 deve desaparecer
    expect(slots).toEqual(["08:00", "09:00", "09:30"]);
  });

  it("deve bloquear serviços grandes se um slot pequeno estiver ocupado no meio", () => {
    // Serviço de 1 hora (60min). Evento local às 09:00.
    const busy = [
      {
        start: "2026-05-22T09:00:00",
        end: "2026-05-22T09:15:00",
      },
    ];

    const slots = calculateAvailableSlots({
      targetDate: baseDate,
      slotDuration: 60,
      workStart: "08:00",
      workEnd: "10:00",
      busySlots: busy,
      now: new Date("2026-05-21T12:00:00"),
    });

    // iter 1: 08:00 as 09:00. Livre. (O evento ocupado começa exatamente às 09:00, mas o agendamento termina às 09:00. slotEnd > busyStart seria 09:00 > 09:00, o que é Falso! Portanto não conflita).
    // iter 2: 09:00 as 10:00. Conflita! (09:00 < 09:15 && 10:00 > 09:00 => true)
    expect(slots).toEqual(["08:00"]);
  });
});

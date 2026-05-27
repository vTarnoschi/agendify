import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import { BookingFormType } from "../hooks/use-booking-form";

interface CalendarCarouselProps {
  form: BookingFormType;
}

export function CalendarCarousel({ form }: CalendarCarouselProps) {
  const {
    weekDays,
    selectedDate,
    setSelectedDate,
    handlePrevWeek,
    handleNextWeek,
  } = form;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-foreground">2. Escolha o Dia</h3>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevWeek}
            className="h-8 w-8 cursor-pointer rounded-lg border-border"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextWeek}
            className="h-8 w-8 cursor-pointer rounded-lg border-border"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekDays.map((day) => {
          const isSelected = isSameDay(selectedDate, day);
          const isTodayDay = isSameDay(new Date(), day);
          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center p-2.5 sm:p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-[var(--brand-color)] bg-[var(--brand-color)] text-white shadow-sm font-bold"
                  : "border-border hover:bg-accent/40 bg-card text-foreground"
              }`}
            >
              <span className="text-[10px] sm:text-xs uppercase font-bold opacity-80">
                {format(day, "eee", { locale: ptBR })}
              </span>
              <span className="text-sm sm:text-lg font-extrabold mt-1">
                {format(day, "d")}
              </span>
              {isTodayDay && !isSelected && (
                <div className="h-1 w-1 rounded-full bg-[var(--brand-color)] mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

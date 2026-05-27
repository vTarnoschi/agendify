import { Clock } from "lucide-react";
import { cn } from "~/lib/utils";
import { BookingFormType } from "../hooks/use-booking-form";

interface SlotsGridProps {
  form: BookingFormType;
}

export function SlotsGrid({ form }: SlotsGridProps) {
  const { slots, selectedTime, setSelectedTime, loadingSlots } = form;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-foreground">3. Selecione o Horário</h3>

      {loadingSlots ? (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-accent/40 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : slots.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedTime(time)}
                className={cn(
                  "min-h-[44px] py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold text-center transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
                  isSelected
                    ? "border-[var(--brand-color)] bg-[var(--brand-color)] text-white shadow-sm"
                    : "border-border hover:bg-accent/50 bg-card text-foreground"
                )}
              >
                {time}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed rounded-2xl bg-accent/10 flex flex-col gap-2">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-xs text-muted-foreground font-semibold">Indisponível neste dia. Selecione outra data.</p>
        </div>
      )}
    </div>
  );
}

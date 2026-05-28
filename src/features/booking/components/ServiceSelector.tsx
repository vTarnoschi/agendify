import { Clock } from "lucide-react";
import { cn } from "~/lib/utils";
import { BookingFormType } from "../hooks/use-booking-form";

interface ServiceSelectorProps {
  form: BookingFormType;
}

export function ServiceSelector({ form }: ServiceSelectorProps) {
  const { servicesList, selectedService, setSelectedService } = form;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-foreground">
        1. Selecione o Serviço
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {servicesList.map((service) => {
          const isSelected = selectedService.id === service.id;
          return (
            <button
              key={service.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedService(service)}
              className={cn(
                "p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                  : "border-border hover:border-primary/30 hover:bg-accent/50 bg-card",
              )}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-base text-foreground">
                    {service.name}
                  </h4>
                  {service.description && (
                    <p className="text-xs text-muted-foreground leading-normal">
                      {service.description}
                    </p>
                  )}
                </div>
                {service.price !== null && (
                  <span className="text-sm font-extrabold text-foreground shrink-0 ml-2">
                    R${" "}
                    {service.price.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3 font-semibold">
                <Clock className="h-3.5 w-3.5" />
                <span>{service.duration} minutos</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

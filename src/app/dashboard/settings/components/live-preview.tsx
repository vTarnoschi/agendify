import { Sparkles } from "lucide-react";
import { type LivePreviewUser } from "../types";

interface LivePreviewProps {
  brandColor: string;
  brandLogo: string;
  user: LivePreviewUser | undefined;
}

export function LivePreview({ brandColor, brandLogo, user }: LivePreviewProps) {
  return (
    <div className="lg:col-span-7 flex flex-col gap-4 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Sparkles
          className="h-5 w-5 text-yellow-500 animate-pulse"
          aria-hidden="true"
        />
        Live Preview da Sua Página
      </h2>
      <div className="border rounded-2xl p-6 bg-card shadow-sm flex flex-col gap-6 relative overflow-hidden">
        {/* Badge indicativo */}
        <span className="absolute top-4 right-4 bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
          PRÉ-VISUALIZAÇÃO EM TEMPO REAL
        </span>

        {/* Header da Página Simulado */}
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center gap-4">
            {brandLogo ? (
              <picture>
                <img
                  src={brandLogo}
                  alt="Logo Preview"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                  className="h-16 w-16 rounded-full object-cover border-2 shadow-sm shrink-0"
                  style={{ borderColor: brandColor }}
                />
              </picture>
            ) : (
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-200"
                style={{ backgroundColor: brandColor }}
              >
                {(user?.businessName || user?.name || "AG")
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-bold leading-tight">
                {user?.businessName || user?.name || "Seu Negócio"}
              </h3>
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                {user?.category || "Sua Categoria"}
              </p>
            </div>
          </div>
        </div>

        {/* Grade Simulada do Calendário */}
        <div className="border-t pt-6 flex flex-col gap-4">
          <p className="text-xs font-bold text-muted-foreground uppercase">
            Selecione data e hora
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { day: "Seg", date: "18", isSelected: false },
              { day: "Ter", date: "19", isSelected: true },
              { day: "Qua", date: "20", isSelected: false },
              { day: "Qui", date: "21", isSelected: false },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200"
                style={{
                  backgroundColor: item.isSelected ? brandColor : undefined,
                  borderColor: item.isSelected ? brandColor : undefined,
                  color: item.isSelected ? "#ffffff" : undefined,
                  fontWeight: item.isSelected ? "bold" : undefined,
                }}
              >
                <span className="text-[10px] uppercase opacity-75">
                  {item.day}
                </span>
                <span className="text-base font-bold mt-0.5">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slots de Horário Simulados */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { time: "09:00", isSelected: false },
              { time: "10:30", isSelected: true },
              { time: "14:00", isSelected: false },
            ].map((slot, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border text-xs font-semibold text-center transition-all duration-200"
                style={{
                  borderColor: slot.isSelected ? brandColor : "var(--border)",
                  backgroundColor: slot.isSelected
                    ? `${brandColor}15`
                    : undefined,
                  color: slot.isSelected ? brandColor : undefined,
                }}
              >
                {slot.time}
              </div>
            ))}
          </div>
        </div>

        {/* Botão de Agendamento Simulado */}
        <div className="border-t pt-4">
          <div
            className="w-full h-11 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-sm transition-all duration-200"
            style={{ backgroundColor: brandColor }}
          >
            Confirmar Agendamento
          </div>
        </div>
      </div>
    </div>
  );
}

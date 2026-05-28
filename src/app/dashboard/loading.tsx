import { CalendarCheck, Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground gap-6">
      {/* Container do Logo com efeito de brilho e pulso */}
      <div className="relative flex items-center justify-center">
        {/* Glow de fundo */}
        <div className="absolute h-24 w-24 bg-primary/10 rounded-full blur-xl animate-pulse" />

        {/* Logo Card */}
        <div className="relative h-16 w-16 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5 animate-bounce duration-1000">
          <CalendarCheck className="h-8 w-8" />
        </div>
      </div>

      {/* Título e Status */}
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent animate-pulse">
          Agendify
        </span>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Sincronizando seus compromissos...</span>
        </div>
      </div>

      {/* Barra de Progresso Fina */}
      <div className="w-48 h-1 bg-muted rounded-full overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-0 bg-primary rounded-full w-1/2 animate-pulse" />
      </div>
    </div>
  );
}

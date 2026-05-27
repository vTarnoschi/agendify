import { Calendar as CalendarIcon, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { DashboardStateType } from "../hooks/use-dashboard-state";

interface MovementChartProps {
  state: DashboardStateType;
}

export default function MovementChart({ state }: MovementChartProps) {
  const {
    totalBookings,
    orderedCounts,
    orderedLabels,
    maxCount,
  } = state;

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <span>Movimento Semanal</span>
        </CardTitle>
        <CardDescription>Distribuição de agendamentos por dia da semana.</CardDescription>
      </CardHeader>
      <CardContent className="h-80 flex flex-col justify-end pb-6">
        {totalBookings > 0 ? (
          <div className="flex flex-col gap-6 w-full">
            <div className="flex justify-between items-end gap-2 h-44 w-full px-2 border-b border-border">
              {orderedCounts.map((count, index) => {
                const percent = (count / maxCount) * 100;
                return (
                  <div 
                    key={index} 
                    className="flex flex-col items-center justify-end flex-1 h-full group relative"
                    role="graphics-symbol"
                    aria-label={`${orderedLabels[index]}: ${count} agendamentos`}
                  >
                    {/* Tooltip de quantidade de agendamentos no hover */}
                    <span className="absolute -top-7 text-[11px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm pointer-events-none whitespace-nowrap z-10">
                      {count} agend.
                    </span>
                    
                    {/* Barra do gráfico com animação */}
                    <div 
                      style={{ height: `${percent}%` }}
                      className="w-full max-w-[24px] bg-primary/25 group-hover:bg-primary rounded-t-md transition-all duration-300"
                    >
                      {count > 0 && (
                        <div className="w-full h-full bg-primary rounded-t-md opacity-80 animate-in slide-in-from-bottom duration-500"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Labels do gráfico */}
            <div className="flex justify-between text-xs text-muted-foreground font-semibold px-2">
              {orderedLabels.map((lbl, idx) => (
                <span key={idx} className="flex-1 text-center">
                  {lbl}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="m-auto text-center flex flex-col gap-2">
            <CalendarDays className="h-10 w-10 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground max-w-[180px] mx-auto">
              Nenhum agendamento realizado para gerar o gráfico.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

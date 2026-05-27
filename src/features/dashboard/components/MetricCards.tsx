import { CalendarDays, Clock, DollarSign, TrendingUp, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DashboardStateType } from "../hooks/use-dashboard-state";

interface MetricCardsProps {
  state: DashboardStateType;
}

export function MetricCards({ state }: MetricCardsProps) {
  const {
    totalBookings,
    todayBookings,
    estimatedRevenue,
    nextAppointment,
    user,
  } = state;

  const isProvider = user?.role === "provider";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card className="border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 gap-0">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Total de Agendamentos
          </CardTitle>
          <CalendarDays className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold">{totalBookings}</div>
          <p className="text-xs text-muted-foreground mt-1">Sincronizados com o Google Agenda</p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 gap-0">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Agendamentos Hoje
          </CardTitle>
          <Clock className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold">{todayBookings}</div>
          <p className="text-xs text-muted-foreground mt-1">Clientes marcados para hoje</p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 gap-0">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Faturamento Estimado
          </CardTitle>
          <DollarSign className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-green-600 dark:text-green-400">
            R$ {estimatedRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span>Baseado no catálogo de serviços</span>
          </p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 gap-0">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Próximo Cliente
          </CardTitle>
          <Users className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          {nextAppointment ? (
            <div>
              <div className="text-lg font-bold truncate text-foreground">
                {isProvider
                  ? nextAppointment.user?.name || nextAppointment.clientName || "Visitante"
                  : nextAppointment.provider?.businessName || nextAppointment.provider?.name}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {format(parseISO(nextAppointment.date), "eeee, d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          ) : (
            <div>
              <div className="text-lg font-bold text-muted-foreground">Nenhum agendamento</div>
              <p className="text-xs text-muted-foreground mt-1">Sem próximos horários</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

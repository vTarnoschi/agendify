import {
  AlertCircle,
  Calendar as CalendarIcon,
  Clock,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DashboardStateType } from "../hooks/use-dashboard-state";
import { useQueryClient } from "@tanstack/react-query";

import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

interface AppointmentsListProps {
  state: DashboardStateType;
}

export function AppointmentsList({ state }: AppointmentsListProps) {
  const {
    appointments,
    loading,
    errorMsg,
    cancellingId,
    handleCancelAppointment,
    user,
  } = state;

  const queryClient = useQueryClient();
  const isProvider = user?.role === "provider";

  const triggerRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">
            Próximos Compromissos
          </CardTitle>
          <CardDescription>
            Lista completa de atendimentos ativos e históricos.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={triggerRefresh}
          disabled={loading}
          className="cursor-pointer"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Atualizar
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {errorMsg && (
          <Alert variant="destructive" role="alert">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-accent/30 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : appointments.length > 0 ? (
          <div className="divide-y divide-border">
            {appointments.map((appt) => {
              const apptDate = parseISO(appt.date);
              const isPast = apptDate < new Date();

              return (
                <div
                  key={appt.id}
                  className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:bg-accent/5 px-2 rounded-xl"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-foreground">
                        {appt.title}
                      </span>
                      {isPast && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent text-muted-foreground">
                          Encerrado
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {isProvider
                            ? `Cliente: ${appt.user?.name || appt.clientName || "Visitante"} (${appt.user?.email || appt.clientEmail || "sem e-mail"})`
                            : `Profissional: ${appt.provider?.businessName || appt.provider?.name || "Desconhecido"}`}
                        </span>
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(apptDate, "eeee, d 'de' MMMM 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </span>
                    </div>

                    {appt.description && (
                      <p className="text-sm italic text-muted-foreground mt-1">
                        &quot;{appt.description}&quot;
                      </p>
                    )}
                  </div>

                  {!isPast && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={cancellingId === appt.id}
                          className="cursor-pointer font-semibold rounded-xl bg-destructive hover:bg-destructive/90"
                        >
                          {cancellingId === appt.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancelar
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl border bg-background/95 backdrop-blur-md shadow-2xl animate-in zoom-in-95">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-bold">Cancelar agendamento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja cancelar este agendamento? Esta ação removerá o evento do Google Agenda e não poderá ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                          <AlertDialogCancel className="rounded-xl border-border">Voltar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
                          >
                            Sim, cancelar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed rounded-2xl bg-accent/5">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-bold text-lg">Sem agendamentos ativos</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
              {isProvider
                ? "Compartilhe seu link público para que novos clientes agendem horários!"
                : "Explore e agende novos serviços na plataforma."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

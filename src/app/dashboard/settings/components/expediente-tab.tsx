import { Clock, Calendar, Plus, Save, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ExpedienteFormType } from "../hooks/use-expediente-form";

const DAYS_MAP = [
  { id: "monday", label: "Segunda-feira" },
  { id: "tuesday", label: "Terça-feira" },
  { id: "wednesday", label: "Quarta-feira" },
  { id: "thursday", label: "Quinta-feira" },
  { id: "friday", label: "Sexta-feira" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
];

interface ExpedienteTabProps {
  expedienteForm: ExpedienteFormType;
}

export function ExpedienteTab({ expedienteForm }: ExpedienteTabProps) {
  const { form, handleSubmit, handleToggleDay, errorMsg, loading } =
    expedienteForm;

  const workingDays = form.watch("workingDays") || [];

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Definir Jornada de Trabalho
        </CardTitle>
        <CardDescription>
          Escolha os dias e horários em que os clientes podem agendar horários
          com você.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Dias de trabalho */}
            <FormField
              control={form.control}
              name="workingDays"
              render={() => (
                <FormItem className="flex flex-col gap-3">
                  <FormLabel className="text-md font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Dias Úteis de Atendimento</span>
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {DAYS_MAP.map((day) => {
                        const isChecked = workingDays.includes(day.id);
                        return (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => handleToggleDay(day.id)}
                            role="checkbox"
                            aria-checked={isChecked}
                            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                              isChecked
                                ? "border-primary bg-primary/5 font-semibold text-primary"
                                : "border-border hover:bg-accent/40 text-foreground"
                            }`}
                          >
                            <span>{day.label}</span>
                            <div
                              className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                                isChecked
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {isChecked && (
                                <Plus className="h-3.5 w-3.5 stroke-[3px]" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-semibold" />
                </FormItem>
              )}
            />

            {/* Horários */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border pt-6">
              <FormField
                control={form.control}
                name="workStart"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="font-semibold text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Horário de Início do Expediente</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage className="text-xs font-semibold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workEnd"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="font-semibold text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Horário de Término do Expediente</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage className="text-xs font-semibold" />
                  </FormItem>
                )}
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-destructive/15 text-destructive rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Ação */}
            <div className="flex items-center justify-end border-t border-border pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="px-6 h-12 font-bold cursor-pointer flex items-center gap-2 shrink-0"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Salvar Configurações</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

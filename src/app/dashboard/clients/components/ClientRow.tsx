import { Award, Clock, Mail } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { ClientData } from "~/services/clients-service";

interface ClientRowProps {
  client: ClientData;
}

export function ClientRow({ client }: ClientRowProps) {
  const initials = client.name
    ? client.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "CL";

  return (
    <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:bg-accent/5 px-2 rounded-xl">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 rounded-xl border border-primary/10">
          <AvatarFallback className="rounded-xl font-bold text-primary bg-primary/10">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <h3 className="font-bold text-lg text-foreground">
            {client.name || "Cliente sem Nome"}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span>{client.email}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Badge Fidelidade */}
        <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
          <Award className="h-3.5 w-3.5" />
          <span>{client.totalBookings} {client.totalBookings === 1 ? "agendamento" : "agendamentos"}</span>
        </div>

        {/* Último Atendimento */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-accent/40 px-3 py-1 rounded-full">
          <Clock className="h-3.5 w-3.5" />
          <span>
            Último: {format(parseISO(client.lastBookingDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </span>
        </div>
      </div>
    </div>
  );
}

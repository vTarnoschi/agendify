import { Copy, CheckCircle, ExternalLink } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { DashboardStateType } from "../hooks/use-dashboard-state";
import { Button } from "~/components/ui/button";

interface DashboardHeaderProps {
  state: DashboardStateType;
}

export function DashboardHeader({ state }: DashboardHeaderProps) {
  const { user: clerkUser, isLoaded } = useUser();
  const { user, copied, handleCopyLink } = state;
  const isProvider = user?.role === "provider";

  const hasGoogleConnected =
    isLoaded &&
    clerkUser?.externalAccounts.some(
      (account) => account.provider === "google",
    );

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Olá, {user?.name}!
        </h1>
        <p className="text-muted-foreground font-medium">
          {isProvider
            ? "Veja aqui os agendamentos realizados pelos seus clientes."
            : "Gerencie os horários que você reservou com os profissionais."}
        </p>
      </div>

      {isProvider && user?.slug && (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={hasGoogleConnected ? handleCopyLink : undefined}
            disabled={!hasGoogleConnected}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm ${
              copied
                ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/15 hover:text-green-600 dark:hover:text-green-400"
                : "bg-background border-border hover:bg-accent hover:text-accent-foreground"
            } ${!hasGoogleConnected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            title={
              !hasGoogleConnected
                ? "Conecte o Google Calendar para habilitar o link"
                : ""
            }
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500 animate-in zoom-in-95 duration-200" />
                <span>Link Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copiar Link da Agenda</span>
              </>
            )}
          </Button>

          {hasGoogleConnected ? (
            <Button
              asChild
              variant="outline"
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm cursor-pointer"
            >
              <a
                href={`/${user.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Ver Minha Página</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button
              disabled
              variant="outline"
              className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary/50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm opacity-50 cursor-not-allowed"
              title="Conecte o Google Calendar para ver sua página"
            >
              <span>Ver Minha Página</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

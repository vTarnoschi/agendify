"use client";

import dynamic from "next/dynamic";
import { AlertCircle } from "lucide-react";
import { useDashboardState } from "~/features/dashboard/hooks/use-dashboard-state";
import { DashboardHeader } from "~/features/dashboard/components/DashboardHeader";
import { MetricCards } from "~/features/dashboard/components/MetricCards";
import { AppointmentsList } from "~/features/dashboard/components/AppointmentsList";
import { DashboardSkeleton } from "~/features/dashboard/components/DashboardSkeleton";
import { Alert, AlertDescription } from "~/components/ui/alert";

// Code Splitting (Lazy Loading) do gráfico semanal, otimizando o bundle de renderização inicial
const MovementChart = dynamic(() => import("~/features/dashboard/components/MovementChart"), {
  ssr: false,
  loading: () => <div className="h-80 bg-accent/30 rounded-2xl animate-pulse" />,
});

export default function DashboardPage() {
  const state = useDashboardState();
  const { authLoading, isAuthenticated, loading } = state;

  if (authLoading || loading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 flex flex-col gap-4 text-center animate-in fade-in duration-300">
        <Alert variant="destructive" className="flex flex-col gap-3 items-center justify-center text-center p-6">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <h2 className="text-xl font-bold">Não autenticado</h2>
          <AlertDescription className="text-muted-foreground">
            Por favor, faça o login para gerenciar seu painel.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Cabeçalho de Saudação & Links da Agenda */}
      <DashboardHeader state={state} />

      {/* Grid de Métricas Principais Calculadas */}
      <MetricCards state={state} />

      {/* Painel Principal de Compromissos & Movimento Semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <AppointmentsList state={state} />
        </div>

        <div className="lg:col-span-4">
          <MovementChart state={state} />
        </div>
      </div>
    </div>
  );
}

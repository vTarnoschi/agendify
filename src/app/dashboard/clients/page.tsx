"use client";

import { AlertCircle, RefreshCw, Users } from "lucide-react";
import { useClientsState } from "./hooks/use-clients-state";
import { ClientsHeader } from "./components/ClientsHeader";
import { ClientRow } from "./components/ClientRow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";

export default function ClientsPage() {
  const state = useClientsState();
  const {
    authLoading,
    isAuthenticated,
    loading,
    errorMsg,
    filteredClients,
    searchQuery,
  } = state;

  if (authLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 flex flex-col gap-4 text-center animate-in fade-in duration-300">
        <Alert variant="destructive" className="flex flex-col gap-3 items-center justify-center text-center p-6">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <h2 className="text-xl font-bold">Acesso negado</h2>
          <AlertDescription className="text-muted-foreground">
            Por favor, faça o login para acessar seus clientes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Cabeçalho do Filtro & Busca */}
      <ClientsHeader state={state} />

      {errorMsg && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {/* Tabela de Relacionamentos */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Histórico de Relacionamentos</CardTitle>
          <CardDescription>
            Clientes que já realizaram pelo menos um agendamento na sua página pública.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-accent/30 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredClients.map((client) => (
                <ClientRow key={client.id} client={client} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed rounded-2xl bg-accent/5">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-bold text-lg">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
                {searchQuery 
                  ? "Tente refinar sua busca digitando outro nome ou e-mail."
                  : "Os clientes aparecerão aqui assim que realizarem o primeiro agendamento."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

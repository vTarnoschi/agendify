import { RefreshCw, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ClientsStateType } from "../hooks/use-clients-state";

interface ClientsHeaderProps {
  state: ClientsStateType;
}

export function ClientsHeader({ state }: ClientsHeaderProps) {
  const { loading, searchQuery, setSearchQuery } = state;
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-2">
            <span>Clientes</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Gerencie sua carteira de clientes ativos e visualize o nível de fidelidade.
          </p>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="cursor-pointer flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar Lista
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="flex items-center relative max-w-md">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por nome ou e-mail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 rounded-xl"
        />
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { useAuth } from "~/features/auth/queries/use-auth";
import { useClientsQuery } from "~/queries/use-clients";

export function useClientsState() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  
  // React Query Call
  const { data: clients = [], isLoading: loadingClients, error: clientsError } = useClientsQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const errorMsg = clientsError?.message || "";

  // Filtrar clientes em tempo real memoizado
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const query = searchQuery.toLowerCase();
      const nameMatch = client.name?.toLowerCase().includes(query) || false;
      const emailMatch = client.email.toLowerCase().includes(query);
      return nameMatch || emailMatch;
    });
  }, [clients, searchQuery]);

  return {
    authLoading,
    isAuthenticated,
    loading: loadingClients,
    searchQuery,
    setSearchQuery,
    errorMsg,
    filteredClients,
  };
}

export type ClientsStateType = ReturnType<typeof useClientsState>;

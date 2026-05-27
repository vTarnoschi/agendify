import { useQuery } from "@tanstack/react-query";
import { getClients, ClientData } from "~/services/clients-service";

export function useClientsQuery() {
  return useQuery<ClientData[]>({
    queryKey: ["clients"],
    queryFn: getClients,
  });
}

import apiClient from "~/lib/api-client";
import { ApiResponse } from "./services-service";

export interface ClientData {
  id: string;
  name: string | null;
  email: string;
  totalBookings: number;
  lastBookingDate: string;
}

export async function getClients(): Promise<ClientData[]> {
  const response = await apiClient.get<ApiResponse<ClientData[]>>("/clients");
  const result = response as unknown as ApiResponse<ClientData[]>;
  return result.data || [];
}

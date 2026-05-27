import apiClient from "~/lib/api-client";
import { ApiResponse } from "./services-service";

export interface AppointmentType {
  id: string;
  title: string;
  description: string | null;
  date: string;
  userId: string;
  providerId: string;
  googleEventId: string | null;
  price?: number | null;
  duration?: number | null;
  clientName?: string | null;
  clientEmail?: string | null;
  clientPhone?: string | null;
  createdAt: string;
  user?: {
    name: string | null;
    email: string;
  };
  provider?: {
    name: string | null;
    businessName: string | null;
    email: string;
  };
}

export interface ServiceShortType {
  id: string;
  name: string;
  price: number | null;
}

export interface AppointmentsResponseData {
  appointments: AppointmentType[];
  services: ServiceShortType[];
}

export async function getAppointments(): Promise<AppointmentsResponseData> {
  const response = await apiClient.get<ApiResponse<AppointmentsResponseData>>("/appointments");
  const result = response as unknown as ApiResponse<AppointmentsResponseData>;
  return result.data;
}

export async function cancelAppointment(id: string): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<null>>(`/appointments/${id}`);
  const result = response as unknown as ApiResponse<null>;
  return result.success;
}

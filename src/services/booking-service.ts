import apiClient from "~/lib/api-client";
import { ApiResponse } from "./services-service";

export interface AvailabilityParams {
  slug: string;
  date: string;
  serviceId: string;
}

export interface AvailabilityResponseData {
  slots: string[];
}

export interface CreateBookingPayload {
  slug: string;
  date: string;
  title: string;
  description: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

export async function getAvailability({ slug, date, serviceId }: AvailabilityParams): Promise<string[]> {
  const response = await apiClient.get<ApiResponse<AvailabilityResponseData>>(
    `/availability?slug=${slug}&date=${date}&serviceId=${serviceId}`
  );
  const result = response as unknown as ApiResponse<AvailabilityResponseData>;
  return result.data?.slots || [];
}

export async function createPublicAppointment(payload: CreateBookingPayload): Promise<boolean> {
  const response = await apiClient.post<ApiResponse<null>>("/appointments", payload);
  const result = response as unknown as ApiResponse<null>;
  return result.success;
}

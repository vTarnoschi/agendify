import apiClient from "~/lib/api-client";
import { ApiResponse } from "./services-service";

export interface SettingsPayload {
  workingDays?: string[];
  workStart?: string;
  workEnd?: string;
  brandColor?: string | null;
  brandLogo?: string | null;
}

export async function updateSettings(payload: SettingsPayload): Promise<ApiResponse<SettingsPayload>> {
  const response = await apiClient.put<ApiResponse<SettingsPayload>>("/settings", payload);
  return response as unknown as ApiResponse<SettingsPayload>;
}

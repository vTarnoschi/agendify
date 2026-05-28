import apiClient from "~/lib/api-client";
import { ApiResponse } from "./services-service";

export interface OnboardingPayload {
  businessName: string;
  slug: string;
}

export async function submitOnboarding(
  payload: OnboardingPayload,
): Promise<boolean> {
  const response = await apiClient.post<ApiResponse<null>>(
    "/onboarding",
    payload,
  );
  const result = response as unknown as ApiResponse<null>;
  return result.success;
}

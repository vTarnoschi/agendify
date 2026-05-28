import apiClient from "~/lib/api-client";

export interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  duration: number;
}

export interface ServicePayload {
  name: string;
  description: string | null;
  price: number | null;
  duration: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function getServices(): Promise<ServiceType[]> {
  const response = await apiClient.get<ApiResponse<ServiceType[]>>("/services");
  // Como o response interceptor do apiClient do Axios já retorna response.data,
  // response será o objeto de resposta direta da API (ApiResponse).
  const result = response as unknown as ApiResponse<ServiceType[]>;
  return result.data || [];
}

export async function createService(
  payload: ServicePayload,
): Promise<ServiceType> {
  const response = await apiClient.post<ApiResponse<ServiceType>>(
    "/services",
    payload,
  );
  const result = response as unknown as ApiResponse<ServiceType>;
  return result.data;
}

export async function updateService(
  id: string,
  payload: ServicePayload,
): Promise<ServiceType> {
  const response = await apiClient.put<ApiResponse<ServiceType>>(
    `/services/${id}`,
    payload,
  );
  const result = response as unknown as ApiResponse<ServiceType>;
  return result.data;
}

export async function deleteService(id: string): Promise<boolean> {
  const response = await apiClient.delete<ApiResponse<null>>(`/services/${id}`);
  const result = response as unknown as ApiResponse<null>;
  return result.success;
}

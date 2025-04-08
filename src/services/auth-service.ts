import { AxiosError } from "axios";

import apiClient from "~/lib/api-client";

type SiginUserType = {
  email: string;
  password: string;
};

export async function signinUser(params: SiginUserType) {
  try {
    return (await apiClient.post("/auth/sign-in", params)).data;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    throw new Error(err.response?.data?.error || "Erro ao fazer login");
  }
}

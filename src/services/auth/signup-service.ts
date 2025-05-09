import { AxiosError } from "axios";

import apiClient from "~/lib/api-client";

type SignupUserType = {
  email: string;
  password: string;
  role: "client" | "provider";
};

export async function signupUser(params: SignupUserType) {
  try {
    return (await apiClient.post("/auth/sign-up", params)).data;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    throw new Error(err.response?.data?.error || "Erro ao cadastrar usuário");
  }
}

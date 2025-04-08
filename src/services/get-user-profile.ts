import apiClient from "~/lib/api-client";

import { User } from "~/types/user";

export async function getUserProfile(): Promise<User> {
  return (await apiClient.get<User>("/user/profile")).data;
}

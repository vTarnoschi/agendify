import { useQuery } from "@tanstack/react-query";

import { getUserProfile } from "~/services/get-user-profile";

import { User } from "~/types/user";

export function useAuth() {
  const { data, isLoading, isError } = useQuery<User>({
    queryKey: ["user"],
    queryFn: getUserProfile,
    retry: false,
  });

  return {
    isError,
    isLoading,
    user: data,
    isAuthenticated: !!data,
  };
}

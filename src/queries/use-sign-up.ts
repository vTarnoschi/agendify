import { useMutation } from "@tanstack/react-query";

import { signupUser } from "~/services/auth";

export function useSignup(onSuccess?: () => void) {
  return useMutation({
    mutationFn: signupUser,
    onSuccess,
  });
}

import { useMutation } from "@tanstack/react-query";

import { signinUser } from "~/services/auth";

export function useSignin(onSuccess?: () => void) {
  return useMutation({
    mutationFn: signinUser,
    onSuccess,
  });
}

import { useUser } from "@clerk/nextjs";

export function useRole() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return { role: null, isLoaded };
  }

  const role = user.publicMetadata.role as "client" | "provider" | undefined;

  return { role, isLoaded };
}

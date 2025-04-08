"use client";

import { useAuth } from "~/queries/use-auth";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <p>Carregando...</p>;
  if (!isAuthenticated) return <p>Usuário não autenticado.</p>;

  return (
    <div>
      <h1>Bem-vindo, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}

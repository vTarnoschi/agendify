"use client";

import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-full py-8 px-4 w-full animate-in fade-in duration-300">
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Minha Conta</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais, foto de perfil, segurança e contas
          conectadas.
        </p>
      </div>

      <UserProfile path="/dashboard/account" routing="path" />
    </div>
  );
}

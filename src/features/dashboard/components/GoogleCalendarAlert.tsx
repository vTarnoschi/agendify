"use client";

import { useUser } from "@clerk/nextjs";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

export function GoogleCalendarAlert() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return null;
  }

  const hasGoogleConnected = user.externalAccounts.some(
    (account) => account.provider === "google",
  );

  if (hasGoogleConnected) {
    return null;
  }

  return (
    <Alert className="border-primary/30 bg-primary/10 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-primary/5">
      <div className="flex gap-4">
        <AlertCircle className="h-5 w-5 mt-0.5 text-primary" />
        <div>
          <AlertTitle className="text-primary font-bold text-lg">
            Conecte seu Google Calendar
          </AlertTitle>
          <AlertDescription className="text-slate-300 font-medium mt-1">
            Sua agenda ainda não está conectada ao Google. Para que seus
            clientes possam realizar agendamentos, precisamos sincronizar sua
            disponibilidade.
          </AlertDescription>
        </div>
      </div>
      <Button asChild className="shrink-0">
        <Link href="/dashboard/account">
          Conectar Minha Conta
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </Alert>
  );
}

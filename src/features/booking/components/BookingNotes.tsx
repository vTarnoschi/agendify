import { AlertCircle } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { BookingFormType } from "../hooks/use-booking-form";

import { Alert, AlertDescription } from "~/components/ui/alert";

interface BookingNotesProps {
  form: BookingFormType;
  isSignedIn: boolean;
  isLoaded: boolean;
}

export function BookingNotes({
  form,
  isSignedIn,
  isLoaded,
}: BookingNotesProps) {
  const {
    notes,
    setNotes,
    selectedTime,
    bookingStatus,
    errorMessage,
    handleConfirmBooking,
    setIsContactModalOpen,
  } = form;

  if (bookingStatus === "success") {
    return null; // O layout principal lida com o sucesso
  }

  const handleAction = () => {
    if (!isSignedIn) {
      // Abre o modal de captura de contato do visitante
      setIsContactModalOpen(true);
    } else {
      // Confirma direto usando o Clerk logado
      handleConfirmBooking();
    }
  };

  const isSubmitting = bookingStatus === "submitting";

  return (
    <div className="flex flex-col gap-4 border-t pt-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="notes" className="text-sm font-bold text-foreground">
          Observações adicionais (Opcional)
        </Label>
        <Input
          id="notes"
          placeholder="Ex: Detalhes específicos sobre o serviço..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3">
        <Button
          onClick={handleAction}
          disabled={!selectedTime || isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold h-12 rounded-xl cursor-pointer shadow-sm text-sm flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Agendando...</span>
            </>
          ) : (
            <span>Confirmar Agendamento</span>
          )}
        </Button>

        {isLoaded && !isSignedIn && (
          <div className="text-center">
            <SignInButton mode="modal">
              <button className="text-xs text-muted-foreground hover:text-foreground font-semibold underline transition-colors cursor-pointer">
                Já tem uma conta? Faça login para agendar mais rápido
              </button>
            </SignInButton>
          </div>
        )}
      </div>
    </div>
  );
}

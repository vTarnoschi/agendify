"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Mail, Phone, User } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { BookingFormType } from "../hooks/use-booking-form";
import {
  contactSchema,
  type ContactFormValues,
} from "../schemas/contact-schema";

// Máscara de telefone brasileiro: (DD) DDDD-DDDD ou (DD) DDDDD-DDDD
function applyPhoneMask(value: string): string {
  // Remove tudo que não for dígito
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    // Fixo: (DD) DDDD-DDDD
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  // Celular: (DD) DDDDD-DDDD
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

interface GuestContactModalProps {
  state: BookingFormType;
}

export function GuestContactModal({ state }: GuestContactModalProps) {
  const {
    isContactModalOpen,
    setIsContactModalOpen,
    handleConfirmBooking,
    bookingStatus,
  } = state;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    await handleConfirmBooking(values);
    setIsContactModalOpen(false);
  };

  const isSubmitting = bookingStatus === "submitting";

  return (
    <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
      <DialogContent className="sm:max-w-[420px] rounded-3xl border bg-background/95 backdrop-blur-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <span>Dados de Contato</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium text-sm">
            Informe seus dados para podermos enviar a confirmação e o lembrete
            do agendamento.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm text-foreground">
                    Nome Completo <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Ex: João da Silva"
                        className="pl-10 h-11 rounded-xl border bg-background/50 hover:bg-background/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-semibold text-destructive mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm text-foreground">
                    E-mail <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Ex: joao@email.com"
                        className="pl-10 h-11 rounded-xl border bg-background/50 hover:bg-background/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-semibold text-destructive mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm text-foreground">
                    WhatsApp / Celular{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="(11) 99999-9999"
                        className="pl-10 h-11 rounded-xl border bg-background/50 hover:bg-background/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(applyPhoneMask(e.target.value));
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-semibold text-destructive mt-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-md bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Processando Agendamento...</span>
                  </>
                ) : (
                  <span>Confirmar Agendamento</span>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsContactModalOpen(false)}
                className="w-full h-11 rounded-xl font-bold text-sm hover:bg-accent/50 cursor-pointer"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

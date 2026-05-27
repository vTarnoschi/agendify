"use client";

import { useUser, useSignIn } from "@clerk/nextjs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, CheckCircle, ShieldCheck, Sparkles, Key } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { useBookingForm, ServiceType } from "../hooks/use-booking-form";
import { ServiceSelector } from "./ServiceSelector";
import { CalendarCarousel } from "./CalendarCarousel";
import { SlotsGrid } from "./SlotsGrid";
import { BookingNotes } from "./BookingNotes";
import { GuestContactModal } from "./GuestContactModal";
import apiClient from "~/lib/api-client";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface PublicBookingProps {
  slug: string;
  providerName: string;
  businessName: string | null;
  category: string | null;
  brandColor?: string | null;
  brandLogo?: string | null;
  initialServices?: ServiceType[];
}

const DEFAULT_SERVICES: ServiceType[] = [
  { id: "default", name: "Atendimento Geral", description: "Atendimento padrão do profissional", price: null, duration: 30 },
  { id: "haircut", name: "Corte de Cabelo / Barba", description: "Corte e modelagem profissional", price: 50, duration: 45 },
  { id: "consult", name: "Consulta Especializada", description: "Consultoria personalizada", price: 150, duration: 60 },
];

export default function PublicBooking({ 
  slug, 
  providerName, 
  businessName, 
  category,
  brandColor,
  brandLogo,
  initialServices = []
}: PublicBookingProps) {
  const { isSignedIn, isLoaded } = useUser();
  const { signIn, setActive } = useSignIn() as unknown as {
    signIn?: {
      create: (params: { identifier: string; password: string }) => Promise<{
        status: string;
        createdSessionId: string | null;
      }>;
    };
    setActive?: (params: { session: string | null }) => Promise<void>;
  };

  // Estados locais para a conversão pós-agendamento (Opt-In)
  const [password, setPassword] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [convertError, setConvertError] = useState("");

  const form = useBookingForm({
    slug,
    initialServices,
    defaultServices: DEFAULT_SERVICES,
  });

  const {
    selectedDate,
    selectedTime,
    selectedService,
    bookingStatus,
    clientName,
    clientEmail,
    clientPhone,
  } = form;

  const displayName = businessName || providerName;
  const brandHex = brandColor || "#7c3aed";

  const handleConvertAccount = async () => {
    if (!signIn || !setActive || !clientEmail) return;
    if (password.length < 8) {
      setConvertError("A senha deve conter pelo menos 8 caracteres.");
      return;
    }

    setIsConverting(true);
    setConvertError("");
    
    try {
      // 1. Criar o usuário localmente e no Clerk via nossa API
      await apiClient.post("/appointments/convert-guest", {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        password: password,
      });
      
      // 2. Fazer login transparente via useSignIn do Clerk
      const result = await signIn.create({
        identifier: clientEmail,
        password: password,
      });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setAccountCreated(true);
      } else {
        setConvertError("Não foi possível realizar o login automático. Use o formulário padrão.");
      }
    } catch (err: unknown) {
      console.error("Erro na conversão:", err);
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      const errMsg = axiosError.response?.data?.message || axiosError.message || "Erro desconhecido ao criar conta.";
      setConvertError(errMsg);
    } finally {
      setIsConverting(false);
    }
  };

  const brandStyle = (
    <style>{`
      :root {
        --brand-color: ${brandHex};
        --brand-color-light: ${brandHex}15;
        --brand-color-border: ${brandHex}25;
      }
      .forced-light {
        --background: oklch(1 0 0) !important;
        --foreground: oklch(0.145 0 0) !important;
        --card: oklch(1 0 0) !important;
        --card-foreground: oklch(0.145 0 0) !important;
        --popover: oklch(1 0 0) !important;
        --popover-foreground: oklch(0.145 0 0) !important;
        --muted: oklch(0.97 0 0) !important;
        --muted-foreground: oklch(0.556 0 0) !important;
        --accent: oklch(0.97 0 0) !important;
        --accent-foreground: oklch(0.205 0 0) !important;
        --border: oklch(0.922 0 0) !important;
        --input: oklch(0.922 0 0) !important;
        background-color: var(--background) !important;
        color: var(--foreground) !important;
      }
    `}</style>
  );

  // Render do sucesso do agendamento
  if (bookingStatus === "success") {
    return (
      <div className="forced-light flex flex-col items-center justify-center p-8 max-w-lg mx-auto text-center gap-6 animate-in fade-in zoom-in-95 duration-300">
        {brandStyle}
        <div className="h-20 w-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-12 w-12 animate-bounce" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Agendamento Confirmado!</h2>
          <p className="text-muted-foreground text-lg leading-normal">
            Seu horário com <strong>{displayName}</strong> foi reservado com sucesso no Google Agenda.
          </p>
        </div>
        <Card className="w-full bg-card border shadow-sm">
          <CardContent className="p-6 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-[var(--brand-color)]" />
              <span className="font-semibold text-foreground">
                {format(selectedDate, "eeee, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[var(--brand-color)]" />
              <span className="font-semibold text-foreground">{selectedTime}</span>
            </div>
            <div className="border-t pt-4 flex flex-col gap-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">SERVIÇO</p>
              <p className="font-bold text-foreground">{selectedService.name}</p>
            </div>
          </CardContent>
        </Card>

        {/* WIDGET DE CADASTRO PÓS-AGENDAMENTO (POST-BOOKING OPT-IN) */}
        {!isSignedIn && isLoaded && (
          <div className="w-full mt-2">
            {accountCreated ? (
              <div className="w-full p-6 rounded-3xl border border-green-500/30 bg-green-500/5 text-left flex flex-col gap-3 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Conta criada com sucesso!</span>
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  Sua conta foi ativada. Em suas próximas visitas a qualquer profissional do <strong>Agendify</strong>, seus dados serão preenchidos automaticamente!
                </p>
              </div>
            ) : (
              <div className="w-full p-6 rounded-3xl border border-primary/20 bg-primary/5 text-left flex flex-col gap-4">
                <div className="flex items-center gap-2 text-primary font-extrabold text-sm tracking-tight">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span>Facilite seus próximos agendamentos!</span>
                </div>
                <p className="text-xs text-muted-foreground leading-normal font-medium">
                  Defina uma senha abaixo para salvar seus dados. Da próxima vez, você agendará em <strong>apenas 1 clique</strong>, sem digitar nada!
                </p>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Crie uma senha forte (min. 8 caracteres)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-10 rounded-xl border bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/20"
                    />
                  </div>
                  {convertError && (
                    <p className="text-[11px] font-semibold text-destructive">{convertError}</p>
                  )}
                  <Button
                    onClick={handleConvertAccount}
                    disabled={isConverting || !password}
                    className="w-full h-10 rounded-xl font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-1"
                  >
                    {isConverting ? (
                      <>
                        <div className="h-3 w-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        <span>Criando Conta...</span>
                      </>
                    ) : (
                      <span>Criar Minha Conta</span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground leading-normal">
          Enviamos um convite com o link do evento para o seu e-mail cadastrado.
        </p>
      </div>
    );
  }

  return (
    <div className="forced-light grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl mx-auto p-4">
      {brandStyle}
      
      {/* Detalhes do profissional e Serviços */}
      <div className="md:col-span-5 flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="flex flex-col gap-4">
          {brandLogo ? (
            <picture>
              <img
                src={brandLogo}
                alt={displayName}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
                className="h-16 w-16 rounded-full object-cover border-2 shadow-sm"
                style={{ borderColor: brandHex }}
              />
            </picture>
          ) : (
            <div className="h-16 w-16 bg-[var(--brand-color-light)] text-[var(--brand-color)] rounded-full flex items-center justify-center text-2xl font-bold border border-[var(--brand-color-border)]">
              {displayName.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold leading-tight">{displayName}</h1>
            {category && <p className="text-lg text-muted-foreground font-medium">{category}</p>}
          </div>
        </div>

        {/* Módulo de Seleção de Serviços */}
        <ServiceSelector form={form} />
      </div>

      {/* Calendário e Seleção de Horários */}
      <div className="md:col-span-7 flex flex-col gap-6 border-l pl-0 md:pl-8 border-border">
        {/* Carrossel de datas semanais */}
        <CalendarCarousel form={form} />

        {/* Slots de horários livres */}
        <SlotsGrid form={form} />

        {/* Notas adicionais e botões de agendamento */}
        <BookingNotes form={form} isSignedIn={isSignedIn || false} isLoaded={isLoaded} />
      </div>

      {/* Modal de dados de visitante */}
      <GuestContactModal state={form} />
    </div>
  );
}

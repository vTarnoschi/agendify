import Link from "next/link";
import { ReactNode } from "react";
import {
  CalendarCheck,
  Loader2,
  Calendar,
  BarChart3,
  Bell,
} from "lucide-react";
import { ClerkLoading, ClerkLoaded } from "@clerk/nextjs";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark min-h-screen bg-[#020817] text-white selection:bg-[#ff6b35]/30">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Coluna Esquerda - Hero Section (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
          {/* Radial Gradient Background */}
          <div className="absolute inset-0 pointer-events-none bg-glow-primary" />
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none" />

          {/* Header/Logo */}
          <Link
            href="/"
            className="relative z-10 flex items-center gap-3 w-fit group"
          >
            <div className="h-10 w-10 bg-[#ff6b35]/20 text-[#ff6b35] border border-[#ff6b35]/30 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Agendify
            </span>
          </Link>

          {/* Main Copy */}
          <div className="relative z-10 max-w-lg mt-12 mb-8">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1] text-transparent bg-clip-text bg-linear-to-br from-white to-slate-400">
              Agendamentos simples para profissionais modernos
            </h1>
            <p className="text-lg text-slate-400 font-medium">
              Centralize sua agenda, automatize confirmações e reduza faltas.
              Ofereça uma experiência premium para seus clientes desde o
              primeiro contato.
            </p>
          </div>

          {/* Floating UI Elements (Mockups) */}
          <div className="relative z-10 flex-1 flex flex-col justify-end pb-8">
            <div className="relative w-full max-w-md">
              {/* Card 1 */}
              <div className="absolute -top-12 left-8 bg-[#071428]/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-2xl animate-in slide-in-from-bottom-12 fade-in duration-1000">
                <div className="h-10 w-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Novo Agendamento
                  </p>
                  <p className="text-xs text-slate-400">
                    Hoje, 14:30 - Corte Masculino
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="absolute top-16 right-0 bg-[#071428]/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-2xl animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-150">
                <div className="h-10 w-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shrink-0">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    +45% Receita
                  </p>
                  <p className="text-xs text-slate-400">
                    Comparado ao último mês
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="absolute top-44 left-0 bg-[#071428]/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-2xl animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-300">
                <div className="h-10 w-10 bg-[#ff6b35]/20 text-[#ff6b35] rounded-full flex items-center justify-center shrink-0">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Lembrete Automático
                  </p>
                  <p className="text-xs text-slate-400">
                    Enviado para João Silva via WhatsApp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Formulário de Autenticação */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
          {/* Logo exibida apenas no Mobile */}
          <Link
            href="/"
            className="lg:hidden flex items-center gap-3 mb-10 group"
          >
            <div className="h-10 w-10 bg-[#ff6b35]/20 text-[#ff6b35] border border-[#ff6b35]/30 rounded-xl flex items-center justify-center">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Agendify
            </span>
          </Link>

          <ClerkLoading>
            <div className="flex flex-col items-center justify-center w-full max-w-[440px] min-h-[500px]">
              <Loader2 className="h-8 w-8 animate-spin text-[#ff6b35]" />
            </div>
          </ClerkLoading>

          <ClerkLoaded>
            <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-500">
              {children}
            </div>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}

import { type Metadata } from "next";
import { shadcn } from "@clerk/ui/themes";
import { ptBR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "~/providers/theme-provider";
import { ReactQueryProvider } from "~/providers/react-query-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agendify — Agendamentos sem complicação",
  description:
    "Conecte clientes e prestadores de forma inteligente. Plataforma moderna e eficiente para gerenciar sua agenda profissional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={{
        ...ptBR,
        signIn: {
          start: {
            title: "Bem-vindo de volta",
            subtitle: "Entre para gerenciar seus agendamentos",
            actionLink__use_phone: "Entrar com telefone",
            actionText: "Ainda não tem uma conta?",
            actionLink: "Criar conta",
          },
        },
        signUp: {
          start: {
            title: "Crie sua conta",
            subtitle: "Comece gratuitamente",
            actionText: "Já possui uma conta?",
            actionLink: "Entrar",
          },
        },
        formFieldLabel__emailAddress: "Email",
        formFieldInputPlaceholder__firstName: "Digite seu nome",
        formFieldInputPlaceholder__lastName: "Digite seu sobrenome",
        formFieldInputPlaceholder__emailAddress: "Digite seu email",
        formFieldInputPlaceholder__signUpPassword: "Digite sua senha",
      }}
      appearance={{
        theme: shadcn,
        variables: {
          colorWarning: "hsl(var(--primary))",
        },
        elements: {
          formFieldInput: {
            backgroundColor: "transparent",
          },
        },
      }}
    >
      <html lang="pt-BR" suppressHydrationWarning className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        >
          <ReactQueryProvider>
            <ThemeProvider>
              {children}
              <Toaster />
            </ThemeProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

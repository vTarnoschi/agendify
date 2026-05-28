import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import {
  CalendarCheck,
  Clock,
  Users,
  Scissors,
  Dumbbell,
  Heart,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { PricingSection } from "./pricing-section";
import { FAQSection } from "./faq-section";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    // Redireciona para o dashboard apenas se o usuário for um profissional (provider)
    if (user.publicMetadata?.role === "provider") {
      redirect("/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <span className="text-2xl font-bold">Agendify</span>
        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <span className="text-sm font-semibold text-muted-foreground hidden sm:inline">
                Olá, {user.firstName || "Cliente"}!
              </span>
              <UserButton />
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/sign-in">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Criar Conta</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-glow-primary" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none" />

        <h1 className="relative z-10 text-4xl sm:text-5xl font-bold mb-4">
          Agendamentos sem complicação
        </h1>
        <p className="relative z-10 text-lg text-muted-foreground mb-6 max-w-xl">
          Conecte clientes e prestadores de forma inteligente. Uma solução
          moderna e eficiente para sua rotina.
        </p>

        {user ? (
          <div className="relative z-10 flex flex-col items-center gap-4 bg-primary/5 border border-primary/20 p-6 rounded-2xl max-w-md mx-auto animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-primary">
                Você está conectado como cliente!
              </p>
              <p className="text-xs text-muted-foreground leading-normal">
                Acesse o link de agendamento compartilhado por seu profissional
                para reservar um novo horário.
              </p>
            </div>

            <Separator className="w-full bg-primary/10" />

            <div className="w-full text-center space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Quer usar o Agendify para o seu negócio?
              </p>
              <Button asChild className="w-full shadow-sm">
                <Link href="/onboarding" className="w-full block">
                  Configurar Meu Negócio
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex gap-4 flex-wrap justify-center">
            <Button asChild className="text-lg px-6 py-4">
              <Link href="/sign-up">Comece agora</Link>
            </Button>
            <Button asChild variant="outline" className="text-lg px-6 py-4">
              <Link href="/sign-in">Já tenho conta</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="px-6 py-16 bg-muted">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold mb-2">
            Como funciona o Agendify?
          </h2>
          <p className="text-muted-foreground text-lg">
            Uma plataforma completa para simplificar a rotina de clientes e
            prestadores.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CalendarCheck className="mx-auto h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-xl">Agende com facilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Escolha o profissional, horário e confirme com poucos cliques.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="mx-auto h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-xl">Organize sua agenda</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Visualize seus compromissos e receba lembretes automáticos.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="mx-auto h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-xl">Conecte pessoas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aproxime prestadores e clientes com uma experiência fluida.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-2">
            Como o Agendify pode ser usado?
          </h2>
          <p className="text-muted-foreground text-lg">
            Uma plataforma, múltiplas possibilidades. Veja como diferentes
            profissionais usam o Agendify.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Caso de uso 1 */}
          <div className="rounded-2xl border p-6 shadow-sm bg-card">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" aria-hidden="true" />
              Salões de Beleza
            </h3>
            <p className="text-muted-foreground">
              Agende cortes, colorações e tratamentos com praticidade. Clientes
              escolhem o profissional, o dia e o horário.
            </p>
          </div>

          {/* Caso de uso 2 */}
          <div className="rounded-2xl border p-6 shadow-sm bg-card">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" aria-hidden="true" />
              Personal Trainers
            </h3>
            <p className="text-muted-foreground">
              Organize treinos personalizados com seus alunos, evitando horários
              sobrepostos ou esquecimentos.
            </p>
          </div>

          {/* Caso de uso 3 */}
          <div className="rounded-2xl border p-6 shadow-sm bg-card">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
              Aulas de Yoga
            </h3>
            <p className="text-muted-foreground">
              Gerencie suas turmas e permita que alunos reservem suas vagas em
              horários específicos com lembretes automáticos.
            </p>
          </div>
        </div>
      </section>

      <PricingSection />

      <FAQSection />

      <Separator className="my-6" />

      <footer className="text-center text-sm text-muted-foreground pb-6">
        © {new Date().getFullYear()} Agendify. Todos os direitos reservados.
      </footer>
    </main>
  );
}

import Link from "next/link";
import { CalendarCheck, Clock, Users } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { FAQSection } from "./faq-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-2xl font-boldk">Agendify</h1>
        <div className="space-x-2">
          <Link href="/sign-in">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Criar Conta</Button>
          </Link>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          Agendamentos sem complicação
        </h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-xl">
          Conecte clientes e prestadores de forma inteligente. Uma solução
          moderna e eficiente para sua rotina.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/sign-up">
            <Button className="text-lg px-6 py-4">Comece agora</Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" className="text-lg px-6 py-4">
              Já tenho conta
            </Button>
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 bg-muted">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h3 className="text-3xl font-semibold mb-2">
            Como funciona o Agendify?
          </h3>
          <p className="text-muted-foreground text-lg">
            Uma plataforma completa para simplificar a rotina de clientes e
            prestadores.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CalendarCheck className="mx-auto h-10 w-10 text-blue-600 mb-2" />
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
              <Clock className="mx-auto h-10 w-10 text-blue-600 mb-2" />
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
              <Users className="mx-auto h-10 w-10 text-blue-600 mb-2" />
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
          <h3 className="text-3xl font-semibold mb-2">
            Como o Agendify pode ser usado?
          </h3>
          <p className="text-muted-foreground text-lg">
            Uma plataforma, múltiplas possibilidades. Veja como diferentes
            profissionais usam o Agendify.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Caso de uso 1 */}
          <div className="rounded-2xl border p-6 shadow-sm bg-white">
            <h4 className="text-xl font-semibold mb-2">💇‍♂️ Salões de Beleza</h4>
            <p className="text-muted-foreground">
              Agende cortes, colorações e tratamentos com praticidade. Clientes
              escolhem o profissional, o dia e o horário.
            </p>
          </div>

          {/* Caso de uso 2 */}
          <div className="rounded-2xl border p-6 shadow-sm bg-white">
            <h4 className="text-xl font-semibold mb-2">🏋️‍♂️ Personal Trainers</h4>
            <p className="text-muted-foreground">
              Organize treinos personalizados com seus alunos, evitando horários
              sobrepostos ou esquecimentos.
            </p>
          </div>

          {/* Caso de uso 3 */}
          <div className="rounded-2xl border p-6 shadow-sm bg-white">
            <h4 className="text-xl font-semibold mb-2">🧘 Aulas de Yoga</h4>
            <p className="text-muted-foreground">
              Gerencie suas turmas e permita que alunos reservem suas vagas em
              horários específicos com lembretes automáticos.
            </p>
          </div>
        </div>
      </section>

      <FAQSection />

      <Separator className="my-6" />

      <footer className="text-center text-sm text-muted-foreground pb-6">
        © {new Date().getFullYear()} Agendify. Todos os direitos reservados.
      </footer>
    </main>
  );
}

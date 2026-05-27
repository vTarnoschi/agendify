import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ThemeFlavorToggle } from "~/components/theme-flavor-toggle";
import { ThemeToggle } from "~/components/theme-toggle";
import { Calendar as CalendarIcon, Link as LinkIcon, Search, LayoutDashboard, Users, Settings2, BellRing } from "lucide-react";

export default function ExperimentPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans tracking-tight">

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b px-4 lg:px-8 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
            A
          </div>
          <span className="font-semibold text-lg tracking-tight">Agendify Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium px-2 text-muted-foreground hidden md:inline">Tema:</span>
          <ThemeToggle />
          <ThemeFlavorToggle />
        </div>
      </header>

      <div className="flex">
        {/* Mock Sidebar */}
        <aside className="w-64 hidden lg:flex flex-col sidebar-midnight h-[calc(100vh-4rem)] sticky top-16 p-4 gap-2">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">Workspace</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm sidebar-item-active">
            <LayoutDashboard size={18} />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <CalendarIcon size={18} />
            Agendamentos
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Users size={18} />
            Clientes
          </a>
          <div className="text-xs font-semibold text-muted-foreground mt-6 mb-2 px-2 uppercase tracking-wider">Configurações</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Settings2 size={18} />
            Negócio
          </a>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 space-y-16 max-w-6xl mx-auto">

          {/* Section: Typography & Intro */}
          <section className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Midnight Orange V2</h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Design System desenhado para focar em clareza no Light Mode e imersão tecnológica no Dark Mode. Teste os componentes abaixo simulando o ecossistema real do Agendify.
            </p>
          </section>

          {/* Section: Component Library */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-6 w-1 bg-primary rounded-full"></span>
              <h2 className="text-2xl font-semibold tracking-tight">Botões Premium</h2>
            </div>
            <div className="flex flex-wrap gap-4 items-center p-8 rounded-[var(--radius)] border bg-card/40 midnight-shadow">
              <Button variant="midnight-primary">Primary Action</Button>
              <Button variant="midnight-outline">Secondary Action</Button>
              <Button variant="midnight-ghost">Ghost Action</Button>
            </div>
          </section>

          {/* Section: Onboarding / Forms */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-6 w-1 bg-primary rounded-full"></span>
              <h2 className="text-2xl font-semibold tracking-tight">Inputs & Onboarding</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="card-midnight p-2">
                <CardHeader>
                  <CardTitle className="text-xl">Crie seu Link</CardTitle>
                  <CardDescription>Defina sua url de acesso público.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Agendify URL</Label>
                    <div className="flex items-center">
                      <span className="flex items-center px-3 h-11 bg-muted border border-r-0 border-border rounded-l-[calc(var(--radius)-4px)] text-muted-foreground text-sm">
                        agendify.com/
                      </span>
                      <Input id="slug" defaultValue="meu-negocio" className="h-11 rounded-l-none input-midnight" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Profissional</Label>
                    <Input id="name" placeholder="Dr. João Silva" className="h-11 input-midnight" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="midnight-primary" className="w-full">Concluir Setup</Button>
                </CardFooter>
              </Card>

              {/* Informative / Alert Style */}
              <div className="flex flex-col gap-4">
                <div className="p-6 rounded-[var(--radius)] border border-primary/20 bg-accent/30 flex items-start gap-4">
                  <BellRing className="text-primary mt-1" size={20} />
                  <div>
                    <h4 className="font-medium">Dica de UX</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Inputs no tema Midnight usam <code>box-shadow</code> interior sutil. O Focus Ring nativo foi removido em favor de um border accent dramático, aumentando o conforto visual.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Dashboard Mockup */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-6 w-1 bg-primary rounded-full"></span>
              <h2 className="text-2xl font-semibold tracking-tight">Métricas (Dashboard)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-midnight shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento Mês</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-foreground tracking-tight">R$ 4.231,00</div>
                  <p className="text-xs text-primary font-medium mt-1">+20.1% em relação ao mês passado</p>
                </CardContent>
              </Card>

              <Card className="card-midnight shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Próximos Agendamentos</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-foreground tracking-tight">+12</div>
                  <p className="text-xs text-muted-foreground mt-1">Sendo 3 para o dia de hoje</p>
                </CardContent>
              </Card>

              <Card className="card-midnight shadow-none border-primary/20 bg-accent/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-primary">Seu Link Público</CardTitle>
                  <LinkIcon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium text-foreground tracking-tight truncate">agendify.com/joao</div>
                  <Button variant="midnight-ghost" size="sm" className="mt-2 h-8 px-0 text-primary">Copiar Link</Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section: Public Calendar Slot */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-6 w-1 bg-primary rounded-full"></span>
              <h2 className="text-2xl font-semibold tracking-tight">Calendário (Visitor View)</h2>
            </div>

            <div className="max-w-xl p-8 rounded-[calc(var(--radius)+8px)] border bg-card midnight-shadow">
              <h3 className="text-lg font-medium mb-6">Escolha um horário</h3>

              <div className="grid grid-cols-3 gap-3">
                <button className="h-12 rounded-xl border border-border flex items-center justify-center font-medium hover:border-primary/50 hover:bg-accent transition-colors active:scale-[0.98]">
                  09:00
                </button>
                <button className="h-12 rounded-xl border border-primary bg-accent text-primary flex items-center justify-center font-medium midnight-glow transition-all scale-[1.02]">
                  10:00
                </button>
                <button className="h-12 rounded-xl border border-border flex items-center justify-center font-medium hover:border-primary/50 hover:bg-accent transition-colors active:scale-[0.98]">
                  11:30
                </button>
                <button className="h-12 rounded-xl border border-border flex items-center justify-center font-medium opacity-50 cursor-not-allowed bg-muted">
                  14:00
                </button>
                <button className="h-12 rounded-xl border border-border flex items-center justify-center font-medium hover:border-primary/50 hover:bg-accent transition-colors active:scale-[0.98]">
                  15:00
                </button>
                <button className="h-12 rounded-xl border border-border flex items-center justify-center font-medium hover:border-primary/50 hover:bg-accent transition-colors active:scale-[0.98]">
                  16:30
                </button>
              </div>

              <div className="mt-8 pt-6 border-t flex justify-end">
                <Button variant="midnight-primary" className="px-8">Avançar</Button>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export function PricingSection() {
  return (
    <section className="px-6 py-20 bg-muted/50">
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h2 className="text-3xl font-semibold mb-3">
          Planos simples e transparentes
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Comece gratuitamente e faça o upgrade quando precisar de mais
          personalização e recursos avançados para o seu negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Plano Free */}
        <Card className="flex flex-col border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Free</CardTitle>
            <CardDescription className="text-sm mt-2">
              Para profissionais que estão começando e precisam do essencial.
            </CardDescription>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold">
              R$ 0
              <span className="ml-1 text-xl font-medium text-muted-foreground">
                /mês
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Até 50 agendamentos por mês</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Até 2 tipos de serviços</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Integração com 1 Google Calendar</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Upload da própria Logo</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground/60">
                <X className="h-4 w-4 shrink-0" />
                <span className="line-through">
                  URL do negócio customizável
                </span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground/60">
                <X className="h-4 w-4 shrink-0" />
                <span className="line-through">
                  Cores da marca personalizadas
                </span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/sign-up">Começar de Graça</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Plano Starter */}
        <Card className="relative flex flex-col border-primary/50 shadow-lg ring-1 ring-primary/20 bg-card hover:shadow-xl transition-all scale-100 md:scale-105 z-10">
          <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
            <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1">
              Mais Escolhido
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Starter</CardTitle>
            <CardDescription className="text-sm mt-2">
              Para quem deseja passar credibilidade e ter total liberdade.
            </CardDescription>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-foreground">
              R$ 49
              <span className="ml-1 text-xl font-medium text-muted-foreground">
                /mês
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3 text-foreground font-medium">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Agendamentos Ilimitados</span>
              </li>
              <li className="flex items-center gap-3 text-foreground font-medium">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Serviços Ilimitados</span>
              </li>
              <li className="flex items-center gap-3 text-foreground font-medium">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>URL do negócio 100% customizável</span>
              </li>
              <li className="flex items-center gap-3 text-foreground font-medium">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Cores da marca personalizadas</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Múltiplos calendários (evita qualquer choque)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Lembretes automáticos por e-mail</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Remoção da marca Agendify</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              asChild
            >
              <Link href="/sign-up">Assinar Starter</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

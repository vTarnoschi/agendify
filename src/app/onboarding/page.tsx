"use client";

import { useOnboardingForm } from "~/features/onboarding/hooks/use-onboarding-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

export default function OnboardingPage() {
  const {
    form,
    handleBusinessNameChange,
    handleSlugChange,
    handleSubmit,
    loading,
    error,
  } = useOnboardingForm();

  // Se o formulário é inválido ou está carregando
  const isValid = form.formState.isValid;

  return (
    <div className="flex h-screen w-full items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-glow-primary" />
      <Card className="relative z-10 w-full max-w-md border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Bem-vindo ao Agendify!
          </CardTitle>
          <CardDescription>
            Configure o seu perfil de Profissional para liberar o seu link de
            agendamento público.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Nome do Negócio */}
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="font-bold text-foreground">
                      Nome do Negócio / Profissional{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Barbearia do Zé ou Dr. João"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleBusinessNameChange(e);
                        }}
                        required
                        className="h-11 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-semibold" />
                  </FormItem>
                )}
              />

              {/* Link Personalizado */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="font-bold text-foreground">
                      Seu Link Personalizado{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground whitespace-nowrap font-medium">
                        agendify.com/
                      </span>
                      <FormControl>
                        <Input
                          placeholder="barbearia-do-ze"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleSlugChange(e);
                          }}
                          maxLength={40}
                          required
                          className="h-11 rounded-xl"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs font-semibold" />
                    <p className="text-xs text-muted-foreground">
                      Apenas letras minúsculas, números e hifens.
                    </p>
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-3.5 bg-destructive/15 text-destructive rounded-xl text-xs font-semibold animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-bold cursor-pointer"
                disabled={loading || !isValid}
              >
                {loading ? "Salvando..." : "Concluir Configuração"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

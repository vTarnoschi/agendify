"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "~/components/ui/form";

import { Input } from "~/components/ui/input";

import { Button } from "~/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const signupSchema = z.object({
  name: z
    .string()
    .nonempty("Este campo é obrigatório")
    .min(2, "Nome muito curto")
    .max(50, "Nome muito longo")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  email: z
    .string()
    .nonempty("Este campo é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .nonempty("Este campo é obrigatório")
    .min(6, "Senha muito curta"),
});

type SignupFormSchemaType = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const form = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SignupFormSchemaType) => {
    console.log(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Criar conta</CardTitle>
        <CardDescription>Crie sua conta Agendify</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="email@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha </FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-4">
              Criar conta
            </Button>

            <div className="mt-4 text-center text-sm">
              Já possui uma conta?{" "}
              <a
                href="/sign-in"
                className="hover:underline underline-offset-4 text-blue-600"
              >
                Entrar
              </a>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { useSignin } from "~/queries/use-sign-in";

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

const signinSchema = z.object({
  email: z
    .string()
    .nonempty("Este campo é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .nonempty("Este campo é obrigatório")
    .min(6, "Senha muito curta"),
});

type SigninFormSchemaType = z.infer<typeof signinSchema>;

export default function SigninPage() {
  const router = useRouter();

  const form = useForm<SigninFormSchemaType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useSignin(() => {
    router.push("/dashboard");
  });

  const onSubmit = useCallback(
    (values: SigninFormSchemaType) => {
      mutate(values);
    },
    [mutate]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>Entre com a sua conta Agendify</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <FormLabel className="flex justify-between items-center">
                    <span>Senha</span>
                    <a
                      href="#"
                      className="text-xs underline-offset-4 hover:underline"
                    >
                      Esqueci minha senha?
                    </a>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Entrar
            </Button>

            <div className="mt-4 text-center text-sm">
              Não possui uma conta?{" "}
              <a
                href="/sign-up"
                className="hover:underline underline-offset-4 text-blue-600"
              >
                Criar nova conta
              </a>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { SignupFormValues, signupSchema } from "@/schemas/auth";
import { TabsContent } from "@radix-ui/react-tabs";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldForm } from "../_components/field-form";
import { useRegister } from "../mutation";

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace(`/feed/${session.user.id}`);
    }
  }, [session, router]);

  const togglePassword = () => setShowPassword(!showPassword);
  const { control, handleSubmit, setError } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const { mutate: register, isPending } = useRegister({
    router,
    setError,
  });

  const handleRegister = (data: SignupFormValues) => {
    register(data);
  };

  return (
    <TabsContent value="sign-up">
      <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FieldForm
              {...field}
              label="Nome completo"
              placeholder="João da Silva"
              icon={<User />}
              error={error?.message}
              disabled={isPending}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FieldForm
              label="E-mail"
              placeholder="H6f8o@example.com"
              icon={<Mail />}
              {...field}
              error={error?.message}
              disabled={isPending}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FieldForm
              label="Senha"
              placeholder="••••••••"
              icon={<Lock />}
              type={showPassword ? "text" : "password"}
              togglePassword={togglePassword}
              showPassword={showPassword}
              {...field}
              error={error?.message}
              disabled={isPending}
            />
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta ...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>
    </TabsContent>
  );
}

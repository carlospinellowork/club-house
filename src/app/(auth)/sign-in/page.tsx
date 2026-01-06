"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LoginFormValues, loginSchema } from "@/schemas/auth";
import { TabsContent } from "@radix-ui/react-tabs";
import { Loader2, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldForm } from "../_components/field-form";
import { useLogin } from "../mutation";

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, isPending: isCheckingSession } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace(`/feed/${session.user.id}`);
    }
  }, [session, router]);

  const togglePassword = () => setShowPassword(!showPassword);

  const { control, handleSubmit, setError } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate: login, isPending: isPending } = useLogin({
    router,
    setError,
  });

  const handleLogin = async (data: LoginFormValues) => {
    login(data);
  };

  return (
    <TabsContent value="sign-in">
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
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
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </TabsContent>
  );
}

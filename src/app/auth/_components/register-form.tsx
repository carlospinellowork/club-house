"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { SignupFormValues, signupSchema } from "@/schemas/auth";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { FieldForm } from "./field-form";

interface RegisterFormProps {
  onSubmit: (data: SignupFormValues) => Promise<void>;
  isLoading: boolean;
  showPassword: boolean;
  togglePassword: () => void;
}

export function RegisterForm({
  onSubmit,
  isLoading,
  showPassword,
  togglePassword,
}: RegisterFormProps) {
  const { control, handleSubmit } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          />
        )}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta ...
          </>
        ) : (
          "Criar conta"
        )}
      </Button>
    </form>
  );
}

import { authClient } from "@/lib/auth-client";
import { LoginFormValues, SignupFormValues } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { User } from "better-auth";
import { toast } from "sonner";

interface IAuthMutationProps {
  router: {
    replace: (path: string) => void;
  };
  onSuccess?: (user: User) => void;
  setError?: (
    name: "email" | "password" | `root.${string}` | "root",
    error: { message: string }
  ) => void;
}

export const useLogin = ({
  router,
  onSuccess,
  setError,
}: IAuthMutationProps) => {
  return useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      const { data, error } = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      if (!data?.user) {
        throw new Error("Dados do usuário não encontrados");
      }

      return data;
    },
    onSuccess: (data) => {
      if (!data?.user?.id) {
        toast.error("Dados de usuário inválidos");
        return;
      }

      onSuccess?.(data.user);
      router.replace(`/feed/${data.user.id}`);
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      
      if (error.message === "Failed to fetch") {
        toast.error("Erro de conexão. Verifique se o servidor está rodando.");
        return;
      }

      if (error.code === "INVALID_EMAIL_OR_PASSWORD" && setError) {
        setError("email", { message: "Credenciais inválidas" });
        setError("password", { message: "Credenciais inválidas" });
        toast.error("Email ou senha inválidos, por favor tente novamente.");
        return;
      }

      toast.error(error.message || "Erro ao realizar login");
    },
  });
};

export const useRegister = ({ router, setError }: IAuthMutationProps) => {
  return useMutation({
    mutationFn: async (userData: SignupFormValues) => {
      const { data, error } = await authClient.signUp.email({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success("Conta criada com sucesso, seja bem-vindo!");
      router.replace(`/feed/${data.user.id}`);
    },
    onError: (error: any) => {
      console.error("Registration error:", error);

      if (error.message === "Failed to fetch") {
        toast.error("Erro de conexão. Verifique se o servidor está rodando.");
        return;
      }

      if (error.code === "USER_ALREADY_EXISTS" && setError) {
        setError("email", { message: "Este e-mail já está em uso" });
        toast.error("Este e-mail já está em uso.");
        return;
      }

      toast.error(error.message || "Erro ao criar conta");
    },
  });
};

export const useLogout = ({ router }: IAuthMutationProps) => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      router.replace("/");
    },
    onError: (error: any) => {
      console.error("Logout error:", error);
      toast.error(error.message || "Erro ao fazer logout");
    },
  });
};


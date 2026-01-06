'use client'

import { Loader2, Shield } from "lucide-react";
import Image from "next/image";

import BackgroundImage from "@/assets/photo-1489944440615-453fc2b6a9a9.avif";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useTransition } from "react";
import { AuthTabs } from "./_components/auth-tabs";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentTab = pathname?.includes("sign-up") ? "sign-up" : "sign-in";

  const handleTabChange = (value: string) => {
    startTransition(() => {
      router.push(`/${value}`);
    });
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:flex items-center justify-center bg-muted">
        <Image
          fill
          src={BackgroundImage}
          alt="Image"
          className="absolute inset-0 object-cover"
          priority
        />

        <div className="relative bottom-48 z-10 flex flex-col items-center gap-3 text-white">
          <Shield className="size-32" />
          <span className="text-2xl font-bold drop-shadow-lg text-pretty">
            ClubHouse FC
          </span>
          <span className="text-muted-foreground">
            Conecte-se com a comunidade do seu clube
          </span>
        </div>

        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10 relative">
        {/* Transition Overlay */}
        <div className={cn(
          "absolute inset-0 z-50 bg-background/60 backdrop-blur-xs flex items-center justify-center transition-opacity duration-300 pointer-events-none opacity-0 text-primary",
          isPending && "opacity-100 pointer-events-auto"
        )}>
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <Shield className="size-24 opacity-20" />
            <Loader2 className="animate-spin size-6" />
          </div>
        </div>

        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Shield className="size-4" />
            </div>
            ClubHouse FC
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
            <Card className="w-full overflow-hidden">
              <CardHeader>
                <CardTitle>Bem-vindo</CardTitle>
                <CardDescription>
                  Entre na sua conta ou crie uma nova para acessar o feed do
                  clube
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuthTabs 
                  value={currentTab} 
                  onValueChange={handleTabChange}
                >
                  {children}
                </AuthTabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import BannerImg from "@/assets/photo-1489944440615-453fc2b6a9a9.avif";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Trophy,
  UserPlus,
  Users,
  Zap
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeaderClient from "./_components/header-client";

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Comunidade Vibrante",
      description: "Conecte-se com milhares de torcedores apaixonados pelo seu clube."
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Atualizações em Tempo Real",
      description: "Receba notícias, resultados e fofocas do vestiário antes de todo mundo."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-green-500" />,
      title: "Debates Exclusivos",
      description: "Participe de discussões ricas com ferramentas de edição avançadas."
    },
    {
      icon: <Trophy className="h-6 w-6 text-purple-500" />,
      title: "Clima de Estádio",
      description: "Sinta a emoção de estar no jogo, mesmo estando em casa."
    }
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 transition-colors duration-300">
      <HeaderClient />

      <main>
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent -z-10" />
          
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-8 animate-fade-in">
                <Badge variant="outline" className="px-4 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary rounded-full">
                  ⚽ A Rede Social do Torcedor
                </Badge>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                  Onde o seu <span className="text-primary">coração</span> bate mais forte.
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                  ClubHouse FC é a plataforma definitiva para quem vive e respira futebol. 
                  Notícias, discussões e a melhor comunidade de torcedores reunida em um só lugar.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    className="text-lg px-8 h-14 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    onClick={() => router.push("/sign-in")}
                  >
                    Entrar Agora <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 h-14 rounded-full bg-background/50 backdrop-blur-sm transition-all hover:bg-accent"
                    onClick={() => router.push("/sign-up")}
                  >
                    Cadastre-se <UserPlus className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-4 pt-8 text-sm text-muted-foreground">
                    {/* {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <Image 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                          alt="User" 
                          width={40} 
                          height={40} 
                        />
                      </div>
                    ))} */}
                  <p>Mais de <span className="font-bold text-foreground">5.000+</span> torcedores ativos</p>
                </div>
              </div>

              <div className="relative group animate-slide-up">
                <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-primary/0 blur-3xl rounded-[3rem] opacity-50 transition-opacity group-hover:opacity-70" />
                <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-square lg:aspect-video">
                 <Image
                    src={BannerImg}
                    alt="ClubHouse FC Interface"
                    fill
                    className="object-cover"
                    priority
                  />

                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-background/10 backdrop-blur-md border border-white/10 hidden md:block">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                          <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">Ambiente Seguro</p>
                          <p className="text-xs text-white">Comunidade moderada para torcedores Reais.</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-none">Online</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Por que escolher o ClubHouse?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Desenvolvemos a plataforma pensando no que um torcedor de verdade precisa para se manter conectado.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-none bg-background shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="p-8 space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
              A arquibancada digital te espera.
            </h2>
            <p className="text-xl text-muted-foreground">
              Não fique de fora do maior ClubHouse do futebol brasileiro. 
              Junte-se à nação e comece a torcer agora mesmo.
            </p>
            <Button
              size="lg"
              className="px-10 h-16 text-xl rounded-full font-bold group shadow-xl"
              onClick={() => router.push("/sign-up")}
            >
              Começar Gratuitamente 
              <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} ClubHouse FC. Feito por torcedores, para torcedores.</p>
        </div>
      </footer>
    </div>
  );
}

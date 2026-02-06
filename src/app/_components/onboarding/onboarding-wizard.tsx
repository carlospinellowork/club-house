"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { ArrowRight, MapPin, Newspaper, Trophy, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function OnboardingWizard() {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();

  const [formData, setFormData] = useState({
    role: "FAN" as "FAN" | "JOURNALIST",
    favoriteTeamName: "",
    favoriteTeamId: null as number | null,
    favoriteTeamLogo: "",
    outlet: "",
    bio: "",
    location: "",
  });

  const completeOnboarding = trpc.member.completeOnboarding.useMutation({
    onSuccess: ({ id }) => {
      toast.success(
        "Perfil configurado com sucesso! Bem-vindo ao ClubHouse FC.",
      );
      setIsOpen(false);
      utils.member.getById.invalidate({ id });
    },
    onError: (err) => {
      toast.error("Erro ao configurar perfil: " + err.message);
      setLoading(false);
    },
  });

  useEffect(() => {
    if (session?.user && !session.user.hasOnboarded) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [session?.user]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    setLoading(true);
    completeOnboarding.mutate({
      role: formData.role,
      favoriteTeamName:
        formData.role === "FAN" ? formData.favoriteTeamName : undefined,
      outlet: formData.role === "JOURNALIST" ? formData.outlet : undefined,
      bio: formData.bio,
      location: formData.location,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-125 p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <div className="h-2 bg-muted w-full">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-center">
                    Como você quer se identificar?
                  </DialogTitle>
                  <DialogDescription className="text-center text-muted-foreground">
                    Escolha sua voz dentro da nossa comunidade.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4 pt-4">
                  <div
                    onClick={() => setFormData({ ...formData, role: "FAN" })}
                    className={`p-6 rounded-2xl transition-all cursor-pointer flex items-center gap-4 ${formData.role === "FAN" ? "bg-primary/10 text-primary" : "bg-transparent"}`}
                  >
                    <div className="p-3 rounded-xl bg-transparent">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">Torcedor</h4>
                      <p className="text-xs text-muted-foreground">
                        Quero interagir, torcer e participar da comunidade.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() =>
                      setFormData({ ...formData, role: "JOURNALIST" })
                    }
                    className={`p-6 rounded-2xl transition-all cursor-pointer flex items-center gap-4 ${formData.role === "JOURNALIST" ? "bg-primary/10 text-primary" : "bg-transparent"}`}
                  >
                    <div className="p-3 rounded-xl bg-transparent">
                      <Newspaper className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">Jornalista</h4>
                      <p className="text-xs text-muted-foreground">
                        Trago notícias, análises e informações do campo.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-center">
                    {formData.role === "FAN"
                      ? "Qual o seu time do coração?"
                      : "Onde você trabalha?"}
                  </DialogTitle>
                  <DialogDescription className="text-center text-muted-foreground">
                    {formData.role === "FAN"
                      ? "Isso ajuda a filtrar as notícias de seu interesse."
                      : "Identifique seu veículo de comunicação."}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                  {formData.role === "FAN" ? (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Time favorito
                      </Label>
                      <TeamAutocomplete
                        value={formData.favoriteTeamName}
                        onValueChange={(name) =>
                          setFormData({
                            ...formData,
                            favoriteTeamName: name,
                          })
                        }
                        onTeamSelect={(id, name, logo) =>
                          setFormData({
                            ...formData,
                            favoriteTeamName: name,
                            favoriteTeamId: id,
                            favoriteTeamLogo: logo,
                          })
                        }
                        placeholder="Buscar time... (ex: Flamengo, Barcelona)"
                        className="h-12 rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Veículo / Empresa
                      </Label>
                      <div className="relative">
                        <Newspaper className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ex: ESPN, Globo, Blog do Cadu..."
                          className="pl-10 h-12 rounded-xl"
                          value={formData.outlet}
                          onChange={(e) =>
                            setFormData({ ...formData, outlet: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-center">
                    Quase lá!
                  </DialogTitle>
                  <DialogDescription className="text-center text-muted-foreground">
                    Como você quer ser apresentado aos outros membros?
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Sua Localização
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Ex: São Paulo, SP"
                        className="pl-10 h-12 rounded-xl"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Bio Curta
                    </Label>
                    <Textarea
                      placeholder="Conte um pouco sobre você..."
                      className="rounded-xl min-h-[100px]"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                Voltar
              </Button>
            ) : (
              <div />
            )}

            <Button
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? "Salvando..." : step === 3 ? "Finalizar" : "Continuar"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

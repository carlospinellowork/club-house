"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

interface NextMatchWidgetProps {
  teamId: number;
  teamName: string;
}

export function NextMatchWidget({ teamId, teamName }: NextMatchWidgetProps) {
  const { data: fixtures, isLoading } = trpc.football.getNextFixtures.useQuery(
    { teamId, limit: 1 },
    {
      enabled: !!teamId,
      staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    }
  );

  if (isLoading) {
    return (
      <Card className="overflow-hidden bg-gradient-to-br from-emerald-950/40 to-card border-emerald-500/20">
        <CardHeader className="pb-4 border-b border-emerald-500/10 bg-emerald-950/20">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="pt-6">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const nextMatch = fixtures?.[0];

  if (!nextMatch) {
    return (
      <Card className="overflow-hidden bg-gradient-to-br from-emerald-950/40 to-card border-emerald-500/20">
        <CardHeader className="pb-4 border-b border-emerald-500/10 bg-emerald-950/20">
          <CardTitle className="text-sm font-bold text-emerald-50 flex items-center gap-2">
            ⚽ Próximo Jogo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum jogo agendado
          </p>
        </CardContent>
      </Card>
    );
  }

  const matchDate = new Date(nextMatch.date);
  const isHome = nextMatch.home.name === teamName;
  const opponent = isHome ? nextMatch.away : nextMatch.home;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-emerald-950/40 to-card border-emerald-500/20 shadow-2xl hover:border-emerald-500/40 transition-all">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />

        <CardHeader className="pb-4 border-b border-emerald-500/10 bg-emerald-950/20 relative z-10">
          <CardTitle className="text-sm font-bold text-emerald-50 flex items-center gap-2">
            ⚽ Próximo Jogo
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-emerald-400/70 mt-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 relative z-10">
          {/* League Badge */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/30">
            <div className="relative h-5 w-5">
              <Image
                src={nextMatch.league.logo}
                alt={nextMatch.league.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {nextMatch.league.name}
            </span>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className={cn(
              "flex flex-col items-center gap-2 flex-1",
              isHome && "order-1"
            )}>
              <div className="relative h-12 w-12">
                <Image
                  src={nextMatch.home.logo}
                  alt={nextMatch.home.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className={cn(
                "text-xs font-bold text-center line-clamp-2",
                isHome ? "text-emerald-400" : "text-muted-foreground"
              )}>
                {nextMatch.home.name}
              </p>
              {isHome && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  CASA
                </span>
              )}
            </div>

            {/* VS */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl font-black text-muted-foreground/30">VS</div>
            </div>

            {/* Away Team */}
            <div className={cn(
              "flex flex-col items-center gap-2 flex-1",
              !isHome && "order-1"
            )}>
              <div className="relative h-12 w-12">
                <Image
                  src={nextMatch.away.logo}
                  alt={nextMatch.away.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className={cn(
                "text-xs font-bold text-center line-clamp-2",
                !isHome ? "text-emerald-400" : "text-muted-foreground"
              )}>
                {nextMatch.away.name}
              </p>
              {!isHome && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">
                  FORA
                </span>
              )}
            </div>
          </div>

          {/* Venue */}
          {nextMatch.venue && (
            <div className="flex items-center justify-center gap-1 mt-4 pt-4 border-t border-border/30 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{nextMatch.venue.name}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Globe, Radio, RefreshCw, Tv } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LiveMatchCardProps {
  match: {
    id: number;
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
    league: {
      name: string;
      logo: string;
      country: string;
    };
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
    goals: {
      home: number | null;
      away: number | null;
    };
  };
  index: number;
}

function LiveMatchCard({ match, index }: LiveMatchCardProps) {
  const isLive = match.status.short === "1H" || match.status.short === "2H" || match.status.short === "HT";
  const isFinished = match.status.short === "FT";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`relative overflow-hidden transition-all duration-300 ${isLive
        ? "bg-gradient-to-br from-red-950/40 to-card border-red-500/30 shadow-lg shadow-red-500/10"
        : "bg-gradient-to-br from-card to-muted/20 border-border/50"
        }`}>
        {/* Live Indicator */}
        {isLive && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-pulse" />
        )}

        <CardContent className="p-4">
          {/* League Info */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              <div className="relative h-5 w-5">
                <Image
                  src={match.league.logo}
                  alt={match.league.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-xs font-semibold text-muted-foreground truncate max-w-[200px]">
                {match.league.name}
              </span>
            </div>

            {/* Status Badge */}
            <Badge
              variant={isLive ? "destructive" : isFinished ? "secondary" : "outline"}
              className={`text-[10px] font-bold ${isLive ? "bg-red-500 text-white animate-pulse" : ""
                }`}
            >
              {isLive && <Radio className="h-3 w-3 mr-1" />}
              {match.status.short === "1H" && `${match.status.elapsed}'`}
              {match.status.short === "2H" && `${match.status.elapsed}'`}
              {match.status.short === "HT" && "INTERVALO"}
              {match.status.short === "FT" && "ENCERRADO"}
              {!isLive && !isFinished && match.status.short}
            </Badge>
          </div>

          {/* Match Score */}
          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex-1 flex items-center gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src={match.home.logo}
                  alt={match.home.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="font-bold text-sm truncate">{match.home.name}</span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-3 px-4">
              <span className={`text-3xl font-black ${isLive ? "text-red-500" : "text-foreground"
                }`}>
                {match.goals.home ?? 0}
              </span>
              <span className="text-2xl font-black text-muted-foreground/30">-</span>
              <span className={`text-3xl font-black ${isLive ? "text-red-500" : "text-foreground"
                }`}>
                {match.goals.away ?? 0}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex-1 flex items-center gap-3 justify-end">
              <span className="font-bold text-sm truncate text-right">{match.away.name}</span>
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src={match.away.logo}
                  alt={match.away.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LiveMatchesContent() {
  const [countryFilter, setCountryFilter] = useState<"all" | "brazil">("all");

  const { data: liveMatches, isLoading, refetch } = trpc.football.getLiveFixtures.useQuery(
    undefined,
    {
      refetchInterval: 30000, // Atualiza a cada 30 segundos
      staleTime: 20000,
    }
  );

  // Filter matches by country
  const filteredMatches = liveMatches?.filter((match) => {
    if (countryFilter === "brazil") {
      return match.league.country === "Brazil";
    }
    return true;
  });

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30">
                <Tv className="h-8 w-8" />
              </div>
              Jogos ao Vivo
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              Acompanhe os placares em tempo real
            </p>
          </div>

          <Button
            onClick={() => refetch()}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>

        {/* Country Filter Tabs */}
        <Tabs value={countryFilter} onValueChange={(v) => setCountryFilter(v as "all" | "brazil")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all" className="gap-2">
              <Globe className="h-4 w-4" />
              Todos os Jogos
              {liveMatches && (
                <Badge variant="secondary" className="ml-2">
                  {liveMatches.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="brazil" className="gap-2">
              🇧🇷 Futebol Brasileiro
              {filteredMatches && countryFilter === "brazil" && (
                <Badge variant="secondary" className="ml-2">
                  {filteredMatches.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[180px] rounded-2xl" />
          ))}
        </div>
      )}

      {/* Live Matches Grid */}
      {!isLoading && filteredMatches && filteredMatches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMatches.map((match, index) => (
            <LiveMatchCard key={match.id} match={match} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!filteredMatches || filteredMatches.length === 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 space-y-6"
        >
          <div className="bg-gradient-to-br from-muted to-muted/50 p-8 rounded-full">
            <Tv className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">
              {countryFilter === "brazil"
                ? "Nenhum jogo brasileiro ao vivo no momento"
                : "Nenhum jogo ao vivo no momento"}
            </h2>
            <p className="text-muted-foreground max-w-md">
              {countryFilter === "brazil"
                ? "Não há partidas do futebol brasileiro acontecendo agora. Volte mais tarde!"
                : "Não há partidas acontecendo agora. Volte mais tarde para acompanhar os jogos em tempo real!"}
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="lg" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Verificar novamente
          </Button>
        </motion.div>
      )}

      {/* Auto-refresh indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-8 right-8 bg-card/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-xs text-muted-foreground"
      >
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        Atualização automática a cada 30s
      </motion.div>
    </div>
  );
}

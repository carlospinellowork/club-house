"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar, Edit, Layers, MapPin, MessageSquare, ThumbsUp, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { EditProfileDialog } from "./edit-profile";

import { Skeleton } from "@/components/ui/skeleton";
import { AppRouter } from "@/server/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { PostCard } from "../../feed/[id]/_components/post-card";
import { ProfileMetrics } from "./profile-metrics";

type RouterOutput = inferRouterOutputs<AppRouter>;
type MemberOutput = RouterOutput["member"]["getById"];
type PostsOutput = RouterOutput["member"]["getAllPostsByMember"];

interface MemberProfileProps {
  initialMember: MemberOutput;
  initialPosts: PostsOutput;
}

export function MemberProfile({
  initialMember,
  initialPosts,
}: MemberProfileProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const params = useParams();
  const memberId = params.id as string;

  const {
    data: member,
    isLoading,
    isError,
  } = trpc.member.getById.useQuery(
    {
      id: memberId,
    },
    { initialData: initialMember }
  );

  const { data: posts } = trpc.member.getAllPostsByMember.useQuery(
    {
      id: memberId,
    },
    { initialData: initialPosts }
  );

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !member)
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="bg-muted p-6 rounded-full">
          <Users className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Membro não encontrado</h1>
        <p className="text-muted-foreground">O perfil que você está procurando não existe ou foi removido.</p>
      </div>
    );

  const stats = [
    { label: "Posts", value: member.stats.posts, icon: Layers, color: "from-emerald-500 to-teal-500", emoji: "📝" },
    { label: "Comentários", value: member.stats.comments, icon: MessageSquare, color: "from-blue-500 to-cyan-500", emoji: "💬" },
    { label: "Likes", value: member.stats.likes, icon: ThumbsUp, color: "from-rose-500 to-pink-500", emoji: "❤️" },
    { label: "Seguindo", value: member.stats.following, icon: Users, color: "from-amber-500 to-yellow-500", emoji: "👥" },
    { label: "Seguidores", value: member.stats.followers, icon: Users, color: "from-violet-500 to-purple-500", emoji: "⭐" },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section - Estádio Style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Stadium Background with Grass Texture */}
        <div className="h-56 md:h-72 rounded-3xl overflow-hidden relative shadow-2xl">
          {/* Grass Field Pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900">
            {/* Grass Stripes */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`h-full ${i % 2 === 0 ? 'bg-emerald-800/40' : 'bg-transparent'}`}
                  style={{
                    width: `${100 / 12}%`,
                    position: 'absolute',
                    left: `${(100 / 12) * i}%`,
                  }}
                />
              ))}
            </div>

            {/* Stadium Lights Effect */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl" />

            {/* Field Lines */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/30" />
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20" />

            {/* Corner Decorations */}
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-lg shadow-yellow-400/50" />
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-lg shadow-red-500/50" />
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="px-6 md:px-12 -mt-20 md:-mt-24 flex flex-col md:flex-row items-end md:items-center gap-6 relative z-10">
          <Avatar className="h-36 w-36 md:h-44 md:w-44 ring-8 ring-background shadow-2xl transition-transform hover:scale-105 duration-300 border-4 border-emerald-400/50">
            <AvatarImage
              className="object-cover"
              src={member.avatar || "/placeholder.svg"}
            />
            <AvatarFallback className="text-4xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {member?.name}
                </h1>
                {member.role === 'JOURNALIST' && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/30 px-3 py-1">
                    📰 Jornalista
                  </Badge>
                )}
                {member.isVerified && (
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5 rounded-full shadow-lg shadow-emerald-500/30">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm font-medium mt-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full border border-emerald-500/30 backdrop-blur-sm">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Desde {member?.joinDate}</span>
                </div>
                {member.location && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full border border-blue-500/30 backdrop-blur-sm">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-700 dark:text-blue-300 font-semibold">{member.location}</span>
                  </div>
                )}
                {member.favoriteTeamName && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full border border-amber-500/30 backdrop-blur-sm">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span className="text-amber-700 dark:text-amber-300 font-bold">⚽ {member.favoriteTeamName}</span>
                  </div>
                )}
              </div>
            </div>

            {member?.isOwnProfile && (
              <Button
                size="lg"
                onClick={() => setShowEditDialog(true)}
                className="rounded-xl shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 text-white font-bold transition-all hover:-translate-y-1 hover:shadow-emerald-500/30"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio Section - Trophy Card Style */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-emerald-950/20 border-emerald-500/20 shadow-2xl hover:border-emerald-500/40 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <CardContent className="pt-6 relative z-10">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Trophy className="h-5 w-5" />
                  Sobre o Jogador
                </h3>
                {member.bio ? (
                  <p className="text-lg text-foreground/80 leading-relaxed border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-500/5 rounded-r-lg">
                    "{member.bio}"
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">Nenhuma biografia disponível.</p>
                )}

                <div className="flex flex-wrap gap-2 mt-6">
                  {member?.badges?.map((badge: string, index: number) => (
                    <Badge
                      key={index}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300 flex items-center gap-2 hover:from-amber-500/30 hover:to-yellow-500/30 transition-all shadow-lg shadow-amber-500/10 font-bold"
                    >
                      <Trophy className="h-4 w-4" />
                      <span>{badge}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Metrics Section */}
          <ProfileMetrics memberId={memberId} />

          {/* Posts Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                  <Layers className="h-6 w-6" />
                </div>
                Publicações
                <span className="text-base font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                  {posts?.length || 0}
                </span>
              </h2>
            </div>

            {posts && posts.length > 0 ? (
              <div className="flex flex-col gap-6">
                {posts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <PostCard postCard={post} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-12 border-2 border-dashed border-emerald-500/30 flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-emerald-500/10 p-6 rounded-full">
                  <Layers className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-muted-foreground font-semibold text-lg">Nenhuma publicação no placar ainda.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar Column - Scoreboard Style */}
        <div className="space-y-8">
          {/* Next Match Widget - Only show if user has favorite team */}
          {member.favoriteTeamName && member.favoriteTeamId && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <NextMatchWidget
                teamId={member.favoriteTeamId}
                teamName={member.favoriteTeamName}
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border-emerald-500/30 shadow-2xl sticky top-24">
              {/* Scoreboard Header */}
              <div className="h-3 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500" />

              <CardContent className="pt-6 space-y-4">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-white">
                  <div className="p-2 rounded-lg bg-emerald-500">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  Placar de Estatísticas
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 hover:border-emerald-500/50 transition-all group shadow-lg"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      <div className="flex items-center justify-between p-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{stat.emoji}</div>
                          <span className="text-sm font-bold text-zinc-300 uppercase tracking-wide">{stat.label}</span>
                        </div>
                        <span className="text-3xl font-black bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                          {stat.value}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Engagement Power */}
                <div className="pt-4 mt-6 border-t border-zinc-700/50">
                  <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
                    <p className="text-xs text-center text-zinc-300 font-semibold mb-1">
                      ⚡ PODER DE ENGAJAMENTO
                    </p>
                    <p className="text-center">
                      <span className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        {Math.round((member.stats.likes + member.stats.comments) / (member.stats.posts || 1) * 10) / 10}
                      </span>
                      <span className="text-sm text-zinc-400 ml-2">por post</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {showEditDialog && (
        <EditProfileDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          member={member}
        />
      )}
    </div>
  );
}

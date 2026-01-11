"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar, Edit, MapPin, Trophy } from "lucide-react";
import { useState } from "react";
import { EditProfileDialog } from "./edit-profile";

import { Skeleton } from "@/components/ui/skeleton";
import { AppRouter } from "@/server/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { useParams } from "next/navigation";
import { PostCard } from "../../feed/[id]/_components/post-card";

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

  const stats = [
    { label: "Posts", value: member?.stats.posts },
    { label: "Comentários", value: member?.stats.comments },
    { label: "Curtidas", value: member?.stats.likes },
    { label: "Seguindo", value: member?.stats.following },
    { label: "Seguidores", value: member?.stats.followers },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Skeleton className="h-24 w-24 rounded-full" />

              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-8 w-28 mt-2 md:mt-0 rounded-lg" />
                </div>

                <div className="flex space-x-6">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>

                <Skeleton className="h-16 w-full max-w-2xl rounded-lg" />

                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card
                  key={i}
                  className="text-center shadow-sm border border-border"
                >
                  <CardContent className="space-y-2">
                    <Skeleton className="h-5 w-10 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !member)
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  ?
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <h1 className="text-2xl font-bold">Membro não encontrado</h1>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-2 ring-border">
                <AvatarImage
                  className="object-cover"
                  src={member.avatar || "/placeholder.svg"}
                />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    {member?.name}{" "}
                    {member?.isOwnProfile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowEditDialog(true)}
                        className="mt-2 md:mt-0"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </Button>
                    )}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Membro desde {member?.joinDate}</span>
                    </div>
                    {member.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{member.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {member.bio && (
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {member.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {member?.badges?.map((badge: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <Trophy className="h-3 w-3" />
                    <span>{badge}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.map((stat, i) => (
              <Card
                key={i}
                className="text-center shadow-sm border border-border"
              >
                <CardContent>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {posts && posts.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-bold">Publicações</h2>
              <div className="flex flex-col gap-4">
                {posts.map((post) => (
                  <PostCard key={post.id} postCard={post} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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

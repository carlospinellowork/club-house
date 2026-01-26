"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc";
import { toggleFollowAction, toggleLikeAction } from "@/server/actions";
import type { AppRouter } from "@/server/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CommentsSection } from "./comment-section";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type Post =
  | (RouterOutputs["post"]["getAll"][number] & { isLiked?: boolean; isFollowing?: boolean })
  | (RouterOutputs["member"]["getAllPostsByMember"][number] & { isLiked?: boolean; isFollowing?: boolean });

type PostCardProps = {
  postCard: Post;
};

export function PostCard({ postCard }: PostCardProps) {
  const params = useParams();
  const utils = trpc.useUtils();
  const [openComments, setOpenComments] = useState(false);
  const [isLiking, startLikeTransition] = useTransition();
  const [isFollowing, startFollowTransition] = useTransition();

  const post = postCard;

  const handleLike = () => {
    startLikeTransition(async () => {
      try {
        await toggleLikeAction({ postId: String(post.id) });
        utils.post.getAll.invalidate();
        utils.member.getAllPostsByMember.invalidate();
      } catch (error) {
        toast.error("Erro ao curtir post");
      }
    });
  };

  const handleFollow = () => {
    startFollowTransition(async () => {
      try {
        await toggleFollowAction({ userId: post.user.id });
        utils.post.getAll.invalidate();
        utils.member.getAllPostsByMember.invalidate();
      } catch (error) {
        toast.error("Erro ao seguir usuário");
      }
    });
  };

  return (
    <Card className="p-0 overflow-hidden border border-border/50 rounded-lg">
      <div className="bg-primary h-28 relative" />

      <CardContent className="p-6 -mt-36 relative">
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-col items-start justify-center space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/profile/${post.user.id}`}>
                  <Avatar className="h-36 w-36 border-4 cursor-pointer hover:opacity-90 transition bg-background">
                    {post.user.image && (
                      <AvatarImage
                        className="object-cover"
                        src={post.user.image}
                        alt={post.user.name}
                      />
                    )}
                    <AvatarFallback className="bg-linear-to-br from-primary/20 to-secondary/20 text-primary font-bold text-3xl">
                      {post.user.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{post.user.bio}</p>
              </TooltipContent>
            </Tooltip>

            <div className="leading-tight">
              <h3 className="font-bold text-xl text-foreground mb-1">
                {post.user.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {post.user.email ||
                  `${post.user.name
                    .toLowerCase()
                    .replace(/\s+/g, "")}@teste.com`}
              </p>
            </div>
          </div>

          {post.user.id !== params.id && (
            <Button
              size="sm"
              variant={post.isFollowing ? "outline" : "default"}
              className="rounded-full px-4 py-2 text-sm font-medium"
              onClick={handleFollow}
              disabled={isFollowing}
            >
              {post.isFollowing ? "Seguindo" : "Seguir"}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium leading-relaxed whitespace-pre-line text-foreground">
            {post.content}
          </p>

          {post.image && (
            <div className="rounded-lg overflow-hidden border border-border/50">
              <Image
                src={post.image || "/placeholder.svg"}
                alt="Post image"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="flex items-center space-x-6 bg-foreground/5 p-1 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-2 rounded-full px-0 py-1 hover:bg-transparent hover:text-red-500 ${post.isLiked ? "text-red-500" : "text-muted-foreground"
                }`}
            >
              <Heart
                data-testid="heart-icon"
                className={`h-5 w-5 ${post.isLiked ? "fill-current" : ""}`}
              />
              <span className="text-sm">{post.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 rounded-full px-0 py-1 hover:bg-transparent hover:text-primary text-muted-foreground"
              onClick={() => setOpenComments(!openComments)}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{post.comments}</span>
            </Button>
          </div>

          {openComments && (
            <div className="pt-4 border-t border-border/50">
              <CommentsSection postId={String(post.id)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

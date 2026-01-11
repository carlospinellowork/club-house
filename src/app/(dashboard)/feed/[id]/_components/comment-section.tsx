"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { addCommentAction } from "@/server/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type CommentProps = {
  postId: string;
};

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "O comentário deve ter pelo menos 1 caractere")
    .max(300, "O comentário deve ter no máximo 300 caracteres"),
  postId: z.string(),
  parentId: z.string().optional(),
});

type CommentSchema = z.infer<typeof commentSchema>;

export function CommentsSection({ postId }: CommentProps) {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const utils = trpc.useUtils();

  const { data: comments, isLoading } = trpc.comment.getCommentByPost.useQuery({
    postId,
  });

  const { control, handleSubmit, reset } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      postId,
      parentId: undefined,
    },
  });

  const {
    control: replyControl,
    handleSubmit: handleSubmitReply,
    reset: resetReply,
  } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      postId,
      parentId: undefined,
    },
  });

  const onSubmit: SubmitHandler<CommentSchema> = (data) => {
    startTransition(async () => {
      try {
        await addCommentAction({
          postId,
          content: data.content,
        });
        utils.comment.getCommentByPost.invalidate({ postId });
        reset();
        toast.success("Comentário adicionado com sucesso");
      } catch (error) {
        toast.error("Erro ao adicionar comentário");
      }
    });
  };

  const onSubmitReply: SubmitHandler<CommentSchema> = (data) => {
    if (!replyingTo) return;
    startTransition(async () => {
      try {
        await addCommentAction({
          postId,
          content: data.content,
          parentId: String(replyingTo),
        });
        utils.comment.getCommentByPost.invalidate({ postId });
        resetReply();
        setReplyingTo(null);
        toast.success("Resposta enviada com sucesso");
      } catch (error) {
        toast.error("Erro ao enviar resposta");
      }
    });
  };

  if (isLoading) return <div>Carregando comentários...</div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="flex-1 border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none bg-background"
              placeholder="Adicione um comentário..."
            />
          )}
        />
        <Button size="sm" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Comentando...
            </>
          ) : (
            "Comentar"
          )}
        </Button>
      </form>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex flex-col space-y-2">
            <div className="flex gap-3">
              <Link href={`/profile/${comment.user.id}`}>
                <Avatar className="h-10 w-10 cursor-pointer border border-border/50 bg-muted">
                  {comment.user.image && (
                    <AvatarImage src={comment.user.image} className="object-cover" />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {comment.user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 bg-muted/30 rounded-lg p-3 border border-border/20">
                <span className="font-medium text-sm">{comment.user.name}</span>
                <p className="text-sm mt-1">{comment.content}</p>

                <div className="mt-2 flex gap-3 text-xs text-gray-500">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-1 py-0 h-auto"
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment.id ? null : comment.id
                      )
                    }
                  >
                    Responder
                  </Button>
                </div>

                {replyingTo === comment.id && (
                  <form
                    onSubmit={handleSubmitReply(onSubmitReply)}
                    className="flex gap-2 mt-2"
                  >
                    <Controller
                      name="content"
                      control={replyControl}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="flex-1 border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary focus:outline-none bg-background"
                          placeholder="Escreva sua resposta..."
                        />
                      )}
                    />
                    <Button size="sm" type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {comment.replies.length > 0 && (
              <div className="ml-12 space-y-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <Link href={`/profile/${reply.user.id}`}>
                      <Avatar className="h-8 w-8 cursor-pointer border border-border/50 bg-muted">
                        {reply.user.image && (
                          <AvatarImage src={reply.user.image} className="object-cover" />
                        )}
                        <AvatarFallback className="bg-secondary/20 text-secondary-foreground font-bold text-xs">
                          {reply.user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 bg-muted/50 rounded-lg p-2 border border-border/10">
                      <span className="font-medium text-sm">
                        {reply.user.name}
                      </span>
                      <p className="text-sm mt-0.5">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

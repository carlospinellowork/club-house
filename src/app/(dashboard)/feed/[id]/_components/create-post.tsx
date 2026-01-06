"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { createPostSchema, CreatePostSchema } from "@/schemas/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Paperclip, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

interface CreatePostProps {
  user:
    | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null;
      }
    | undefined;
}

export function CreatePost({ user }: CreatePostProps) {
  const utils = trpc.useUtils();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, reset, setValue, watch } = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      image: undefined,
    },
  });

  const content = watch("content");
  const image = watch("image");

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setValue("image", base64);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    noClick: true, // We'll handle clicking via a button
  });

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      reset();
      setPreview(null);
      utils.post.getAll.invalidate();
      toast.success("Post criado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar post");
    },
  });

  const removeImage = () => {
    setValue("image", undefined);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: CreatePostSchema) => {
    if (!data.content.trim() && !data.image) {
      toast.error("O post não pode estar vazio");
      return;
    }
    createPost.mutate(data);
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 border-border/50 shadow-sm hover:shadow-md",
      isDragActive && "ring-2 ring-primary ring-offset-2"
    )}>
      <CardContent className="p-4" {...getRootProps()}>
        <input {...getInputProps()} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 shrink-0 ring-1 ring-border">
              <AvatarImage
                className="object-cover"
                src={user?.image || "/diverse-user-avatars.png"}
              />
              <AvatarFallback>
                {user?.name?.slice(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 flex flex-col min-w-0">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TextareaAutosize
                    {...field}
                    placeholder="O que está acontecendo no ClubHouse?"
                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-lg placeholder:text-muted-foreground/60 p-0 pt-1 min-h-[60px]"
                    maxRows={15}
                  />
                )}
              />

              {preview && (
                <div className="relative mt-3 group">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-muted">
                    <Image
                      src={preview}
                      fill
                      alt="Preview"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <div className="flex items-center gap-1">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onDrop([file]);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 px-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors",
                  preview && "text-primary bg-primary/5"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Foto</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors hidden sm:flex"
              >
                <Paperclip className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Arquivo</span>
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className={cn(
                "text-xs font-medium transition-colors",
                content.length > 250 ? "text-orange-500" : "text-muted-foreground/50",
                content.length > 280 && "text-destructive"
              )}>
                {content.length > 0 && `${content.length} / 280`}
              </span>
              <Button
                type="submit"
                disabled={createPost.isPending || (!content.trim() && !image)}
                className="rounded-full px-6 font-semibold shadow-sm transition-all active:scale-95"
              >
                {createPost.isPending ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Enviando
                  </>
                ) : (
                  <>
                    Postar
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

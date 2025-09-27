"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { createPostSchema, CreatePostSchema } from "@/schemas/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Send, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { control, handleSubmit, reset, setValue } = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      image: undefined,
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setValue("image", base64);
      };
      reader.readAsDataURL(file);
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === "file-too-large") {
        toast.error("A imagem deve ter no máximo 5MB");
      } else {
        toast.error("Formato de arquivo não suportado");
      }
    },
  });

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      reset();
      setPreview(null);
      utils.post.getAll.invalidate();
      toast.success("Post criado com sucesso");
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Você precisa estar logado para postar");
      } else {
        toast.error(error.message || "Erro ao criar post");
      }
    },
  });

  const removeImage = () => {
    setValue("image", undefined);
    setPreview(null);
  };

  const onSubmit = (data: CreatePostSchema) => {
    createPost.mutate(data);
  };

  return (
    <Card className="premium-card glass-effect border-0 premium-shadow animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle>Compartilhar novidade</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary/10">
              <AvatarImage
                className="h-12 w-12 object-cover"
                src={user?.image || "/diverse-user-avatars.png"}
              />
              <AvatarFallback>
                {user?.name?.slice(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <Controller
                name="content"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Textarea
                      placeholder="O que está acontecendo no clube?"
                      {...field}
                      className="min-h-[120px] resize-none border-0 bg-muted/30 p-4 text-base leading-relaxed focus:ring-2 focus:ring-primary/20 rounded-xl"
                    />

                    {error && (
                      <p className="text-destructive">{error.message}</p>
                    )}
                  </>
                )}
              />

              {preview ? (
                <div className="relative">
                  <Image
                    src={preview}
                    width={600}
                    height={600}
                    alt="Preview"
                    className="object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <input {...getInputProps()} />
                  <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Arraste uma imagem ou clique para selecionar
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF até 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      const reader = new FileReader();
                      reader.onload = () => setPreview(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Adicionar imagem
              </Button>
            </div>

            <Button
              type="submit"
              disabled={createPost.isPending}
              className="flex items-center gap-2"
            >
              {createPost.isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Postar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { updateProfileAction } from "@/server/actions";
import { TMemberProfile } from "@/types/members";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editProfileSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  location: z.string().optional(),
  bio: z
    .string()
    .max(300, "A biografia pode ter no máximo 300 caracteres")
    .optional(),
  image: z.instanceof(File).optional(),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TMemberProfile;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  member,
}: EditProfileDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const { control, setValue, handleSubmit } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: member.name,
      location: member.location || "",
      bio: member.bio || "",
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      setValue("image", file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
  });

  const onSubmit = (data: EditProfileForm) => {
    startTransition(async () => {
      try {
        await updateProfileAction({
          id: member.id,
          name: data.name,
          location: data.location,
          bio: data.bio,
          image: preview || member.avatar || undefined,
        });
        utils.member.getById.invalidate({ id: member.id });
        toast.success("Perfil atualizado com sucesso");
        onOpenChange(false);
      } catch (error: any) {
        toast.error(error.message || "Erro ao atualizar perfil");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center space-y-3">
            <div {...getRootProps()} className="relative cursor-pointer">
              <input {...getInputProps()} />
              <Avatar className="h-20 w-20 border-2 border-primary/20 bg-muted">
                {(preview || member.avatar) && (
                  <AvatarImage
                    src={preview || member.avatar || undefined}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {member.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Clique ou arraste uma imagem para alterar o avatar
            </p>
          </div>

          <div className="space-y-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-1">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" {...field} placeholder="Seu nome completo" />
                  {error && (
                    <p className="text-xs text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="location"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-1">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    {...field}
                    placeholder="Cidade, Estado"
                  />
                  {error && (
                    <p className="text-xs text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="bio"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-1">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" {...field} placeholder="Sua bio" />
                  {error && (
                    <p className="text-xs text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

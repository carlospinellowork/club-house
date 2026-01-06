import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string(),
  image: z.string().optional(),
}).refine((data) => data.content.length > 0 || !!data.image, {
  message: "O post deve ter pelo menos um texto ou uma imagem",
  path: ["content"],
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
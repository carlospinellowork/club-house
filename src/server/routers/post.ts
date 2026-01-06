import { prisma } from "@/lib/prisma";
import { createPostSchema } from "@/schemas/post";
import { TRPCError } from "@trpc/server";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const PostRouter = router({
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      let imageUrl: string | undefined = undefined;

      if (input.image && input.image.startsWith("data:image/")) {
        try {
          const base64Data = input.image.split(",")[1];
          const buffer = Buffer.from(base64Data, "base64");

          const matches = input.image.match(/^data:(image\/\w+);base64,/);
          if (!matches || matches.length < 2) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Formato de imagem inválido",
            });
          }

          const mimeType = matches[1];
          const extension = mimeType.split("/")[1];

          if (buffer.length > 5 * 1024 * 1024) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Imagem deve ter no máximo 5MB",
            });
          }

          const timestamp = Date.now();
          const filename = `post-${timestamp}.${extension}`;
          const uploadDir = join(process.cwd(), "public", "uploads", "posts");
          const filePath = join(uploadDir, filename);

          await mkdir(uploadDir, { recursive: true });

          await writeFile(filePath, buffer);

          imageUrl = `/uploads/posts/${filename}`;
        } catch (error) {
          console.error("Error processing image:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao processar imagem",
          });
        }
      }

      return prisma.post.create({
        data: {
          content: input.content,
          image: imageUrl,
          userId: ctx.user.id,
        },
        include: {
          user: true,
          comments: true,
        },
      });
    }),

  getAll: publicProcedure.query(async () => {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        comments: true,
        likes: true,
      },
    });
    return posts;
  }),

  getById: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await prisma.post.findUnique({
        where: { id: Number(input.postId) },
        include: {
          user: true,
          likes: true,
          comments: true,
        },
      });

      if (!post) throw new Error("Post não encontrado");

      const isLiked = post.likes.some((like) => like.userId === ctx.user.id);

      const isFollowing = await prisma.follow.findFirst({
        where: {
          followerId: ctx.user.id,
          followingId: post.userId,
        },
      });

      return {
        id: post.id,
        content: post.content,
        image: post.image,
        createdAt: post.createdAt,
        user: {
          id: post.user.id,
          name: post.user.name,
          image: post.user.image,
          email: post.user.email,
        },
        likes: post.likes.length,
        comments: post.comments.length,
        isLiked,
        isFollowing: !!isFollowing,
      };
    }),
});

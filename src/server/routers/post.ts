import { prisma } from "@/lib/prisma";
import { createPostSchema } from "@/schemas/post";
import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const PostRouter = router({
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      let imageUrl: string | undefined = undefined;

      if (input.image && input.image.startsWith("data:image/")) {
        imageUrl = input.image;
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

  getAll: publicProcedure.query(async ({ ctx }) => {
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

    const userFollows = ctx.user
      ? await prisma.follow.findMany({
          where: { followerId: ctx.user.id },
          select: { followingId: true },
        })
      : [];
    const followingIds = new Set(userFollows.map((f) => f.followingId));

    return posts.map((post) => {
      const isLiked = ctx.user ? post.likes.some((like) => like.userId === ctx.user?.id) : false;
      const isFollowing = followingIds.has(post.userId);

      return {
        ...post,
        likes: post.likes.length,
        comments: post.comments.length,
        isLiked,
        isFollowing,
      };
    });
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

      const isNotificationRead = await prisma.notification.findFirst({
        where: {
          postId: post.id,
          userId: ctx.user.id,
          read: true,
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
          bio: post.user.bio,
        },
        likes: post.likes.length,
        comments: post.comments.length,
        isLiked,
        isFollowing: !!isFollowing,
        isNotificationRead: !!isNotificationRead,
      };
    }),
});

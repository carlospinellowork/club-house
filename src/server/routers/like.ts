import z from "zod";
import { protectedProcedure, router } from "../trpc";

export const LikeRouter = router({
  toggleLike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const postIdNum = Number(input.postId);

      const post = await ctx.prisma.post.findUnique({
        where: { id: postIdNum },
      });

      if (!post) throw new Error("Post não encontrado");

      const existingLike = await ctx.prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: ctx.user.id,
            postId: postIdNum,
          },
        },
      });

      if (existingLike) {
        await ctx.prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
        
        await ctx.prisma.notification.deleteMany({
          where: {
            userId: post.userId,
            actorId: ctx.user.id,
            postId: postIdNum,
            type: "LIKE_POST",
          },
        });

        return { liked: false };
      } else {
        await ctx.prisma.like.create({
          data: {
            userId: ctx.user.id,
            postId: postIdNum,
          },
        });

        if (post.userId !== ctx.user.id) {
       
          await ctx.prisma.notification.deleteMany({
            where: {
              userId: post.userId,
              actorId: ctx.user.id,
              postId: postIdNum,
              type: "LIKE_POST",
            }
          });

          await ctx.prisma.notification.create({
            data: {
              userId: post.userId,
              actorId: ctx.user.id,
              postId: postIdNum,
              type: "LIKE_POST",
            },
          });
        }

        return { liked: true };
      }
    }),

  getLikesCount: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input, ctx }) => {
      const count = await ctx.prisma.like.count({
        where: {
          postId: Number(input.postId),
        },
      });
      return { count };
    }),
});

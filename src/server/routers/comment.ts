import z from "zod";
import { protectedProcedure, router } from "../trpc";

export const CommentRouter = router({
  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const postIdNum = Number(input.postId);
      const parentIdNum = input.parentId ? Number(input.parentId) : null;

      const post = await ctx.prisma.post.findUnique({
        where: { id: postIdNum },
      });

      if (!post) throw new Error("Post não encontrado");

      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          userId: ctx.user.id,
          postId: postIdNum,
          parentId: parentIdNum,
        },
      });

      if (post.userId !== ctx.user.id && !parentIdNum) {
        await ctx.prisma.notification.create({
          data: {
            userId: post.userId,
            actorId: ctx.user.id,
            postId: postIdNum,
            commentId: comment.id,
            type: "COMMENT_POST",
          },
        });
      }

      if (parentIdNum) {
        const parentComment = await ctx.prisma.comment.findUnique({
          where: { id: parentIdNum },
        });

        if (parentComment && parentComment.userId !== ctx.user.id) {
          await ctx.prisma.notification.create({
            data: {
              userId: parentComment.userId,
              actorId: ctx.user.id,
              postId: postIdNum,
              commentId: comment.id,
              type: "COMMENT_POST",
            },
          });
        }
      }

      return comment;
    }),

  getCommentByPost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.comment.findMany({
        where: {
          postId: Number(input.postId),
          parentId: null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replies: {
            include: {
              user: true,
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});
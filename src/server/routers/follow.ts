import z from "zod";
import { protectedProcedure, router } from "../trpc";

export const FollowRouter = router({
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const existingFollow = await ctx.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: ctx.user.id,
            followingId: input.userId,
          },
        },
      });

      if (existingFollow) {
        await ctx.prisma.follow.delete({
          where: {
            id: existingFollow.id,
          },
        });

        await ctx.prisma.notification.deleteMany({
          where: {
            userId: input.userId,
            actorId: ctx.user.id,
            type: "FOLLOW_USER",
          },
        });

        return {
          following: false,
        };
      } else {
        await ctx.prisma.follow.create({
          data: {
            followerId: ctx.user.id,
            followingId: input.userId,
          },
        });

        if (input.userId !== ctx.user.id) {
          await ctx.prisma.notification.create({
            data: {
              userId: input.userId,
              actorId: ctx.user.id,
              type: "FOLLOW_USER",
            },
          });
        }

        return {
          following: true,
        };
      }
    }),
});

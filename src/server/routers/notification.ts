import z from "zod";
import { protectedProcedure, router } from "../trpc";

export const notificationRouter = router({
  getUnread: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.notification.findMany({
      where: {
        userId: ctx.user.id,
        read: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
  }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.notification.updateMany({
      where: {
        userId: ctx.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    })
  }),

  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.notification.update({
        where: {
          id: input.notificationId,
        },
        data: {
          read: true,
        },
      })
    })
})
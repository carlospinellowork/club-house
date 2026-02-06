"server only";

import z from "zod";

import { protectedProcedure, publicProcedure, router } from "@/server/trpc";

export const MemberProfileRouter = router({
  searchGlobal: publicProcedure
    .input(z.object({ query: z.string().min(2) }))
    .query(async ({ input, ctx }) => {
      const { query } = input;

      const users = await ctx.prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
        take: 10,
      });

      return users;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const member = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          posts: {
            include: {
              likes: true,
            }
          },
          comments: true,
          followers: true,
          following: true,
        },
      });

      if (!member) {
        return null;
      }

      const isOwnProfile = ctx.user.id === input.id;
      
      const totalLikesReceived = member.posts.reduce((acc, post) => acc + post.likes.length, 0);

      const response = {
        id: member.id,
        name: member.name,
        avatar: member.image,
        joinDate: member.createdAt.toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        bio: member.bio,
        location: member.location,
        role: member.role,
        hasOnboarded: member.hasOnboarded,
        favoriteTeamId: member.favoriteTeamId,
        favoriteTeamName: member.favoriteTeamName,
        outlet: member.outlet,
        isVerified: member.isVerified,
        stats: {
          posts: member.posts.length,
          comments: member.comments.length,
          likes: totalLikesReceived,
          following: member.following.length,
          followers: member.followers.length,
        },
        badges: member.posts.length > 10 ? ["Frequente", "Influenciador"] : ["Novato"],
        isOwnProfile,
      };

      return response;
    }),

  getActivityData: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }: { input: { id: string }, ctx: any }) => {
      const segments = 6;
      const data = [];
      
      for (let i = segments - 1; i >= 0; i--) {
        const startOfMonth = new Date();
        startOfMonth.setMonth(startOfMonth.getMonth() - i);
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const postCount = await ctx.prisma.post.count({
          where: {
            userId: input.id,
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        const monthName = startOfMonth.toLocaleDateString("pt-BR", { month: "short" });
        data.push({
          name: monthName,
          posts: postCount,
        });
      }

      return data;
    }),

  completeOnboarding: protectedProcedure
    .input(z.object({
      role: z.enum(["FAN", "JOURNALIST"]),
      favoriteTeamId: z.number().optional(),
      favoriteTeamName: z.string().optional(),
      outlet: z.string().optional(),
      bio: z.string().optional(),
      location: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { role, favoriteTeamId, favoriteTeamName, outlet, bio, location } = input;
      
      return await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          role,
          favoriteTeamId,
          favoriteTeamName,
          outlet,
          bio,
          location,
          hasOnboarded: true,
        }
      });
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2),
        location: z.string().optional(),
        bio: z.string().max(300).optional(),
        image: z.string().optional(),
        role: z.enum(["FAN", "JOURNALIST"]).optional(),
        favoriteTeamId: z.number().optional(),
        favoriteTeamName: z.string().optional(),
        outlet: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, name, location, bio, image, role, favoriteTeamId, favoriteTeamName, outlet } = input;

      if (ctx.user.id !== id) {
        throw new Error("Usuário nao autorizado");
      }

      const data = await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          location,
          bio,
          image,
          role,
          favoriteTeamId,
          favoriteTeamName,
          outlet,
        },
      });

      return data;
    }),

  getAllPostsByMember: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          userId: input.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          comments: true,
          likes: true,
        },
      });

      return posts.map((post) => ({
        ...post,
        likes: post.likes.length,
        comments: post.comments.length,
        isLiked: post.likes.some((like) => like.userId === ctx.user.id),
      }));
    }),
});

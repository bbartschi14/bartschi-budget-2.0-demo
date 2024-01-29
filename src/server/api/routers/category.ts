import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { categories } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const contentValidator = {
  name: z.string().min(1),
  color: z.string().min(1),
  icon: z.string().min(1).or(z.null()),
  description: z.string().min(1),
  type: z.enum(["income", "expense"]),
};

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object(contentValidator))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(categories).values({
        ...input,
      });
    }),

  get: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.categories.findMany();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        ...contentValidator,
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(categories)
        .set({ ...input })
        .where(eq(categories.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(categories).where(eq(categories.id, input.id));
    }),
});

// hello: publicProcedure
// .input(z.object({ text: z.string() }))
// .query(({ input }) => {
//   return {
//     greeting: `Hello ${input.text}`,
//   };
// }),

// create: protectedProcedure
// .input(z.object({ name: z.string().min(1) }))
// .mutation(async ({ ctx, input }) => {
//   // simulate a slow db call
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   await ctx.db.insert(posts).values({
//     name: input.name,
//     createdById: ctx.session.user.id,
//   });
// }),

// getLatest: publicProcedure.query(({ ctx }) => {
// return ctx.db.query.posts.findFirst({
//   orderBy: (posts, { desc }) => [desc(posts.createdAt)],
// });
// }),

// getSecretMessage: protectedProcedure.query(() => {
// return "you can now see this secret message!";
// }),

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { budgetTags } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const contentValidator = {
  name: z.string(),
  budgetId: z.number(),
};

export const budgetTagRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        ...contentValidator,
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(budgetTags).values({
        ...input,
      });
    }),

  getForBudget: protectedProcedure
    .input(z.object({ budgetId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(budgetTags)
        .where(eq(budgetTags.budgetId, input.budgetId));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(budgetTags).where(eq(budgetTags.id, input.id));
    }),
});

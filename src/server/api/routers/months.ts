import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { months } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const monthRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({ year: z.number().min(0), month: z.number().min(0).max(11) })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(months).values({
        year: input.year,
        month: input.month,
      });
    }),

  get: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.months.findMany();
  }),

  getSingle: protectedProcedure
    .input(z.object({ year: z.number(), month: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(months)
        .where(and(eq(months.year, input.year), eq(months.month, input.month)));
    }),
});

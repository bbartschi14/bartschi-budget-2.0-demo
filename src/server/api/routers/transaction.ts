import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { categories, transactions } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const contentValidator = {
  name: z.string().min(1),
  amount: z.number(),
  createdById: z.string(),
  categoryId: z.number(),
  day: z.number(),
  month: z.number(),
  year: z.number(),
};

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object(contentValidator))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(transactions).values({
        name: input.name,
        amount: input.amount,
        createdById: input.createdById,
        categoryId: input.categoryId,
        date: dayjs
          .utc()
          .year(input.year)
          .month(input.month)
          .date(input.day)
          .toDate(),
      });
    }),

  createMultiple: protectedProcedure
    .input(
      z.array(
        z.object({
          ...contentValidator,
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(transactions).values(
        input.map((transaction) => ({
          name: transaction.name,
          amount: transaction.amount,
          createdById: transaction.createdById,
          categoryId: transaction.categoryId,
          date: dayjs
            .utc()
            .year(transaction.year)
            .month(transaction.month)
            .date(transaction.day)
            .toDate(),
        }))
      );
    }),

  get: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.transactions.findMany();
  }),

  getMonth: protectedProcedure
    .input(z.object({ year: z.number(), month: z.number() }))
    .query(({ ctx, input }) => {
      const { year, month } = input;
      return ctx.db
        .select()
        .from(transactions)
        .where(sql`YEAR(date) = ${year} AND MONTH(date) = ${month + 1}`) // MySQL's MONTH function is 1-indexed
        .leftJoin(categories, eq(transactions.categoryId, categories.id));
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
        .update(transactions)
        .set({
          name: input.name,
          amount: input.amount,
          categoryId: input.categoryId,
          date: dayjs
            .utc()
            .year(input.year)
            .month(input.month)
            .date(input.day)
            .toDate(),
        })
        .where(eq(transactions.id, input.id));
    }),

  duplicate: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const transactionsFound = await ctx.db
        .select()
        .from(transactions)
        .where(eq(transactions.id, input.id));

      const transaction = transactionsFound[0];

      if (!transaction) {
        console.error("Transaction not found");
        return;
      }

      await ctx.db.insert(transactions).values({
        name: transaction.name,
        amount: transaction.amount,
        createdById: transaction.createdById,
        categoryId: transaction.categoryId,
        date: transaction.date,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(transactions).where(eq(transactions.id, input.id));
    }),
});

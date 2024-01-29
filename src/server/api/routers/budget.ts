import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  budgetTags,
  budgets,
  categories,
  transactions,
} from "@/server/db/schema";
import { and, eq, inArray, sql, sum } from "drizzle-orm";
import { BudgetRecord, Category, OverviewRecord } from "@/server/db/shared";
import { uniq } from "lodash";

const contentValidator = {
  amount: z.number(),
  categoryId: z.number(),
  year: z.number().min(0),
  month: z.number().min(0).max(11),
};

export const budgetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        ...contentValidator,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const insert = await ctx.db.insert(budgets).values({
        ...input,
      });
      // Create a default "monthly" budget tag
      await ctx.db.insert(budgetTags).values({
        budgetId: Number(insert.insertId),
        name: "monthly",
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.budgets.findMany();
  }),

  getMonth: protectedProcedure
    .input(
      z.object({ year: contentValidator.year, month: contentValidator.month })
    )
    .query(async ({ ctx, input }) => {
      const rows = ctx.db
        .select()
        .from(budgets)
        .where(
          and(eq(budgets.year, input.year), eq(budgets.month, input.month))
        )
        .leftJoin(categories, eq(budgets.categoryId, categories.id))
        .leftJoin(budgetTags, eq(budgets.id, budgetTags.budgetId));

      // Aggregate the budget tags into an array
      const result = await rows.then((rows) => {
        return rows.reduce<Record<number, BudgetRecord>>((acc, row) => {
          const category = row.categories;
          const budgetTag = row.budgetTags;
          const budget = row.budgets;
          if (!acc[budget.id]) {
            acc[budget.id] = {
              ...budget,
              category,
              budgetTags: [],
            };
          }
          if (budgetTag) {
            acc[budget.id]!.budgetTags.push(budgetTag);
          }
          return acc;
        }, {});
      });

      return Object.values(result);
    }),

  getOverview: protectedProcedure
    .input(
      z.object({
        year: contentValidator.year,
        month: contentValidator.month.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const budgetsSelectFilter =
        input.month !== undefined
          ? and(eq(budgets.year, input.year), eq(budgets.month, input.month))
          : eq(budgets.year, input.year);

      const overviewBudgets = await ctx.db
        .select({
          amount: sum(budgets.amount).mapWith(Number),
          categoryId: budgets.categoryId,
          category: categories,
        })
        .from(budgets)
        .where(budgetsSelectFilter)
        .groupBy(budgets.categoryId)
        .leftJoin(categories, eq(budgets.categoryId, categories.id));

      const spendingSelectFilter =
        input.month !== undefined
          ? and(
              eq(sql`YEAR(date)`, input.year),
              eq(sql`MONTH(date)`, input.month + 1) // MySQL's MONTH function is 1-indexed
            )
          : eq(sql`YEAR(date)`, input.year);

      const overviewSpending = await ctx.db
        .select({
          spent: sum(transactions.amount).mapWith(Number),
          categoryId: transactions.categoryId,
          category: categories,
        })
        .from(transactions)
        .where(spendingSelectFilter)
        .groupBy(transactions.categoryId)
        .leftJoin(categories, eq(transactions.categoryId, categories.id));

      const overviewRecords: Record<number, OverviewRecord> = {};

      for (const budget of overviewBudgets) {
        overviewRecords[budget.categoryId] = {
          ...budget,
          id: budget.categoryId,
          month: input.month ?? -1,
          year: input.year,
          spent: 0,
          remaining: budget.amount,
        };
      }

      for (const spend of overviewSpending) {
        if (spend.categoryId in overviewRecords) {
          overviewRecords[spend.categoryId]!.spent = spend.spent;
          overviewRecords[spend.categoryId]!.remaining =
            overviewRecords[spend.categoryId]!.remaining! - spend.spent;
        } else {
          overviewRecords[spend.categoryId] = {
            id: spend.categoryId,
            categoryId: spend.categoryId,
            month: input.month ?? -1,
            year: input.year,
            spent: spend.spent,
            remaining: null,
            amount: null,
            category: spend.category,
          };
        }
      }

      return Object.values(overviewRecords);
    }),

  copyFromPreviousMonth: protectedProcedure
    .input(
      z.object({
        year: contentValidator.year,
        month: contentValidator.month,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const previousMonth = input.month === 0 ? 11 : input.month - 1;
      const previousYear = input.month === 0 ? input.year - 1 : input.year;
      const previousBudgets = await ctx.db
        .select()
        .from(budgets)
        .where(
          and(eq(budgets.year, previousYear), eq(budgets.month, previousMonth))
        );
      const newBudgets = previousBudgets.map((budget) => {
        return {
          prev: budget,
          new: {
            ...budget,
            id: undefined,
            year: input.year,
            month: input.month,
          },
        };
      });

      // For each new budget, insert it into the database then copy the previous month's budget tags
      for (const budget of newBudgets) {
        const inserted = await ctx.db.insert(budgets).values(budget.new);
        const previousBudgetTags = await ctx.db
          .select()
          .from(budgetTags)
          .where(eq(budgetTags.budgetId, budget.prev.id));
        const newBudgetTags = previousBudgetTags.map((budgetTag) => {
          return {
            ...budgetTag,
            id: undefined,
            budgetId: Number(inserted.insertId),
          };
        });
        await ctx.db.insert(budgetTags).values(newBudgetTags);
      }
    }),

  applyToRestOfYear: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const found = await ctx.db
        .select()
        .from(budgets)
        .where(eq(budgets.id, input.id));
      const budget = found[0];
      if (!budget) {
        console.error("Budget not found");
        return;
      }

      const startingMonth = budget.month + 1;
      const year = budget.year;
      const endMonth = 11;

      // Copy or update the budget for each month for the same category
      for (let month = startingMonth; month <= endMonth; month++) {
        const found = await ctx.db
          .select()
          .from(budgets)
          .where(
            and(
              eq(budgets.categoryId, budget.categoryId),
              eq(budgets.month, month),
              eq(budgets.year, budget.year)
            )
          );
        if (found.length === 0) {
          await ctx.db.insert(budgets).values({
            ...budget,
            id: undefined,
            month,
            year: year,
          });
        } else if (found[0]) {
          await ctx.db
            .update(budgets)
            .set({ amount: budget.amount })
            .where(eq(budgets.id, found[0].id));
        }
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        ...contentValidator,
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(budgets).set(input).where(eq(budgets.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(budgets).where(eq(budgets.id, input.id));
    }),

  deleteMonth: protectedProcedure
    .input(
      z.object({
        year: contentValidator.year,
        month: contentValidator.month,
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(budgets)
        .where(
          and(eq(budgets.year, input.year), eq(budgets.month, input.month))
        );
    }),
});

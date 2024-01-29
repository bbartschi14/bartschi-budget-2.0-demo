import { budgetRouter } from "@/server/api/routers/budget";
import { budgetTagRouter } from "@/server/api/routers/budgetTag";
import { categoryRouter } from "@/server/api/routers/category";
import { monthRouter } from "@/server/api/routers/months";
import { transactionRouter } from "@/server/api/routers/transaction";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  budget: budgetRouter,
  month: monthRouter,
  transaction: transactionRouter,
  budgetTag: budgetTagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

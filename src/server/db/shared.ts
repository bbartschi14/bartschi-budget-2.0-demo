import { type InferSelectModel } from "drizzle-orm";
import type {
  budgetTags,
  budgets,
  categories,
  months,
  transactions,
} from "@/server/db/schema";
import { CreditCard, PiggyBank } from "@phosphor-icons/react/dist/ssr";

export type Category = InferSelectModel<typeof categories>;
export type Budget = InferSelectModel<typeof budgets>;
export type Month = InferSelectModel<typeof months>;
export type Transaction = InferSelectModel<typeof transactions>;
export type BudgetTag = InferSelectModel<typeof budgetTags>;

export type BudgetRecord = Budget & {
  category: Category | null;
  budgetTags: BudgetTag[];
};

export type OverviewRecord = Pick<
  Budget,
  "id" | "year" | "month" | "categoryId"
> & {
  category: Category | null;
  spent: number;
  remaining: number | null;
  amount: number | null;
};

export const CATEGORY_TYPES = ["income", "expense"] as const;

export const CATEGORY_TYPES_DATA = {
  expense: {
    value: "expense",
    label: "Expense",
    icon: CreditCard,
  },
  income: {
    value: "income",
    label: "Income",
    icon: PiggyBank,
  },
} as const;

export type CategoryType = (typeof CATEGORY_TYPES)[number];

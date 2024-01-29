import { BudgetRecord, OverviewRecord } from "@/server/db/shared";
import { orderBy } from "lodash";
import { DataTableSortStatus } from "mantine-datatable";

export function calcMonthlyOverviewRecords(
  spent: Record<string, number>,
  budgets: BudgetRecord[],
  sortStatus: DataTableSortStatus<OverviewRecord>
): OverviewRecord[] {
  const mappedBudgets = budgets.map((b) => {
    const budgetSpent = (b.category ? spent[b.category.id] : 0) ?? 0;
    return {
      ...b,
      spent: budgetSpent,
      remaining: b.amount - budgetSpent,
    };
  });

  if (mappedBudgets.length === 0) {
    return [];
  }

  const totalRecord = {
    id: -1,
    amount: mappedBudgets.reduce((acc, b) => acc + b.amount, 0),
    month: 0,
    year: 0,
    spent: mappedBudgets.reduce((acc, b) => acc + b.spent, 0),
    remaining: mappedBudgets.reduce((acc, b) => acc + b.remaining, 0),
    category: null,
  } as OverviewRecord;

  const sortedBudgets = orderBy(
    mappedBudgets,
    sortStatus.columnAccessor,
    sortStatus.direction
  );

  return [totalRecord, ...sortedBudgets];
}

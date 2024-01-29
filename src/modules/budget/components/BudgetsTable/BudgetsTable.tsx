"use client";

import { Button, Skeleton, Stack, Table, Text, rem } from "@mantine/core";
import classes from "./BudgetsTable.module.css";
import { api } from "@/trpc/react";
import { BudgetRow } from "@/modules/budget/components/BudgetsTable/BudgetRow";
import { Copy, SelectionSlash } from "@phosphor-icons/react/dist/ssr";
import { DeleteBudgetModal } from "@/modules/budget/components/DeleteBudgetModal/DeleteBudgetModal";
import { useState } from "react";
import { BudgetRecord } from "@/server/db/shared";
import { UpdateBudgetModal } from "@/modules/budget/components/UpdateBudgetModal/UpdateBudgetModal";
import { BudgetTotal } from "@/modules/budget/components/BudgetTotal/BudgetTotal";
import { ApplyRestOfYearModal } from "@/modules/budget/components/ApplyRestOfYearModal/ApplyRestOfYearModal";

type BudgetsTableProps = { date: Date };

export const BudgetsTable = ({ date }: BudgetsTableProps) => {
  const queryParams = {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
  const { data, isLoading } = api.budget.getMonth.useQuery(queryParams);
  const copyMutation = api.budget.copyFromPreviousMonth.useMutation();
  const utils = api.useUtils();

  const [budgetToDelete, setBudgetToDelete] = useState<BudgetRecord | null>(
    null
  );
  const [budgetToUpdate, setBudgetToUpdate] = useState<BudgetRecord | null>(
    null
  );
  const [budgetToApply, setBudgetToApply] = useState<BudgetRecord | null>(null);

  const hasBudgets = data && data.length > 0;

  const rows = hasBudgets ? (
    data.map((record) => (
      <BudgetRow
        key={record.id}
        budget={record}
        onDelete={() => setBudgetToDelete(record)}
        onApplyRestOfYear={() => setBudgetToApply(record)}
        onUpdate={(amount) => {
          setBudgetToUpdate({ ...record, amount });
        }}
      />
    ))
  ) : (
    <Table.Tr>
      <Table.Td colSpan={3}>
        <Stack justify="center" align="center" p="sm">
          <SelectionSlash size="3rem" color="gray" />
          <Text fs="italic" c="dimmed" ta="center">
            No budgets for this month
          </Text>
          <Button
            loading={copyMutation.isLoading}
            leftSection={<Copy size="1rem" />}
            onClick={() =>
              copyMutation.mutate(queryParams, {
                onSettled: () => void utils.budget.getMonth.invalidate(),
              })
            }
          >
            Copy from previous month
          </Button>
        </Stack>
      </Table.Td>
    </Table.Tr>
  );

  return (
    <>
      <Table
        highlightOnHover={hasBudgets}
        classNames={{ table: classes.table, td: classes.td }}
        layout="fixed"
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Category</Table.Th>
            <Table.Th className={classes.td2} style={{ textAlign: "center" }}>
              Amount
            </Table.Th>
            <Table.Th className={classes.td3} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Stack gap="xs">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} h={rem(36)} />
                  ))}
                </Stack>
              </Table.Td>
            </Table.Tr>
          ) : (
            rows
          )}
        </Table.Tbody>
      </Table>
      <BudgetTotal
        incomeTotal={
          data?.reduce((acc, b) => {
            if (b.category?.type === "income") {
              return acc + (b.amount ?? 0);
            }
            return acc;
          }, 0) ?? 0
        }
        expenseTotal={
          data?.reduce((acc, b) => {
            if (b.category?.type !== "income") {
              return acc + (b.amount ?? 0);
            }
            return acc;
          }, 0) ?? 0
        }
      />
      <DeleteBudgetModal
        budgetToDelete={budgetToDelete}
        onClose={() => setBudgetToDelete(null)}
      />
      <UpdateBudgetModal
        budgetToUpdate={budgetToUpdate}
        onClose={() => setBudgetToUpdate(null)}
      />
      <ApplyRestOfYearModal
        budgetToApply={budgetToApply}
        onClose={() => setBudgetToApply(null)}
      />
    </>
  );
};

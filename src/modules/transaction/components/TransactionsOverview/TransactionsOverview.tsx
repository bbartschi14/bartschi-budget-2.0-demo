import Panel from "@/components/Panel/Panel";
import classes from "./TransactionsOverview.module.css";
import {
  Box,
  Center,
  LoadingOverlay,
  SegmentedControl,
  Stack,
  Tooltip,
} from "@mantine/core";
import { useDate } from "@/stores/hooks/useDate";
import { api } from "@/trpc/react";
import { DataTableSortStatus } from "mantine-datatable";
import { useMemo, useState } from "react";
import { orderBy } from "lodash";
import { TransactionsOverviewTable } from "@/modules/transaction/components/TransactionsOverviewTable/TransactionsOverviewTable";
import { CATEGORY_TYPES_DATA, OverviewRecord } from "@/server/db/shared";
import { Calendar, Moon } from "@phosphor-icons/react/dist/ssr";
import { TransactionTotal } from "@/modules/transaction/components/TransactionTotal/TransactionTotal";

const calcTotalRecord = (records: OverviewRecord[]) => {
  return {
    id: -1,
    amount: records.reduce((acc, b) => acc + (b.amount ?? 0), 0),
    month: 0,
    year: 0,
    spent: records.reduce((acc, b) => acc + b.spent, 0),
    remaining: records.reduce((acc: number | null, b) => {
      if (b.remaining === null) {
        return acc;
      } else if (acc === null) {
        return b.remaining;
      } else {
        return acc + b.remaining;
      }
    }, null),
    category: null,
  } as OverviewRecord;
};

export const TransactionsOverview = () => {
  const { dateParams } = useDate();
  const [viewType, setViewType] = useState<"monthly" | "yearly">("monthly");

  const overviewQuery = api.budget.getOverview.useQuery(
    viewType === "monthly" ? dateParams : { year: dateParams.year }
  );

  const isLoading = overviewQuery.isLoading;

  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<OverviewRecord>
  >({
    columnAccessor: "spent",
    direction: "desc",
  });

  const overviewRecords = useMemo(() => {
    const records: { expense: OverviewRecord[]; income: OverviewRecord[] } = {
      expense: [],
      income: [],
    };

    if (!overviewQuery.data) return records;

    for (const record of overviewQuery.data) {
      if (record.category?.type === "income") {
        records.income.push(record);
      } else {
        records.expense.push(record);
      }
    }

    return {
      expense: [
        calcTotalRecord(records.expense),
        ...orderBy(
          records.expense,
          sortStatus.columnAccessor,
          sortStatus.direction
        ),
      ],
      income: [
        calcTotalRecord(records.income),
        ...orderBy(
          records.income,
          sortStatus.columnAccessor,
          sortStatus.direction
        ),
      ],
    };
  }, [overviewQuery.data, sortStatus]);

  return (
    <>
      <Box className={classes.root}>
        <Panel
          title="Overview"
          rightSection={
            <SegmentedControl
              value={viewType}
              onChange={(val) => setViewType(val as "monthly" | "yearly")}
              data={[
                {
                  value: "monthly",
                  label: (
                    <Tooltip label="Monthly">
                      <Center h={"1.5rem"}>
                        <Moon size="1rem" />
                      </Center>
                    </Tooltip>
                  ),
                },
                {
                  value: "yearly",
                  label: (
                    <Tooltip label="Yearly">
                      <Center h={"1.5rem"}>
                        <Calendar size="1rem" />
                      </Center>
                    </Tooltip>
                  ),
                },
              ]}
            />
          }
        >
          <LoadingOverlay visible={isLoading} overlayProps={{ blur: 1 }} />
          <div className={classes.flex}>
            <TransactionsOverviewTable
              title={{
                text: viewType === "monthly" ? "Expenses" : "Annual Expenses",
                icon: CATEGORY_TYPES_DATA.expense.icon,
              }}
              records={overviewRecords.expense}
              sortStatus={sortStatus}
              setSortStatus={setSortStatus}
              viewType={viewType}
            />
            <TransactionsOverviewTable
              title={{
                text: viewType === "monthly" ? "Incoming" : "Annual Incoming",
                icon: CATEGORY_TYPES_DATA.income.icon,
              }}
              spentText="Earned"
              negativeColor="blue"
              records={overviewRecords.income}
              sortStatus={sortStatus}
              setSortStatus={setSortStatus}
              viewType={viewType}
            />
          </div>
        </Panel>
      </Box>
      <TransactionTotal
        expenseTotal={overviewRecords.expense[0]?.spent ?? 0}
        incomeTotal={overviewRecords.income[0]?.spent ?? 0}
      />
    </>
  );
};

import { OverviewRecord } from "@/server/db/shared";
import classes from "./TransactionsOverviewTable.module.css";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { CategoryThemeIcon } from "@/components/CategoryThemeIcon/CategoryThemeIcon";
import { CurrencyText } from "@/components/CurrencyText/CurrencyText";
import { Box, Text, Tooltip } from "@mantine/core";
import { Sigma } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@phosphor-icons/react";

type TransactionsOverviewTableProps = {
  title: { text: string; icon: Icon };
  records: OverviewRecord[];
  sortStatus: DataTableSortStatus<OverviewRecord>;
  setSortStatus: (status: DataTableSortStatus<OverviewRecord>) => void;
  spentText?: string;
  negativeColor?: string;
  viewType?: "monthly" | "yearly";
};

export const TransactionsOverviewTable = ({
  records,
  sortStatus,
  setSortStatus,
  title,
  spentText,
  negativeColor,
  viewType,
}: TransactionsOverviewTableProps) => {
  return (
    <div data-viewtype={viewType} className={classes.root}>
      <Box className={classes.titleContainer}>
        <title.icon size="1rem" />
        <Text ta="center" fz="sm" fw="bold">
          {title.text}
        </Text>
      </Box>
      <DataTable
        minHeight={records.length > 0 ? undefined : 150}
        highlightOnHover
        withTableBorder
        withColumnBorders
        classNames={{
          root: classes.tableRoot,
          table: classes.table,
        }}
        idAccessor="id"
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        records={records}
        columns={[
          {
            accessor: "category",
            width: "0%",
            title: "",
            render: ({ category }) => {
              return category?.name ? (
                <CategoryThemeIcon category={category} />
              ) : (
                <Box display="flex">
                  <Sigma size={28} weight="bold" />
                </Box>
              );
            },
          },
          {
            accessor: "spent",
            title: spentText ?? "Spent",
            textAlign: "center",
            sortable: true,
            render: ({ spent }) => <CurrencyText fz="sm" value={spent} />,
          },
          {
            accessor: "remaining",
            textAlign: "center",
            sortable: true,
            render: ({ remaining, category }) =>
              remaining !== null ? (
                <CurrencyText
                  fz={category ? "sm" : "lg"}
                  fw="bold"
                  value={remaining}
                  c={remaining > 0 ? "green.8" : negativeColor ?? "red"}
                />
              ) : (
                <Tooltip label="No budget assigned">
                  <Text fz="xs" c="dimmed">
                    N/A
                  </Text>
                </Tooltip>
              ),
          },
        ]}
      />
    </div>
  );
};

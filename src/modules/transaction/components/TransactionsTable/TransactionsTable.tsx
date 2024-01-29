"use client";

import dayjs from "dayjs";
import "./TransactionsTable.css";
import classes from "./TransactionsTable.module.css";
import {
  DataTable,
  type DataTableSortStatus,
  useDataTableColumns,
} from "mantine-datatable";
import { api } from "@/trpc/react";
import { useDate } from "@/stores/hooks/useDate";
import { useEffect, useMemo, useState } from "react";
import { CurrencyText } from "@/components/CurrencyText/CurrencyText";
import { useQueryState } from "@/hooks/useQueryState";
import {
  ActionIcon,
  Box,
  LoadingOverlay,
  Menu,
  useMantineTheme,
} from "@mantine/core";
import { Category, Transaction } from "@/server/db/shared";
import { orderBy } from "lodash";
import { CategoryBadge } from "@/components/CategoryBadge/CategoryBadge";
import { TransactionsTableDate } from "@/modules/transaction/components/TransactionsTableDate/TransactionsTableDate";
import { useMediaQuery } from "@mantine/hooks";
import {
  Copy,
  DotsThree,
  NotePencil,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { DeleteTransactionModal } from "@/modules/transaction/components/DeleteTransactionModal/DeleteTransactionModal";
import { EditTransactionModal } from "@/modules/transaction/components/EditTransactionModal/EditTransactionModal";

export type TransactionRecord = Transaction & {
  category: Category | null;
};

export const TransactionsTable = () => {
  const key = "transactions-table-3";
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { dateParams } = useDate();
  const transactionsQuery = api.transaction.getMonth.useQuery(dateParams);
  const utils = api.useUtils();
  const duplicateMutation = api.transaction.duplicate.useMutation({
    onSettled: () => {
      void utils.transaction.getMonth.invalidate();
      void utils.budget.getOverview.invalidate();
    },
  });

  const queryState = useQueryState(transactionsQuery);

  const [transactionToDelete, setTransactionToDelete] =
    useState<TransactionRecord | null>(null);
  const [transactionToUpdate, setTransactionToUpdate] =
    useState<TransactionRecord | null>(null);

  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<TransactionRecord>
  >({
    columnAccessor: "date",
    direction: "desc",
  });

  const records: TransactionRecord[] = useMemo(() => {
    const sortAccessor =
      sortStatus.columnAccessor === "category"
        ? "category.name"
        : sortStatus.columnAccessor;
    const transactons = transactionsQuery.data ?? [];
    const mappedTransactions = transactons.map((t) => ({
      ...t.transactions,
      category: t.categories,
    }));
    const sortedTransctions = orderBy(
      mappedTransactions,
      sortAccessor,
      sortStatus.direction
    );
    return sortedTransctions;
  }, [transactionsQuery.data, sortStatus]);

  const { effectiveColumns, setColumnWidth } =
    useDataTableColumns<TransactionRecord>({
      key,
      columns: [
        {
          accessor: "name",
          sortable: true,
          width: "100%",
        },
        {
          accessor: "amount",
          width: 120,
          sortable: true,
          render: ({ amount }) => <CurrencyText fz="sm" value={amount} />,
        },
        {
          accessor: "category",
          width: 200,
          sortable: true,
          render: ({ category }) =>
            category?.name ? (
              <CategoryBadge category={category} />
            ) : (
              "No category"
            ),
        },
        {
          accessor: "date",
          width: 180,
          sortable: true,
          render: ({ date }) => <TransactionsTableDate date={date} />,
        },
        {
          accessor: "actions",
          title: "",
          width: 34,
          cellsClassName: classes.actionsCell,
          render: (record) => (
            <Menu
              shadow="sm"
              offset={4}
              withArrow
              arrowPosition="center"
              position="left-start"
            >
              <Menu.Target>
                <ActionIcon variant="subtle" size="lg" color="gray">
                  <DotsThree weight="bold" size="1.25rem" />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<NotePencil size="1.25rem" weight="duotone" />}
                  onClick={() => setTransactionToUpdate(record)}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  leftSection={<Copy size="1.25rem" weight="duotone" />}
                  onClick={() => duplicateMutation.mutate({ id: record.id })}
                >
                  Duplicate
                </Menu.Item>
                <Menu.Item
                  leftSection={<Trash size="1.25rem" weight="duotone" />}
                  onClick={() => setTransactionToDelete(record)}
                  color="red"
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ),
        },
      ],
    });

  useEffect(() => {
    setColumnWidth("date", isMobile ? 80 : 180);
  }, [isMobile]);

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={queryState === "Loading"}
          overlayProps={{ blur: 1 }}
        />
        <DataTable
          minHeight={queryState === "Not Empty" ? undefined : 150}
          highlightOnHover
          withTableBorder
          withColumnBorders
          records={records}
          idAccessor="id"
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          columns={effectiveColumns}
          storeColumnsKey={key}
        />
      </Box>
      <DeleteTransactionModal
        transactionToDelete={transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
      />
      <EditTransactionModal
        transactionToEdit={transactionToUpdate}
        onClose={() => setTransactionToUpdate(null)}
      />
    </>
  );
};

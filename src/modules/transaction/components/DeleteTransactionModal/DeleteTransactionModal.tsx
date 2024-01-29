"use client";

import { TransactionRecord } from "@/modules/transaction/components/TransactionsTable/TransactionsTable";
import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";
import { api } from "@/trpc/react";
import { Text } from "@mantine/core";
import { CurrencyText } from "@/components/CurrencyText/CurrencyText";

type DeleteTransactionModalProps = {
  transactionToDelete: TransactionRecord | null;
  onClose: () => void;
};

export const DeleteTransactionModal = ({
  transactionToDelete,
  onClose,
}: DeleteTransactionModalProps) => {
  const utils = api.useUtils();
  const deleteMutation = api.transaction.delete.useMutation();

  return (
    <ConfirmModal
      title="Delete Transaction"
      opened={transactionToDelete !== null}
      onClose={onClose}
      isLoading={deleteMutation.isLoading}
      onConfirm={() => {
        if (transactionToDelete) {
          deleteMutation.mutate(
            { id: transactionToDelete.id },
            {
              onSuccess: onClose,
              onSettled: () => {
                void utils.transaction.getMonth.invalidate();
                void utils.budget.getOverview.invalidate();
              },
            }
          );
        }
      }}
      labels={{ confirm: "Delete", cancel: "No don't delete it" }}
      confirmProps={{ color: "red" }}
      closeOnConfirm={false}
    >
      <Text size="sm">
        Are you sure you want to delete this transaction?{" "}
        {transactionToDelete && (
          <Text fw="bold">
            {`${transactionToDelete?.name}`}
            {" ("}
            <CurrencyText
              fw="bold"
              value={transactionToDelete?.amount ?? 0}
              span
            />
            {")"}
          </Text>
        )}
      </Text>
    </ConfirmModal>
  );
};

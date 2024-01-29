"use client";
import { TransactionRecord } from "@/modules/transaction/components/TransactionsTable/TransactionsTable";
import classes from "./EditTransactionModal.module.css";
import { api } from "@/trpc/react";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { Button, Modal } from "@mantine/core";
import { TransactionInput } from "@/modules/transaction/components/TransactionInput/TransactionInput";
import { useEffect } from "react";
import { utcToZonedTime } from "date-fns-tz";

type EditTransactionModalProps = {
  transactionToEdit: TransactionRecord | null;
  onClose: () => void;
};

export const EditTransactionModal = ({
  transactionToEdit,
  onClose,
}: EditTransactionModalProps) => {
  const utils = api.useUtils();

  const { mutate, isLoading } = api.transaction.update.useMutation({
    onSettled: async () => {
      void utils.transaction.getMonth.invalidate();
      void utils.budget.getOverview.invalidate();
      onClose();
    },
  });

  const form = useTransactionForm();

  useEffect(() => {
    if (transactionToEdit) {
      form.setFieldValue("name", transactionToEdit.name);
      form.setFieldValue("amount", transactionToEdit.amount);
      form.setFieldValue("categoryId", transactionToEdit.categoryId.toString());
      form.setFieldValue("date", utcToZonedTime(transactionToEdit.date, "UTC"));
      form.setFieldValue("createdById", transactionToEdit.createdById);
    }
  }, [transactionToEdit]);

  return (
    <Modal
      title="Edit Transaction"
      opened={transactionToEdit !== null}
      onClose={onClose}
      centered
    >
      <TransactionInput
        className={classes.form}
        form={form}
        onSubmit={() => {
          if (!transactionToEdit?.createdById) {
            console.error("No user id");
            return;
          } else {
            mutate({
              id: transactionToEdit.id,
              name: form.values.name,
              year: form.values.date.getFullYear(),
              month: form.values.date.getMonth(),
              day: form.values.date.getDate(),
              categoryId: Number(form.values.categoryId),
              amount: form.values.amount,
              createdById: transactionToEdit.createdById,
            });
          }
        }}
        buttonSlot={
          <Button type="submit" disabled={!form.isValid()} loading={isLoading}>
            Update
          </Button>
        }
      />
    </Modal>
  );
};

"use client";

import { UseFormReturnType } from "@mantine/form";
import classes from "./NewTransactionInput.module.css";
import { api } from "@/trpc/react";
import { ActionIcon, Button, rem } from "@mantine/core";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useDate } from "@/stores/hooks/useDate";
import { RefObject, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import CollapsiblePanel from "@/components/CollapsiblePanel/CollapsiblePanel";
import { useNewEntryOpen } from "@/stores/hooks/useNewEntryOpen";
import {
  TransactionInput,
  TransactionValue,
} from "@/modules/transaction/components/TransactionInput/TransactionInput";

dayjs.extend(utc);

type NewTransactionInputProps = {
  form: UseFormReturnType<TransactionValue>;
};

export const NewTransactionInput = ({ form }: NewTransactionInputProps) => {
  const { date, dateParams } = useDate();
  const { newEntryOpen, setNewEntryOpen } = useNewEntryOpen();

  const currentMonthMinMax = useMemo(() => {
    return {
      minDate: dayjs(date).startOf("month").toDate(),
      maxDate: dayjs(date).endOf("month").toDate(),
    };
  }, [date]);

  const utils = api.useUtils();

  const { mutate, isLoading } = api.transaction.create.useMutation({
    onSettled: async () => {
      void utils.transaction.getMonth.invalidate(dateParams);
      void utils.budget.getOverview.invalidate();
    },
  });

  const onSubmit = (
    form: UseFormReturnType<TransactionValue>,
    nameRef: RefObject<HTMLInputElement>
  ) => {
    if (!form.values.createdById) {
      console.error("No user id");
      return;
    }
    mutate(
      {
        name: form.values.name,
        year: form.values.date.getFullYear(),
        month: form.values.date.getMonth(),
        day: form.values.date.getDate(),
        categoryId: Number(form.values.categoryId),
        amount: form.values.amount,
        createdById: form.values.createdById,
      },
      {
        onSuccess: () => {
          nameRef.current?.select();
        },
      }
    );
  };

  return (
    <CollapsiblePanel
      title="Add Entry"
      open={newEntryOpen}
      setOpen={setNewEntryOpen}
    >
      <TransactionInput
        className={classes.root}
        form={form}
        onSubmit={onSubmit}
        monthMinMax={currentMonthMinMax}
        buttonSlot={
          <>
            <ActionIcon
              size={rem(36)}
              mt={rem(24)}
              type="submit"
              visibleFrom="xs"
              disabled={!form.isValid()}
              loading={isLoading}
            >
              <Plus size="1.25rem" weight="bold" />
            </ActionIcon>
            <Button
              type="submit"
              disabled={!form.isValid()}
              hiddenFrom="xs"
              leftSection={<Plus size="1.25rem" weight="bold" />}
              loading={isLoading}
            >
              Add Entry
            </Button>
          </>
        }
      />
    </CollapsiblePanel>
  );
};

"use client";

import {
  ActionIcon,
  Box,
  Button,
  Loader,
  NumberInput,
  Select,
  rem,
} from "@mantine/core";
import classes from "./NewBudgetInput.module.css";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { type UseFormReturnType } from "@mantine/form";
import { api } from "@/trpc/react";
import CollapsiblePanel from "@/components/CollapsiblePanel/CollapsiblePanel";
import { CategoryInput } from "@/modules/category/components/CategoryInput/CategoryInput";

export type NewBudgetValue = {
  categoryId: string | null;
  amount: number;
};

type NewBudgetInputProps = {
  form: UseFormReturnType<NewBudgetValue>;
  date: Date;
};

export const NewBudgetInput = ({ form, date }: NewBudgetInputProps) => {
  const dateParams = {
    year: date.getFullYear(),
    month: date.getMonth(),
  };

  const { data: allCategories, isLoading: allCategoriesLoading } =
    api.category.get.useQuery();

  const { data: monthBudgets, isLoading: monthBudgetsLoading } =
    api.budget.getMonth.useQuery(dateParams);

  const utils = api.useUtils();

  const { mutate, isLoading } = api.budget.create.useMutation({
    onSuccess: () => {
      form.reset();
    },
    onSettled: async () => {
      await utils.budget.getMonth.invalidate(dateParams);
    },
  });

  const queryLoading = allCategoriesLoading || monthBudgetsLoading;

  const categoriesInMonth = monthBudgets?.map((b) => b.category?.id) ?? [];
  const availableCategories =
    allCategories?.filter((c) => !categoriesInMonth.includes(c.id)) ?? [];

  return (
    <CollapsiblePanel title="Add Entry">
      <form
        className={classes.root}
        onSubmit={form.onSubmit((values) => {
          if (!values.categoryId) return;

          mutate({
            categoryId: Number(values.categoryId),
            amount: values.amount,
            ...dateParams,
          });
        })}
      >
        <CategoryInput
          {...form.getInputProps("categoryId")}
          categories={availableCategories}
          loading={queryLoading}
        />
        <NumberInput
          {...form.getInputProps("amount")}
          label="Amount"
          decimalScale={2}
          fixedDecimalScale
          hideControls
          leftSection="$"
          leftSectionPointerEvents="none"
          thousandSeparator=","
        />
        <ActionIcon
          size={rem(36)}
          mt={rem(24)}
          type="submit"
          disabled={!form.isValid()}
          loading={isLoading}
          visibleFrom="xs"
        >
          <Plus size="1.25rem" weight="bold" />
        </ActionIcon>
        <Button
          type="submit"
          disabled={!form.isValid()}
          loading={isLoading}
          hiddenFrom="xs"
          leftSection={<Plus size="1.25rem" weight="bold" />}
        >
          Add Budget
        </Button>
      </form>
    </CollapsiblePanel>
  );
};

"use client";
import { UseFormReturnType } from "@mantine/form";
import classes from "./ItemizedItemInput.module.css";
import { ItemizedFormValue } from "@/modules/transaction/components/ItemizedTransactionInputModal/ItemizedTransactionInputModal";
import { api } from "@/trpc/react";
import {
  TextInput,
  NumberInput,
  Select,
  Loader,
  ActionIcon,
  rem,
  Group,
  Button,
} from "@mantine/core";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { CurrencyText } from "@/components/CurrencyText/CurrencyText";
import { CategoryInput } from "@/modules/category/components/CategoryInput/CategoryInput";

type ItemizedItemInputProps = {
  form: UseFormReturnType<ItemizedFormValue>;
  index: number;
  toAdd: number;
};

export const ItemizedItemInput = ({
  form,
  index,
  toAdd,
}: ItemizedItemInputProps) => {
  const { data: allCategories, isLoading: allCategoriesLoading } =
    api.category.get.useQuery();

  const remove = () => {
    form.removeListItem("items", index);
  };
  return (
    <div className={classes.root}>
      <TextInput
        {...form.getInputProps(`items.${index}.name`)}
        data-autofocus
        label="Name"
        placeholder="Enter a name"
      />
      <NumberInput
        {...form.getInputProps(`items.${index}.amount`)}
        label="Amount"
        decimalScale={2}
        hideControls
        leftSection="$"
        leftSectionPointerEvents="none"
        thousandSeparator=","
        rightSectionWidth={60}
        rightSectionPointerEvents="none"
        rightSection={
          <CurrencyText
            w={52}
            ta="right"
            fz="xs"
            c="dimmed"
            value={toAdd}
            showPlus
          />
        }
      />
      <CategoryInput
        {...form.getInputProps(`items.${index}.categoryId`)}
        categories={allCategories ?? []}
        loading={allCategoriesLoading}
        placeholder="Select a category"
      />
      <ActionIcon
        size={rem(36)}
        mt={rem(24)}
        variant="default"
        visibleFrom="xs"
        c={"red"}
        onClick={remove}
      >
        <Trash size="1.25rem" />
      </ActionIcon>
      <Button
        hiddenFrom="xs"
        leftSection={<Trash size="1.25rem" />}
        variant="subtle"
        color="red"
        onClick={remove}
      >
        Remove Item
      </Button>
    </div>
  );
};

import { TextInput, NumberInput, Select, Loader } from "@mantine/core";
import { DateInput, DatesProvider } from "@mantine/dates";
import classes from "./TransactionInput.module.css";
import { RefObject, useRef } from "react";
import { UseFormReturnType } from "@mantine/form";
import { api } from "@/trpc/react";
import { CategoryInput } from "@/modules/category/components/CategoryInput/CategoryInput";

export type TransactionValue = {
  name: string;
  amount: number;
  categoryId: string | null;
  date: Date;
  createdById: string | null;
};

type TransactionInputProps = {
  form: UseFormReturnType<TransactionValue>;
  onSubmit: (
    form: UseFormReturnType<TransactionValue>,
    nameRef: RefObject<HTMLInputElement>
  ) => void;
  monthMinMax?: {
    minDate: Date;
    maxDate: Date;
  };
  buttonSlot?: React.ReactNode;
  className?: string;
};

export const TransactionInput = ({
  form,
  onSubmit,
  monthMinMax,
  buttonSlot,
  className,
}: TransactionInputProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const handleEnterPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const { data: allCategories, isLoading: allCategoriesLoading } =
    api.category.get.useQuery();

  return (
    <form
      ref={formRef}
      className={className}
      onSubmit={form.onSubmit(() => onSubmit(form, nameRef))}
    >
      <TextInput
        {...form.getInputProps("name")}
        data-autofocus
        label="Name"
        placeholder="Enter a name"
        ref={nameRef}
        onFocus={() => void nameRef.current?.select()}
        onKeyDown={handleEnterPressed}
      />
      <NumberInput
        {...form.getInputProps("amount")}
        label="Amount"
        decimalScale={2}
        hideControls
        leftSection="$"
        leftSectionPointerEvents="none"
        thousandSeparator=","
        ref={amountRef}
        onFocus={() => void amountRef.current?.select()}
        onKeyDown={handleEnterPressed}
      />
      <CategoryInput
        {...form.getInputProps("categoryId")}
        categories={allCategories ?? []}
        loading={allCategoriesLoading}
        placeholder="Select a category"
      />
      <DateInput
        {...form.getInputProps("date")}
        label="Date"
        placeholder="Date"
        {...monthMinMax}
        onKeyDown={handleEnterPressed}
      />
      {buttonSlot}
    </form>
  );
};

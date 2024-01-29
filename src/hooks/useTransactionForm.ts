import { TransactionValue } from "@/modules/transaction/components/TransactionInput/TransactionInput";
import { useForm } from "@mantine/form";

export const useTransactionForm = (initialValues?: TransactionValue) => {
  const defaultInitialValues = {
    name: "",
    amount: 0,
    categoryId: null,
    date: new Date(),
    createdById: null,
  };

  const form = useForm<TransactionValue>({
    validateInputOnChange: true,
    initialValues: initialValues ?? defaultInitialValues,
    validate: {
      name: (value) => {
        if (!value) {
          return "Name is required";
        }
        return null;
      },
      categoryId: (value) => {
        if (!value) {
          return "Category is required";
        }
        return null;
      },
      date: (value) => {
        if (!value) {
          return "Date is required";
        }
        return null;
      },
      createdById: (value) => {
        if (!value) {
          return "User ID is required";
        }
        return null;
      },
    },
  });
  return form;
};

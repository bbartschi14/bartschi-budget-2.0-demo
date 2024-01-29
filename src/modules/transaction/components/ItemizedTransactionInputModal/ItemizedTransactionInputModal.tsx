import {
  Button,
  Center,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import classes from "./ItemizedTransactionInputModal.module.css";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import Panel from "@/components/Panel/Panel";
import { ItemizedItemInput } from "@/modules/transaction/components/ItemizedItemInput/ItemizedItemInput";
import { randomId, useMediaQuery } from "@mantine/hooks";
import pluralize from "pluralize";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "@/trpc/react";
import { useDate } from "@/stores/hooks/useDate";
import { CurrencyText } from "@/components/CurrencyText/CurrencyText";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

type ItemizedTransactionInputModalProps = {
  opened: boolean;
  onClose: () => void;
};

export type ItemizedItem = {
  name: string;
  amount: number;
  categoryId: string | null;
  key: string;
};

export type ItemizedFormValue = {
  date: Date;
  total: number;
  items: ItemizedItem[];
  createdById: string | null;
};

export const ItemizedTransactionInputModal = ({
  opened,
  onClose,
}: ItemizedTransactionInputModalProps) => {
  const { dateParams } = useDate();
  const { breakpoints } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm})`);
  const { data: session } = useSession();

  const utils = api.useUtils();

  const form = useForm<ItemizedFormValue>({
    validateInputOnChange: true,
    initialValues: {
      date: new Date(),
      total: 0,
      items: [{ name: "", amount: 0, categoryId: null, key: randomId() }],
      createdById: session?.user.id ?? null,
    },
    validate: {
      items: {
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
      },
      total: (value, values) => {
        if (value < 0) {
          return "Total must be positive";
        }
        const itemsTotal = values.items.reduce(
          (acc, item) => acc + item.amount,
          0
        );
        if (value < itemsTotal) {
          return "Total must be greater than the sum of all item amounts";
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

  const { mutate, isLoading } = api.transaction.createMultiple.useMutation({
    onSettled: async () => {
      void utils.transaction.getMonth.invalidate(dateParams);
      void utils.budget.getOverview.invalidate();
    },
    onSuccess: () => {
      form.reset();
      onClose();
    },
  });

  const totalEntered = form.values.items.reduce(
    (acc, item) => acc + item.amount,
    0
  );
  const remaining = form.values.total - totalEntered;
  const toAdd =
    remaining / (form.values.items.length > 0 ? form.values.items.length : 1);

  const onSubmit = (values: ItemizedFormValue) => {
    if (!values.createdById) {
      console.error("No user id");
      return;
    }

    const items = values.items.map((item, i) => ({
      name: item.name,
      year: values.date.getFullYear(),
      month: values.date.getMonth(),
      day: values.date.getDate(),
      categoryId: Number(item.categoryId),
      amount: item.amount + toAdd,
      createdById: values.createdById!,
    }));

    mutate(items);
  };

  useEffect(
    () => form.setFieldValue("createdById", session?.user.id ?? null),
    [session?.user.id]
  );

  useEffect(() => {
    form.validateField("total");
  }, [form.values.items]);

  return (
    <Modal
      title="Itemized Input"
      className={classes.root}
      opened={opened}
      onClose={onClose}
      fullScreen={isMobile}
      size="xl"
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <DateInput
            {...form.getInputProps("date")}
            label="Date"
            placeholder="Date"
          />
          <NumberInput
            {...form.getInputProps("total")}
            label="Total"
            decimalScale={2}
            hideControls
            leftSection="$"
            leftSectionPointerEvents="none"
            thousandSeparator=","
          />
          <Panel title="Items">
            <Stack>
              {form.values.items.map((item, i) => (
                <ItemizedItemInput
                  key={item.key}
                  form={form}
                  index={i}
                  toAdd={toAdd}
                />
              ))}
              <Button
                variant="subtle"
                onClick={() =>
                  form.insertListItem("items", {
                    name: "",
                    amount: 0,
                    categoryId: null,
                    key: randomId(),
                  })
                }
              >
                Add Item
              </Button>
            </Stack>
          </Panel>
          {form.values.items.length > 0 && (
            <Group gap="xs" justify="center">
              <CurrencyText value={form.values.total} />
              {" - "}
              <CurrencyText value={totalEntered} />
              <ArrowRight size="1rem" weight="bold" />
              <CurrencyText value={remaining} />
              {" / "}
              <Text>{form.values.items.length}</Text>
              <ArrowRight size="1rem" weight="bold" />
              <CurrencyText value={toAdd} showPlus c="green" fw="bold" />
              {` to each item`}
            </Group>
          )}
          <Button
            disabled={!form.isValid() || form.values.items.length === 0}
            loading={isLoading}
            type="submit"
          >{`Submit ${pluralize(
            "item",
            form.values.items.length,
            true
          )}`}</Button>
        </Stack>
      </form>
    </Modal>
  );
};

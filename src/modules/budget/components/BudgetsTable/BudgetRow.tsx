import type { BudgetRecord } from "@/server/db/shared";
import classes from "./BudgetsTable.module.css";
import {
  ActionIcon,
  Button,
  LoadingOverlay,
  Menu,
  NumberFormatter,
  NumberInput,
  Table,
  Text,
} from "@mantine/core";
import {
  ArrowLineRight,
  DotsThree,
  NotePencil,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge/CategoryBadge";

type BudgetRowProps = {
  budget: BudgetRecord;
  onDelete: () => void;
  onApplyRestOfYear: () => void;
  onUpdate: (amount: number) => void;
};

export const BudgetRow = ({
  budget,
  onDelete,
  onApplyRestOfYear,
  onUpdate,
}: BudgetRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(budget.amount);
  const updateMutation = api.budget.update.useMutation({
    onSettled: () => void utils.budget.getMonth.invalidate(),
  });

  const utils = api.useUtils();

  const reset = () => {
    setIsEditing(false);
    setAmount(budget.amount);
  };

  useEffect(() => {
    setAmount(budget.amount);
  }, [budget.amount]);

  const loading = updateMutation.isLoading;

  return (
    <Table.Tr key={budget.id} pos="relative">
      <Table.Td className={classes.td1}>
        <LoadingOverlay visible={loading} />
        {budget.category?.name ? (
          <CategoryBadge
            category={budget.category}
            className={classes.badge}
            badgeProps={{ size: "lg" }}
          />
        ) : (
          "No category"
        )}
      </Table.Td>
      <Table.Td className={classes.td2}>
        {isEditing ? (
          <NumberInput
            classNames={{ input: classes.input }}
            hideControls
            hidden
            autoFocus
            decimalScale={2}
            thousandSeparator=","
            value={amount}
            onChange={(val) => setAmount(Number(val))}
            onBlur={() => {
              if (amount !== budget.amount) onUpdate(amount);
              reset();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (amount !== budget.amount) {
                  updateMutation.mutate({ ...budget, amount });
                }
                reset();
              } else if (e.key === "Escape") {
                reset();
              }
            }}
          />
        ) : (
          <Button
            p="xs"
            variant="subtle"
            color="gray"
            w="100%"
            onClick={() => setIsEditing(true)}
          >
            <Text className={classes.numberText}>
              <NumberFormatter
                value={budget.amount ?? 0}
                prefix="$"
                thousandSeparator=","
                decimalScale={2}
                fixedDecimalScale
                className={classes.formatter}
              />
            </Text>
          </Button>
        )}
      </Table.Td>
      <Table.Td className={classes.td3}>
        <Menu
          shadow="sm"
          offset={4}
          withArrow
          arrowPosition="center"
          position="left-start"
        >
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <DotsThree size="1.25rem" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<NotePencil size="1.25rem" weight="duotone" />}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              onClick={onDelete}
              leftSection={<Trash size="1.25rem" weight="duotone" />}
              color="red"
            >
              Delete
            </Menu.Item>
            <Menu.Item
              leftSection={<ArrowLineRight size="1.25rem" weight="duotone" />}
              onClick={() => onApplyRestOfYear()}
            >
              Apply to rest of year
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  );
};

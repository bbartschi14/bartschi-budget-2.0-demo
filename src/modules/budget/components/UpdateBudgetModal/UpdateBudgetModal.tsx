import { type Budget } from "@/server/db/shared";
import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";
import { Group, NumberFormatter, Text } from "@mantine/core";
import { api } from "@/trpc/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

type UpdateBudgetModalProps = {
  budgetToUpdate: Budget | null;
  onClose: () => void;
};

export const UpdateBudgetModal = ({
  budgetToUpdate,
  onClose,
}: UpdateBudgetModalProps) => {
  const utils = api.useUtils();
  const updateMutation = api.budget.update.useMutation();
  const { data } = api.category.getById.useQuery(
    {
      id: budgetToUpdate?.categoryId ?? -1,
    },
    { enabled: budgetToUpdate !== null }
  );

  return (
    <ConfirmModal
      title={`Update Budget`}
      opened={budgetToUpdate !== null}
      onClose={onClose}
      isLoading={updateMutation.isLoading}
      onConfirm={() => {
        if (budgetToUpdate) {
          updateMutation.mutate(budgetToUpdate, {
            onSuccess: onClose,
            onSettled: () => void utils.budget.getMonth.invalidate(),
          });
        }
      }}
      labels={{ confirm: "Update", cancel: "No don't update it" }}
      closeOnConfirm={false}
    >
      <Group>
        <Text fw="bold">{data?.name}</Text>
        <ArrowRight weight="bold" size="1.25rem" />
        <Text fw="bold">
          <NumberFormatter
            value={budgetToUpdate?.amount}
            prefix="$"
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
          />
        </Text>
      </Group>
    </ConfirmModal>
  );
};

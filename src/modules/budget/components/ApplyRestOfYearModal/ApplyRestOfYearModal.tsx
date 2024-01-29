import { BudgetRecord } from "@/server/db/shared";
import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";
import { Space, Text } from "@mantine/core";
import { api } from "@/trpc/react";
import { CurrencyText } from "@/components/CurrencyText/CurrencyText";

type ApplyRestOfYearModalProps = {
  budgetToApply: BudgetRecord | null;
  onClose: () => void;
};

export const ApplyRestOfYearModal = ({
  budgetToApply,
  onClose,
}: ApplyRestOfYearModalProps) => {
  const utils = api.useUtils();
  const applyRestOfYearMutation = api.budget.applyToRestOfYear.useMutation();

  return (
    <ConfirmModal
      title="Apply Budget to Rest of Year"
      opened={budgetToApply !== null}
      onClose={onClose}
      isLoading={applyRestOfYearMutation.isLoading}
      onConfirm={() => {
        if (budgetToApply) {
          applyRestOfYearMutation.mutate(
            { id: budgetToApply.id },
            {
              onSuccess: onClose,
              onSettled: () => void utils.budget.getMonth.invalidate(),
            }
          );
        }
      }}
      labels={{ confirm: "Apply", cancel: "No don't apply" }}
      closeOnConfirm={false}
    >
      <Text size="sm">
        Are you sure you want to apply this budget to the rest of the year?
      </Text>
      <Space h="sm" />
      <Text size="sm">
        {budgetToApply?.category?.name} -{" "}
        <CurrencyText span value={budgetToApply?.amount ?? 0} />
      </Text>
    </ConfirmModal>
  );
};

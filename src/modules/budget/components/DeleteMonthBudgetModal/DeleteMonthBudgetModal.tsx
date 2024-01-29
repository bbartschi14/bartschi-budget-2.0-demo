import { api } from "@/trpc/react";
import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";
import { Text } from "@mantine/core";

type DeleteMonthBudgetModalProps = {
  open: boolean;
  date: Date;
  onClose: () => void;
};

export const DeleteMonthBudgetModal = (props: DeleteMonthBudgetModalProps) => {
  const utils = api.useUtils();
  const deleteMutation = api.budget.deleteMonth.useMutation();
  const queryParams = {
    year: props.date.getFullYear(),
    month: props.date.getMonth(),
  };

  return (
    <ConfirmModal
      title="Delete Month Budgets"
      opened={props.open}
      onClose={props.onClose}
      isLoading={deleteMutation.isLoading}
      onConfirm={() => {
        deleteMutation.mutate(queryParams, {
          onSuccess: props.onClose,
          onSettled: () => void utils.budget.getMonth.invalidate(),
        });
      }}
      labels={{ confirm: "Delete", cancel: "No don't delete them" }}
      confirmProps={{ color: "red" }}
      closeOnConfirm={false}
    >
      <Text size="sm">
        Are you sure you want to delete the budgets for this month? This will
        clear ALL of them.
      </Text>
    </ConfirmModal>
  );
};

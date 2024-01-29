import { type Budget } from "@/server/db/shared";
import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";
import { Text } from "@mantine/core";
import { api } from "@/trpc/react";

type DeleteBudgetModalProps = {
  budgetToDelete: Budget | null;
  onClose: () => void;
};

export const DeleteBudgetModal = ({
  budgetToDelete,
  onClose,
}: DeleteBudgetModalProps) => {
  const utils = api.useUtils();
  const deleteMutation = api.budget.delete.useMutation();

  return (
    <ConfirmModal
      title="Delete Budget"
      opened={budgetToDelete !== null}
      onClose={onClose}
      isLoading={deleteMutation.isLoading}
      onConfirm={() => {
        if (budgetToDelete) {
          deleteMutation.mutate(
            { id: budgetToDelete.id },
            {
              onSuccess: onClose,
              onSettled: () => void utils.budget.getMonth.invalidate(),
            }
          );
        }
      }}
      labels={{ confirm: "Delete", cancel: "No don't delete it" }}
      confirmProps={{ color: "red" }}
      closeOnConfirm={false}
    >
      <Text size="sm">Are you sure you want to delete the budget ?</Text>
    </ConfirmModal>
  );
};

import { type Category } from "@/server/db/shared";
import classes from "./DeleteCategoryModal.module.css";
import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";
import { Text } from "@mantine/core";
import { api } from "@/trpc/react";
import { useEffect, useRef } from "react";

type DeleteCategoryModalProps = {
  categoryToDelete: Category | null;
  onClose: () => void;
};

export const DeleteCategoryModal = ({
  categoryToDelete,
  onClose,
}: DeleteCategoryModalProps) => {
  const utils = api.useUtils();
  const deleteMutation = api.category.delete.useMutation();

  const snapshotCategory = useRef<Category | null>(null);
  useEffect(() => {
    if (categoryToDelete) {
      snapshotCategory.current = categoryToDelete;
    }
  }, [categoryToDelete]);

  return (
    <ConfirmModal
      title="Delete Category"
      opened={categoryToDelete !== null}
      onClose={onClose}
      isLoading={deleteMutation.isLoading}
      onConfirm={() => {
        if (categoryToDelete) {
          deleteMutation.mutate(
            { id: categoryToDelete.id },
            {
              onSuccess: onClose,
              onSettled: () => void utils.category.get.invalidate(),
            }
          );
        }
      }}
      labels={{ confirm: "Delete", cancel: "No don't delete it" }}
      confirmProps={{ color: "red" }}
      closeOnConfirm={false}
    >
      <Text size="sm">
        Are you sure you want to delete{" "}
        <Text span fw="bold">
          {categoryToDelete?.name ?? snapshotCategory.current?.name ?? ""}
        </Text>
        ?
      </Text>
    </ConfirmModal>
  );
};

import {
  type CategoryInputFormValues,
  CategoryInputModal,
} from "@/modules/category/components/CategoryInputModal/CategoryInputModal";
import { api } from "@/trpc/react";
import { type ModalProps } from "@mantine/core";

type NewCategoryModalProps = Pick<ModalProps, "opened" | "onClose">;

const INITIAL_DEFAULTS: CategoryInputFormValues = {
  name: "",
  color: "olive",
  colorShade: 5,
  description: "",
  icon: null,
  type: "expense",
};

export const NewCategoryModal = ({
  onClose,
  ...props
}: NewCategoryModalProps) => {
  const utils = api.useUtils();

  const { mutate, isLoading } = api.category.create.useMutation({
    onSettled: async () => {
      await utils.category.get.invalidate();
    },
  });

  return (
    <CategoryInputModal
      {...props}
      onClose={() => onClose()}
      title="New Category"
      isLoading={isLoading}
      onSubmit={(form, values) => {
        mutate(
          {
            name: values.name,
            description: values.description,
            icon: values.icon,
            color: `${values.color}.${values.colorShade}`,
            type: values.type,
          },
          {
            onSuccess: () => {
              onClose();
              form.reset();
            },
          }
        );
      }}
      initialValues={INITIAL_DEFAULTS}
      submitLabel="Create Category"
    />
  );
};

import { CategoryType, type Category } from "@/server/db/shared";
import { api } from "@/trpc/react";
import { CategoryInputModal } from "@/modules/category/components/CategoryInputModal/CategoryInputModal";
import { type IconKey } from "@/components/IconInput/IconInput";

type EditCategoryModalProps = {
  categoryToEdit: Category | null;
  onClose: () => void;
};

export const EditCategoryModal = (props: EditCategoryModalProps) => {
  const utils = api.useUtils();

  const { mutate, isLoading } = api.category.update.useMutation({
    onSettled: async () => {
      await utils.category.get.invalidate();
    },
  });

  const splitColor = props.categoryToEdit?.color?.split(".");
  const color = splitColor?.[0] ?? "";
  const colorShade = Number(splitColor?.[1] ?? "5");

  return (
    <CategoryInputModal
      opened={props.categoryToEdit !== null}
      onClose={() => props.onClose()}
      title={`Edit Category${
        props.categoryToEdit ? `: ${props.categoryToEdit.name}` : ""
      }`}
      isLoading={isLoading}
      onSubmit={(form, values) => {
        if (props.categoryToEdit === null) return;
        mutate(
          {
            id: props.categoryToEdit.id,
            name: values.name,
            description: values.description,
            icon: values.icon,
            color: `${values.color}.${values.colorShade}`,
            type: values.type,
          },
          {
            onSuccess: () => {
              props.onClose();
              form.reset();
            },
          }
        );
      }}
      initialValues={{
        name: props.categoryToEdit?.name ?? "",
        description: props.categoryToEdit?.description ?? "",
        icon: (props.categoryToEdit?.icon as IconKey) ?? null,
        color,
        colorShade,
        type: props.categoryToEdit?.type ?? "expense",
      }}
      submitLabel="Confirm changes"
    />
  );
};

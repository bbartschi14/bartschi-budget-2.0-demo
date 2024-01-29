import { Loader, Select, SelectProps } from "@mantine/core";
import classes from "./CategoryInput.module.css";
import { Category } from "@/server/db/shared";

type CategoryInputProps = Omit<SelectProps, "data"> & {
  categories: Category[];
  loading?: boolean;
};

const sortCategoryNames = (a: Category, b: Category) => {
  if (a.name === null) {
    return 1;
  }
  if (b.name === null) {
    return -1;
  }
  return a.name.localeCompare(b.name);
};

export const CategoryInput = ({
  disabled,
  categories,
  loading,
  ...props
}: CategoryInputProps) => {
  return (
    <Select
      label="Category"
      data={categories.sort(sortCategoryNames).map((c) => ({
        value: c.id.toString(),
        label: c.name ?? "",
      }))}
      disabled={disabled ?? loading}
      leftSection={loading ? <Loader size="sm" /> : null}
      searchable
      {...props}
    />
  );
};

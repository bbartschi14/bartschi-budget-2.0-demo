import { CategoryCard } from "@/modules/category/components/CategoryCard/CategoryCard";
import {
  Button,
  Drawer,
  Modal,
  type ModalProps,
  Stack,
  TextInput,
  Textarea,
  Select,
  useMantineTheme,
  Slider,
  Input,
  NumberInput,
  Group,
  LoadingOverlay,
  SegmentedControl,
} from "@mantine/core";
import { type UseFormReturnType, useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { capitalize } from "lodash";
import { IconInput, type IconKey } from "@/components/IconInput/IconInput";
import { useEffect } from "react";
import {
  CATEGORY_TYPES,
  CATEGORY_TYPES_DATA,
  CategoryType,
} from "@/server/db/shared";

type CategoryInputModalProps = Pick<
  ModalProps,
  "opened" | "onClose" | "title"
> & {
  initialValues: CategoryInputFormValues;
  isLoading?: boolean;
  onSubmit?: (form: CategoryInputForm, values: CategoryInputFormValues) => void;
  submitLabel?: string;
};

export type CategoryInputFormValues = {
  name: string;
  color: string;
  colorShade: number;
  description: string;
  icon: IconKey | null;
  type: CategoryType;
};

export type CategoryInputForm = UseFormReturnType<CategoryInputFormValues>;

const marks = [
  { value: 0 },
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
  { value: 9 },
];

export const CategoryInputModal = ({
  onClose,
  opened,
  title,
  initialValues,
  isLoading,
  onSubmit,
  submitLabel,
}: CategoryInputModalProps) => {
  const { colors, breakpoints } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm})`);

  const form = useForm<CategoryInputFormValues>({
    validateInputOnChange: true,
    initialValues,
    validate: {
      name: (value) => {
        if (!value) {
          return "Name is required";
        }
        return null;
      },
      description: (value) => {
        if (!value) {
          return "Description is required";
        }
        return null;
      },
      color: (value) => {
        if (!value) {
          return "Color is required";
        }
        return null;
      },
      colorShade: (value) => {
        if (value === undefined) {
          return "Color is required";
        } else if (value < 0 || value > 9) {
          return "Color shade must be between 0 and 9";
        }
        return null;
      },
    },
  });

  useEffect(() => {
    form.setInitialValues(initialValues);
    form.setValues(initialValues);
  }, [initialValues]);

  const category = {
    name: form.values.name,
    description: form.values.description,
    icon: form.values.icon,
    color: `${form.values.color}.${form.values.colorShade}`,
    type: form.values.type,
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const content = (
    <>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form onSubmit={form.onSubmit((values) => onSubmit?.(form, values))}>
        <Stack>
          <TextInput
            label="Name"
            placeholder="Category name"
            data-autofocus
            {...form.getInputProps("name")}
          />
          <Textarea
            label="Description"
            placeholder="Category description"
            {...form.getInputProps("description")}
          />
          <Group wrap="nowrap" gap="sm">
            <Select
              label="Color"
              placeholder="Pick base color"
              data={Object.keys(colors ?? {})
                .sort((a, b) => a.localeCompare(b))
                .map((color) => ({
                  value: color,
                  label: capitalize(color),
                }))}
              searchable
              {...form.getInputProps("color")}
            />
            <NumberInput
              label="Color Shade"
              min={0}
              max={9}
              {...form.getInputProps("colorShade")}
            />
          </Group>
          <Slider
            min={0}
            max={9}
            step={1}
            color={category.color}
            marks={marks}
            {...form.getInputProps("colorShade")}
          />
          <IconInput
            value={form.values.icon}
            onChange={(val) => form.setFieldValue("icon", val)}
            limit={40}
          />
          <Select
            label="Type"
            data={[...Object.values(CATEGORY_TYPES_DATA)]}
            {...form.getInputProps("type")}
          />
          <Input.Wrapper label="Result">
            <CategoryCard category={category} />
          </Input.Wrapper>
          <Button type="submit" disabled={!form.isValid()}>
            {submitLabel ?? "Submit"}
          </Button>
        </Stack>
      </form>
    </>
  );

  const modalProps = {
    opened,
    title,
    onClose: handleClose,
    children: content,
  };

  return (
    <>
      {isMobile ? (
        <Drawer {...modalProps} position="bottom" hiddenFrom="sm" size={"lg"} />
      ) : (
        <Modal {...modalProps} centered visibleFrom="sm" />
      )}
    </>
  );
};

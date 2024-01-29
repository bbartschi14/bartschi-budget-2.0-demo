import { CategoryType, type Category } from "@/server/db/shared";
import classes from "./CategoryCard.module.css";
import {
  ActionIcon,
  Card,
  type DefaultMantineColor,
  Group,
  Stack,
  Text,
  rem,
  Highlight,
  Tooltip,
  ThemeIcon,
} from "@mantine/core";
import * as PhosphorIcon from "@phosphor-icons/react/dist/ssr";
import dayjs from "dayjs";
import { Icon } from "@phosphor-icons/react";
import { capitalize } from "lodash";

type CategoryCardProps = {
  category: Pick<Category, "color" | "name" | "description" | "icon" | "type"> &
    Partial<Pick<Category, "createdAt">>;
  searchText?: string;
  menuSlot?: React.ReactNode;
};

const typeIcon: Record<CategoryType, Icon> = {
  expense: PhosphorIcon.CreditCard,
  income: PhosphorIcon.PiggyBank,
};

export const CategoryCard = ({
  category,
  searchText,
  menuSlot,
}: CategoryCardProps) => {
  const defaultIcon = "DotsSix";

  const CategoryIcon =
    // @ts-expect-error -- index type is incorrect
    PhosphorIcon[
      category.icon && category.icon.length > 0 ? category.icon : defaultIcon
    ];

  const TypeIcon = typeIcon[category.type ?? "expense"];

  return (
    <Card
      shadow="xs"
      padding="md"
      radius="md"
      withBorder
      className={classes.card}
    >
      <Group wrap="nowrap" align="flex-start">
        <ActionIcon
          className={classes.iconWrapper}
          color={category.color as DefaultMantineColor}
          variant="light"
          radius="xl"
          size={rem(54)}
          tabIndex={-1}
        >
          <CategoryIcon size={"100%"} />
        </ActionIcon>
        <Stack gap="xs" className={classes.right} miw={0}>
          <Group
            justify="space-between"
            wrap="nowrap"
            align="flex-start"
            gap="xs"
          >
            {category.name ? (
              <Highlight highlight={searchText ?? ""} fw={500} lineClamp={2}>
                {category.name ?? ""}
              </Highlight>
            ) : (
              <Text size="sm" c="dimmed" fs="italic">
                No name for this category
              </Text>
            )}
            {menuSlot}
          </Group>
          <Group
            justify="space-between"
            wrap="nowrap"
            align="flex-end"
            gap="xs"
          >
            {category.description ? (
              <Highlight highlight={searchText ?? ""} size="sm" c="dimmed">
                {category.description ?? ""}
              </Highlight>
            ) : (
              <Text size="sm" c="dimmed" fs="italic">
                No description for this category
              </Text>
            )}
            <Group gap="xs" wrap="nowrap">
              <Tooltip label={capitalize(category.type ?? "Expense")}>
                <ThemeIcon
                  color={category.type === "income" ? "green" : "gray"}
                  radius="xl"
                  variant="light"
                >
                  <TypeIcon size="1rem" />
                </ThemeIcon>
              </Tooltip>
              {category.createdAt && (
                <Tooltip label="Created on">
                  <Text size="xs" c="dimmed">
                    {dayjs(category.createdAt).format("M/D/YYYY")}
                  </Text>
                </Tooltip>
              )}
            </Group>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
};

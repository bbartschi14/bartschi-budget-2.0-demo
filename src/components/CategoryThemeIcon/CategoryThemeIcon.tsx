import { Category } from "@/server/db/shared";
import classes from "./CategoryThemeIcon.module.css";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { IconKey } from "@/components/IconInput/IconInput";
import { ThemeIcon, ThemeIconProps, Tooltip } from "@mantine/core";

type CategoryThemeIconProps = {
  category: Category;
  className?: string;
  themeIconProps?: ThemeIconProps;
};

export const CategoryThemeIcon = ({
  category,
  className,
  themeIconProps,
}: CategoryThemeIconProps) => {
  const CategoryIcon = category?.icon ? Icon[category.icon as IconKey] : null;

  return (
    <Tooltip
      label={category.name}
      position="left"
      color={category.color ?? "default"}
    >
      <ThemeIcon
        color={category.color ?? "primary"}
        variant="light"
        radius="xl"
        size="md"
        p={4}
        className={className}
        {...themeIconProps}
      >
        {/* @ts-expect-error - icon type incorrect */}
        <CategoryIcon size="100%" />
      </ThemeIcon>
    </Tooltip>
  );
};

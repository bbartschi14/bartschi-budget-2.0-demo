import { Category } from "@/server/db/shared";
import classes from "./CategoryBadge.module.css";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { IconKey } from "@/components/IconInput/IconInput";
import { Badge, BadgeProps } from "@mantine/core";

type CategoryBadgeProps = {
  category: Category;
  className?: string;
  badgeProps?: BadgeProps;
};

export const CategoryBadge = ({
  category,
  className,
  badgeProps,
}: CategoryBadgeProps) => {
  const CategoryIcon = category?.icon ? Icon[category.icon as IconKey] : null;

  return (
    <Badge
      color={category.color ?? "primary"}
      variant="light"
      // @ts-expect-error - icon type incorrect
      leftSection={CategoryIcon && <CategoryIcon size={"1rem"} />}
      className={className}
      {...badgeProps}
    >
      {category.name}
    </Badge>
  );
};

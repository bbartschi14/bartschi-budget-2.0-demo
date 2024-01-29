import { ActionIcon, Button, Group, Menu, rem } from "@mantine/core";
import classes from "./CategorySort.module.css";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import { type Category } from "@/server/db/shared";

export type SortType = "ascend" | "descend";
export type SortOption = {
  key: string;
  label: string;
  sort: (type: SortType) => (a: Category, b: Category) => number;
};
export type SortValue = SortOption & { type: SortType };

type CategorySortProps = {
  value: SortValue;
  onValueChanged: (value: SortValue) => void;
  options: SortOption[];
};

export const CategorySort = (props: CategorySortProps) => {
  const flip = () => {
    const opposite = props.value.type === "ascend" ? "descend" : "ascend";
    props.onValueChanged({ ...props.value, type: opposite });
  };

  return (
    <Group className={classes.root} gap={0} wrap="nowrap">
      <Menu withArrow offset={4} shadow="sm">
        <Menu.Target>
          <Button variant="subtle" px="xs" color="gray">
            {props.value.label}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {props.options.map((option) => (
            <Menu.Item
              key={option.key}
              onClick={() =>
                props.onValueChanged({ ...option, type: props.value.type })
              }
            >
              {option.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
      <ActionIcon variant="subtle" p={rem(4)} color="gray" onClick={flip}>
        <ArrowUp
          size="100%"
          weight="bold"
          className={classes.arrow}
          data-type={props.value.type}
        />
      </ActionIcon>
    </Group>
  );
};

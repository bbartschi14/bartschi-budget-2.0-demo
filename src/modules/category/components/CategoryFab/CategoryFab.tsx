import {
  ActionIcon,
  Box,
  Tooltip,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import classes from "./CategoryFab.module.css";
import { Plus } from "@phosphor-icons/react/dist/ssr";

type CategoryFabProps = { onClick: () => void };

export const CategoryFab = (props: CategoryFabProps) => {
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <Box className={classes.wrapper}>
      <Tooltip label="Create category" position="left">
        <ActionIcon
          className={classes.root}
          onClick={props.onClick}
          size={rem(52)}
          p="sm"
          radius="xl"
          variant="gradient"
          gradient={
            computedColorScheme === "light"
              ? { from: "olive.7", to: "olive.2" }
              : { from: "olive.9", to: "olive.5" }
          }
        >
          <Plus size={"100%"} weight="bold" />
        </ActionIcon>
      </Tooltip>
    </Box>
  );
};

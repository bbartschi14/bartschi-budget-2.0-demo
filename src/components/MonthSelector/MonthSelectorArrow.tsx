import { ActionIcon, rem } from "@mantine/core";
import classes from "./MonthSelector.module.css";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";

type MonthSelectorArrowProps = { flip?: boolean; onClick?: () => void };

export const MonthSelectorArrow = (props: MonthSelectorArrowProps) => {
  return (
    <ActionIcon variant="default" size={rem(36)} onClick={props.onClick}>
      <CaretLeft
        className={classes.arrow}
        data-flip={props.flip}
        size="1rem"
        weight="bold"
      />
    </ActionIcon>
  );
};

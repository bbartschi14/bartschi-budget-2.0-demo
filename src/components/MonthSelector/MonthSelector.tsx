import { MonthPickerInput } from "@mantine/dates";
import classes from "./MonthSelector.module.css";
import {
  ActionIcon,
  Group,
  Space,
  Tooltip,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr";
import { MonthSelectorArrow } from "@/components/MonthSelector/MonthSelectorArrow";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";

type MonthSelectorProps = {
  value: Date;
  onChange: (value: Date) => void;
};

export const MonthSelector = (props: MonthSelectorProps) => {
  const { breakpoints } = useMantineTheme();
  const isXS = useMediaQuery(`(max-width: ${breakpoints.xs})`);

  const goPrevious = () => {
    const nextMonth = dayjs(props.value).subtract(1, "month").toDate();
    props.onChange(nextMonth);
  };

  const goNext = () => {
    const nextMonth = dayjs(props.value).add(1, "month").toDate();
    props.onChange(nextMonth);
  };

  const currentMonth = dayjs().startOf("month").toDate();
  const currentMonthIsSelected = dayjs(props.value).isSame(
    currentMonth,
    "month"
  );

  const resetToCurrentMonth = () => {
    props.onChange(currentMonth);
  };

  return (
    <Group className={classes.group}>
      <MonthSelectorArrow onClick={goPrevious} />
      <MonthPickerInput
        value={props.value}
        onChange={(value) => props.onChange(value ?? new Date())}
        classNames={{
          root: classes.root,
          input: classes.input,
        }}
        valueFormat={isXS ? "MMM YYYY" : "MMMM YYYY"}
        popoverProps={{ position: "bottom" }}
        leftSection={currentMonthIsSelected ? undefined : <Space />}
        leftSectionPointerEvents="none"
        rightSection={
          currentMonthIsSelected ? undefined : (
            <Tooltip label="Reset to current month">
              <ActionIcon
                variant="subtle"
                color="gray"
                className={classes.currentMonth}
                onClick={resetToCurrentMonth}
              >
                <ArrowCounterClockwise size="1rem" weight="bold" />
              </ActionIcon>
            </Tooltip>
          )
        }
      />
      <MonthSelectorArrow flip onClick={goNext} />
    </Group>
  );
};

import {
  Card,
  Group,
  rem,
  Text,
  ThemeIcon,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import classes from "./BudgetTotal.module.css";
import { CurrencyText } from "@/components/CurrencyText/CurrencyText";
import { capitalize } from "lodash";
import { CATEGORY_TYPES_DATA } from "@/server/db/shared";
import { useMediaQuery } from "@mantine/hooks";

type BudgetTotalProps = {
  expenseTotal: number;
  incomeTotal: number;
};

export const BudgetTotal = (props: BudgetTotalProps) => {
  // const theme = useMantineTheme();
  // const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
  const ExpenseIcon = CATEGORY_TYPES_DATA.expense.icon;
  const IncomeIcon = CATEGORY_TYPES_DATA.income.icon;

  return (
    <div className={classes.wrapper}>
      <Card className={classes.root} shadow="md" radius="md" withBorder>
        <Text fz="lg" fw="bold">
          Total:
        </Text>
        <Group justify="flex-end" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Tooltip label={capitalize(CATEGORY_TYPES_DATA.expense.label)}>
              <ThemeIcon color={"gray"} radius="xl" variant="light">
                <ExpenseIcon size="1rem" />
              </ThemeIcon>
            </Tooltip>
            <CurrencyText
              value={props.expenseTotal}
              fz="lg"
              fw="bold"
              ta={"center"}
            />
          </Group>
          <Group gap="xs" wrap="nowrap">
            <Tooltip label={capitalize(CATEGORY_TYPES_DATA.income.label)}>
              <ThemeIcon color={"green"} radius="xl" variant="light">
                <IncomeIcon size="1rem" />
              </ThemeIcon>
            </Tooltip>
            <CurrencyText
              value={props.incomeTotal}
              fz="lg"
              fw="bold"
              ta={"center"}
            />
          </Group>
        </Group>
      </Card>
    </div>
  );
};

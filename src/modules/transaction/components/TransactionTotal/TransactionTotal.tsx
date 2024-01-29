import classes from "./TransactionTotal.module.css";
import { Card, Group, Text } from "@mantine/core";
import { CurrencyText } from "@/components/CurrencyText/CurrencyText";

type TransactionTotalProps = {
  expenseTotal: number;
  incomeTotal: number;
};

export const TransactionTotal = (props: TransactionTotalProps) => {
  return (
    <div className={classes.wrapper}>
      <Card className={classes.root} shadow="md" radius="md" withBorder>
        <Text fz="lg" fw="bold">
          Total:
        </Text>
        <CurrencyText
          value={props.incomeTotal - props.expenseTotal}
          fz="lg"
          fw="bold"
          ta={"center"}
          c={props.incomeTotal - props.expenseTotal >= 0 ? "green" : "red"}
        />
      </Card>
    </div>
  );
};

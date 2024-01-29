import { NumberFormatter, type TextProps, Text } from "@mantine/core";
import classes from "./CurrencyText.module.css";

type CurrencyTextProps = TextProps & { value: number; showPlus?: boolean };

export const CurrencyText = ({ value, ...props }: CurrencyTextProps) => {
  return (
    <Text {...props}>
      <NumberFormatter
        value={value}
        prefix={value >= 0 && props.showPlus ? "+$" : "$"}
        thousandSeparator=","
        decimalScale={2}
        fixedDecimalScale
      />
    </Text>
  );
};

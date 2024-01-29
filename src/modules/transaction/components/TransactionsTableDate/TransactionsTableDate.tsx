import dayjs from "dayjs";
import classes from "./TransactionsTableDate.module.css";
import utc from "dayjs/plugin/utc";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useMediaQuery } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/core";

dayjs.extend(utc);
dayjs.extend(advancedFormat);

type TransactionsTableDateProps = {
  date: Date;
};

export const TransactionsTableDate = ({ date }: TransactionsTableDateProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const text = isMobile
    ? dayjs.utc(date).format("Do")
    : dayjs.utc(date).format("D MMM YYYY (ddd)");

  return text;
};

"use client";

import { MaxWidthBox } from "@/components/MaxWidthBox/MaxWidthBox";
import classes from "./GraphPage.module.css";
import {
  Center,
  Paper,
  Stack,
  getThemeColor,
  useMantineTheme,
  Text,
  Group,
  Box,
  LoadingOverlay,
  Loader,
  ScrollArea,
} from "@mantine/core";
import { MonthSelector } from "@/components/MonthSelector/MonthSelector";
import { useDate } from "@/stores/hooks/useDate";
import { BarChart, ChartTooltipProps } from "@mantine/charts";
import { api } from "@/trpc/react";
import { CategoryThemeIcon } from "@/components/CategoryThemeIcon/CategoryThemeIcon";
import { useMemo } from "react";
import { Category } from "@/server/db/shared";
import { CurrencyText } from "@/components/CurrencyText/CurrencyText";
import { useQueryState } from "@/hooks/useQueryState";

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function ChartTooltip({ label, payload }: ChartTooltipProps) {
  if (!payload) return null;
  const innerPayload = payload as {
    payload: { category: Category };
    value: number;
  }[];
  return (
    <Paper p="sm" withBorder shadow="md" radius="md">
      <Group>
        <Stack gap={0}>
          <Text fw={500} mb={5}>
            {label}
          </Text>
          {innerPayload.map((item, i) => (
            <CurrencyText value={item.value} key={i} />
          ))}
        </Stack>
        {innerPayload[0] && (
          <CategoryThemeIcon
            category={innerPayload[0].payload.category}
            themeIconProps={{ size: "lg" }}
          />
        )}
      </Group>
    </Paper>
  );
}

export const GraphPage = () => {
  const theme = useMantineTheme();
  const { date, setDate, dateParams } = useDate();
  const overviewQuery = api.budget.getOverview.useQuery(dateParams);
  const queryState = useQueryState(overviewQuery);

  const { data } = overviewQuery;

  const displayData =
    data
      ?.filter((record) => record.spent > 0)
      .map((record) => ({
        ...record,
        fill: getThemeColor(record.category?.color ?? "blue", theme),
      })) ?? [];

  let content = (
    <MaxWidthBox>
      <Center h={"calc(100vh - 200px)"}>
        <Text c="dimmed" fz="lg">
          No data
        </Text>
      </Center>
    </MaxWidthBox>
  );

  if (queryState === "Loading") {
    content = (
      <Center h={"calc(100vh - 200px)"}>
        <Loader />
      </Center>
    );
  } else if (queryState === "Not Empty" && displayData.length > 0) {
    content = (
      <ScrollArea scrollbars="x" offsetScrollbars>
        <BarChart
          h={"calc(100vh - 160px - var(--app-shell-header-offset))"}
          mih={400}
          miw={30 * displayData.length}
          data={displayData}
          series={[{ name: "spent", color: "blue" }]}
          dataKey="category.name"
          yAxisProps={{
            tickFormatter: (value) => USDollar.format(value as number),
            width: 60,
          }}
          fillOpacity={0.75}
          tooltipProps={{
            content: ({ label, payload }) => (
              <ChartTooltip label={label} payload={payload} />
            ),
          }}
        />
      </ScrollArea>
    );
  }

  return (
    <Stack>
      <Center>
        <MonthSelector value={date} onChange={setDate} />
      </Center>
      <Box pos="relative">{content}</Box>
      <Text ta="center" c="dimmed" fw="bold" mt="sm">
        Month Spending
      </Text>
    </Stack>
  );
};

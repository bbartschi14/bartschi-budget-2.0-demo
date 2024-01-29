"use client";

import { MonthSelector } from "@/components/MonthSelector/MonthSelector";
import Panel from "@/components/Panel/Panel";
import { NewTransactionInput } from "@/modules/transaction/components/NewTransactionInput/NewTransactionInput";
import { TransactionsTable } from "@/modules/transaction/components/TransactionsTable/TransactionsTable";
import { useDate } from "@/stores/hooks/useDate";

import {
  ActionIcon,
  Center,
  Group,
  Menu,
  Space,
  Stack,
  rem,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import classes from "./Transactions.module.css";
import { TransactionsOverview } from "@/modules/transaction/components/TransactionsOverview/TransactionsOverview";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { Gear, Receipt } from "@phosphor-icons/react/dist/ssr";
import { useDisclosure } from "@mantine/hooks";
import { ItemizedTransactionInputModal } from "@/modules/transaction/components/ItemizedTransactionInputModal/ItemizedTransactionInputModal";

export default function Transactions() {
  const { date, setDate } = useDate();
  const { data: session } = useSession();

  const form = useTransactionForm();

  useEffect(() => {
    form.setFieldValue("date", date);
  }, [date]);

  useEffect(() => {
    form.setFieldValue("createdById", session?.user.id ?? null);
  }, [session?.user.id]);

  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <Stack pos="relative">
        <Center>
          <MonthSelector value={date} onChange={setDate} />
        </Center>
        <Group align="flex-start" className={classes.group}>
          <Stack className={classes.left}>
            <NewTransactionInput form={form} />
            <Panel title="Transactions">
              <TransactionsTable />
            </Panel>
          </Stack>
          <TransactionsOverview />
        </Group>
        <Menu position="right-start" withArrow shadow="sm">
          <Menu.Target>
            <ActionIcon className={classes.menu} variant="default" size="lg">
              <Gear size="1.5rem" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<Receipt size="1.25rem" />}
              onClick={() => open()}
            >
              Itemized entry
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Stack>
      <ItemizedTransactionInputModal opened={opened} onClose={close} />
      <Space h={rem(100)} />
    </>
  );
}

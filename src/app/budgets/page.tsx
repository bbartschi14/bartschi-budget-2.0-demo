"use client";

import { MaxWidthBox } from "@/components/MaxWidthBox/MaxWidthBox";
import { MonthSelector } from "@/components/MonthSelector/MonthSelector";
import Panel from "@/components/Panel/Panel";
import { BudgetsTable } from "@/modules/budget/components/BudgetsTable/BudgetsTable";
import { DeleteMonthBudgetModal } from "@/modules/budget/components/DeleteMonthBudgetModal/DeleteMonthBudgetModal";
import {
  NewBudgetInput,
  type NewBudgetValue,
} from "@/modules/budget/components/NewBudgetInput/NewBudgetInput";
import { useDate } from "@/stores/hooks/useDate";
import { ActionIcon, Center, Menu, Space, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DotsThree, Trash } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export default function Page() {
  const { date, setDate } = useDate();

  const form = useForm<NewBudgetValue>({
    validateInputOnChange: true,
    initialValues: { categoryId: null, amount: 0 },
    validate: {
      categoryId: (value) => {
        if (!value) {
          return "Category is required";
        }
        return null;
      },
      amount: (value) => {
        if (value <= 0) {
          return "Value must be greater than 0";
        }
        return null;
      },
    },
  });

  const [deleteMonthOpen, setDeleteMonthOpen] = useState(false);

  return (
    <>
      <MaxWidthBox>
        <Stack>
          <Center>
            <MonthSelector value={date} onChange={setDate} />
          </Center>
          <Stack>
            <NewBudgetInput form={form} date={date} />
            <Panel
              title="Budgets"
              rightSection={
                <Menu
                  shadow="sm"
                  offset={4}
                  withArrow
                  arrowPosition="center"
                  position="left"
                >
                  <Menu.Target>
                    <ActionIcon color="gray" variant="subtle">
                      <DotsThree size="1.5rem" />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={() => setDeleteMonthOpen(true)}
                      leftSection={<Trash size="1.25rem" weight="duotone" />}
                      color="red"
                    >
                      Delete Month!
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              }
            >
              <BudgetsTable date={date} />
            </Panel>
            <Space h={80} />
          </Stack>
        </Stack>
      </MaxWidthBox>
      <DeleteMonthBudgetModal
        open={deleteMonthOpen}
        date={date}
        onClose={() => setDeleteMonthOpen(false)}
      />
    </>
  );
}

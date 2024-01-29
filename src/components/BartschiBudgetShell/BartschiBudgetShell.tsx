"use client";

import NavBar from "@/components/NavBar/NavBar";
import { AppShell, Burger, Group, useMantineTheme } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import type { PropsWithChildren } from "react";
import classes from "./BartschiBudgetShell.module.css";

type BartschiBudgetShellProps = PropsWithChildren;

const BartschiBudgetShell = (props: BartschiBudgetShellProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60, collapsed: !isMobile }}
      navbar={{ width: 80, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding={isMobile ? "xs" : "md"}
    >
      <AppShell.Header hiddenFrom="sm">
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" className={classes.navbar}>
        <NavBar onClose={close} />
      </AppShell.Navbar>
      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  );
};

export default BartschiBudgetShell;

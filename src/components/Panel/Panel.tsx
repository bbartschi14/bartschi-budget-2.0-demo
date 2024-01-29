import type { PropsWithChildren, ReactNode } from "react";
import classes from "./Panel.module.css";
import { Group, Text } from "@mantine/core";

type PanelProps = PropsWithChildren<{
  title: string;
  rightSection?: ReactNode;
}>;

export default function Panel({ title, children, rightSection }: PanelProps) {
  return (
    <div className={classes.panel}>
      <Group justify="space-between" pb="md">
        <Text fw="bold" c="gray">
          {title}
        </Text>
        {rightSection}
      </Group>
      {children}
    </div>
  );
}

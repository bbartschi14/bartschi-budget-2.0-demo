import classes from "./CollapsiblePanel.module.css";
import panelClasses from "@/components/Panel/Panel.module.css";
import { useState, type PropsWithChildren } from "react";
import { Box, Collapse, Group, Text, UnstyledButton } from "@mantine/core";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

type CollapsiblePanelProps = PropsWithChildren<{
  title: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}>;

export default function CollapsiblePanel({
  title,
  children,
  open: controlledOpen,
  setOpen: setControlledOpen,
}: CollapsiblePanelProps) {
  const [internalOpen, setInternalOpen] = useState(true);
  const isControlled =
    controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  return (
    <Box className={panelClasses.panel} p={0}>
      <UnstyledButton
        className={classes.button}
        onClick={() => setOpen(!open)}
        p="sm"
      >
        <Group justify="space-between">
          <Text fw="bold" c="gray">
            {title}
          </Text>
          <CaretDown
            className={classes.icon}
            data-opened={open}
            size="1rem"
            weight="bold"
          />
        </Group>
      </UnstyledButton>
      <Collapse in={open}>
        <Box p="sm" pt={0}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

import React from "react";
import {
  Box,
  Button,
  type ButtonProps,
  Group,
  type GroupProps,
  Modal,
  LoadingOverlay,
} from "@mantine/core";

export interface ConfirmModalProps {
  children?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;
  cancelProps?: ButtonProps & React.ComponentPropsWithoutRef<"button">;
  confirmProps?: ButtonProps & React.ComponentPropsWithoutRef<"button">;
  groupProps?: GroupProps;
  labels?: { cancel?: string; confirm?: string };
  opened: boolean;
  isLoading?: boolean;
  onClose: () => void;
  title: string;
}

export function ConfirmModal({
  cancelProps,
  confirmProps,
  labels = { cancel: "", confirm: "" },
  closeOnConfirm = true,
  closeOnCancel = true,
  groupProps,
  onCancel,
  onConfirm,
  children,
  opened,
  onClose,
  isLoading,
  title,
}: ConfirmModalProps) {
  const { cancel: cancelLabel, confirm: confirmLabel } = labels;

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    onCancel?.();
    if (closeOnCancel) {
      onClose();
    }
  };

  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    onConfirm?.();
    if (closeOnConfirm) {
      onClose();
    }
  };

  return (
    <Modal title={title} opened={opened} onClose={onClose} centered>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {children && <Box mb="md">{children}</Box>}
      <Group justify="flex-end" {...groupProps}>
        <Button variant="default" {...cancelProps} onClick={handleCancel}>
          {cancelProps?.children ?? cancelLabel}
        </Button>

        <Button {...confirmProps} onClick={handleConfirm}>
          {confirmProps?.children ?? confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}

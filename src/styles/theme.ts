"use client";

import {
  type MantineColorsTuple,
  createTheme,
  Tooltip,
  Modal,
  Drawer,
  VariantColorsResolver,
  defaultVariantColorsResolver,
  parseThemeColor,
  rem,
  rgba,
  Select,
} from "@mantine/core";
import modalClasses from "./modal.module.css";
import selectClassNames from "./select.module.css";

const olive: MantineColorsTuple = [
  "#eefae9",
  "#dff1db",
  "#c2e0b9",
  "#a1ce95",
  "#86bf76",
  "#74b562",
  "#6ab057",
  "#589a46",
  "#4c8a3c",
  "#3e772f",
];

const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input);

  const { theme, color, variant } = input;
  const parsed = parseThemeColor({ color, theme });

  if (variant === "light") {
    if (parsed.isThemeColor) {
      if (parsed.shade === undefined) {
        return {
          background: `var(--mantine-color-${color}-light)`,
          hover: `var(--mantine-color-${color}-light-hover)`,
          color: `var(--mantine-color-${color}-light-color)`,
          border: `${rem(1)} solid var(--mantine-color-${color}-light-color)`,
        };
      }

      const parsedColor = theme.colors[parsed.color]![parsed.shade];

      return {
        background: rgba(parsedColor, 0.1),
        hover: rgba(parsedColor, 0.12),
        color: `var(--mantine-color-${parsed.color}-${parsed.shade})`,
        border: `${rem(1)} solid ${rgba(parsedColor, 0.2)}`,
      };
    }

    return {
      background: rgba(color!, 0.1),
      hover: rgba(color!, 0.12),
      color: color!,
      border: `${rem(1)} solid ${rgba(color!, 0.2)}`,
    };
  }

  return defaultResolvedColors;
};

export const theme = createTheme({
  variantColorResolver,
  primaryColor: "olive",
  colors: {
    olive,
  },
  components: {
    Select: Select.extend({
      classNames: selectClassNames,
    }),
    Tooltip: Tooltip.extend({
      defaultProps: { color: "gray", zIndex: 1000 },
    }),
    Modal: Modal.extend({
      defaultProps: {
        classNames: {
          title: modalClasses.title,
        },
      },
    }),
    Drawer: Drawer.extend({
      defaultProps: {
        classNames: {
          title: modalClasses.title,
        },
      },
    }),
  },
});

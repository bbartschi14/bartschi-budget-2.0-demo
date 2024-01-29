import { Box, type BoxProps, rem } from "@mantine/core";
import { type PropsWithChildren } from "react";

type MaxWidthBoxProps = PropsWithChildren<BoxProps>;

export const MaxWidthBox = (props: MaxWidthBoxProps) => {
  return (
    <Box maw={rem(800)} mx="auto">
      {props.children}
    </Box>
  );
};

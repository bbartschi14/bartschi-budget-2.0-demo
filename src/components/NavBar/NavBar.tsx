"use client";

import navigation from "@/constants/navigation";
import { usePathSegments } from "@/hooks/navigation/usePathSegments";
import {
  Avatar,
  Box,
  Center,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import classes from "./NavBar.module.css";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { useSession, signOut } from "next-auth/react";
import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";

type NavBarProps = { onClose?: () => void };

const NavBar = (props: NavBarProps) => {
  const segments = usePathSegments();
  const firstSegment = segments[0];
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      <Stack>
        {navigation.map((navItem) => {
          const active = navItem.route === firstSegment;
          return (
            <Tooltip key={navItem.route} label={navItem.label} position="right">
              <UnstyledButton
                onClick={() => {
                  router.push(navItem.route);
                  props.onClose?.();
                }}
                className={classes.link}
                data-active={active || undefined}
              >
                <navItem.icon
                  className={classes.icon}
                  data-active={active || undefined}
                  weight={active ? "duotone" : "regular"}
                />
                <Text hiddenFrom="sm">{navItem.label}</Text>
              </UnstyledButton>
            </Tooltip>
          );
        })}
      </Stack>
      <Stack>
        <Center w={50}>
          <Tooltip label={session?.user.name} position="right">
            <Avatar src={session?.user.image} />
          </Tooltip>
        </Center>
        <ColorSchemeToggle/>
        <Tooltip label="Sign out" position="right">
          <UnstyledButton className={classes.link} onClick={() => signOut()}>
            <SignOut className={classes.icon} />
          </UnstyledButton>
        </Tooltip>
      </Stack>
    </>
  );
};

export default NavBar;

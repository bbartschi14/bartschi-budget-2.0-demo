import { Title, Text, Button, Stack } from "@mantine/core";
import classes from "./LoginPage.module.css";
import { getServerAuthSession } from "@/server/auth";

const LoginPage = async () => {
  const session = await getServerAuthSession();

  const loggedInWithoutPermission =
    session?.user && session.user.permission !== "admin";
  return (
    <Stack align="center">
      <Title className={classes.title} ta="center" pt={100}>
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: "olive", to: "lime" }}
        >
          Bartschi Budget
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto">
        {loggedInWithoutPermission
          ? "You don't have permission to view this page"
          : "Keeping track of all that money"}
      </Text>
      {session?.user ? (
        <Button component="a" href="/api/auth/signout" size="lg">
          Logout
        </Button>
      ) : (
        <Button component="a" href="/api/auth/signin" size="lg">
          Login
        </Button>
      )}
    </Stack>
  );
};

export default LoginPage;

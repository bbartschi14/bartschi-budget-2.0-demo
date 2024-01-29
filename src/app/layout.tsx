import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "mantine-datatable/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { TRPCReactProvider } from "@/trpc/react";
import { cookies } from "next/headers";
import BartschiBudgetShell from "@/components/BartschiBudgetShell/BartschiBudgetShell";
import { theme } from "@/styles/theme";
import { getServerAuthSession } from "@/server/auth";
import SessionProvider from "@/app/SessionProvider";
import LoginPage from "@/components/LoginPage/LoginPage";
import { env } from "@/env";
import { ModalsProvider } from "@mantine/modals";
import { DatesProvider } from "@mantine/dates";

export const metadata = {
  title: "Bartschi Budget",
  description: "For all our budgeting needs",
  icons: [{ rel: "icon", url: "/icon.png" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevents scaling when clicking on input element with text < 16px
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <SessionProvider session={session}>
          <TRPCReactProvider cookies={cookies().toString()}>
            <MantineProvider theme={theme} defaultColorScheme="dark">
              <ModalsProvider>
                {session?.user && session.user.permission === "admin" ? (
                  <BartschiBudgetShell>{children}</BartschiBudgetShell>
                ) : (
                  <LoginPage />
                )}
              </ModalsProvider>
            </MantineProvider>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

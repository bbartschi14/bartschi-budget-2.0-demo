import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env";
import { db } from "@/server/db";
import {
  accounts,
  mysqlTable,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { type MySqlTableFn } from "drizzle-orm/mysql-core";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const extraAdapter: MySqlTableFn = (name, columns, extraConfig) => {
  switch (name) {
    case "user":
      return users;
    case "account":
      return accounts;
    case "session":
      return sessions;
    case "verification_token":
      return verificationTokens;
    default:
      return mysqlTable(name, columns, extraConfig);
  }
};

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      permission: string;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    permission: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        // ...other properties
        permission: user.permission,
      },
    }),
  },
  // @ts-expect-error - `drizzle-adapter` is not typed.
  adapter: DrizzleAdapter(db, extraAdapter),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

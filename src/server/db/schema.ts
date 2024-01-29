import { CATEGORY_TYPES } from "@/server/db/shared";
import { relations, sql } from "drizzle-orm";
import {
  date,
  double,
  index,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator(
  (name) => `bartschi-budget-2.0_${name}`
);

export const categories = mysqlTable("categories", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
  color: varchar("color", { length: 31 }),
  icon: varchar("icon", { length: 31 }),
  description: text("description"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
  type: mysqlEnum("type", CATEGORY_TYPES),
});

export const months = mysqlTable("months", {
  id: int("id").primaryKey().autoincrement(),
  year: int("year"),
  /** 0 indexed month */
  month: tinyint("month"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const budgets = mysqlTable("budgets", {
  id: int("id").primaryKey().autoincrement(),
  amount: double("amount").notNull(),
  categoryId: int("categoryId").notNull(),
  year: int("year").notNull(),
  /** 0 indexed month */
  month: tinyint("month").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const budgetTags = mysqlTable("budgetTags", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  budgetId: int("budgetId").notNull(),
});

export const budgetTagsRelations = relations(budgetTags, ({ one }) => ({
  budget: one(budgets, {
    fields: [budgetTags.budgetId],
    references: [budgets.id],
  }),
}));

export const budgetsRelations = relations(budgets, ({ one, many }) => ({
  budgetTags: many(budgetTags),
  categories: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
}));

export const transactions = mysqlTable("transactions", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  amount: double("amount").notNull(),
  createdById: varchar("createdById", { length: 255 }).notNull(),
  categoryId: int("categoryId").notNull(),
  date: date("date", { mode: "date" }).notNull(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  createdBy: one(users, {
    fields: [transactions.createdById],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  permission: varchar("permission", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  transactions: many(transactions),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

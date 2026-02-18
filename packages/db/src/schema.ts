import { type AdapterAccount } from "@auth/core/adapters";
import {
  // foreignKey,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// import { sql } from "drizzle-orm"
export const users = pgTable("user", {
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  id: text("id").notNull().primaryKey(),
  image: text("image"),
  name: text("name"),
});

export const accounts = pgTable(
  "account",
  {
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    id_token: text("id_token"),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    scope: text("scope"),
    session_state: text("session_state"),
    token_type: text("token_type"),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  }),
);

export const sessions = pgTable("session", {
  expires: timestamp("expires", { mode: "date" }).notNull(),
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const verificationTokens = pgTable(
  "verification_token",
  {
    expires: timestamp("expires", { mode: "date" }).notNull(),
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const verificationToken = pgTable(
  "VerificationToken",
  {
    expires: timestamp("expires", { mode: "string", precision: 3 }).notNull(),
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
  },
  (table) => {
    return {
      identifierTokenKey: uniqueIndex("VerificationToken_identifier_token_key").on(table.identifier, table.token),
      tokenKey: uniqueIndex("VerificationToken_token_key").on(table.token),
    };
  },
);

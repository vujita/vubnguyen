import {
  // foreignKey,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// import { sql } from "drizzle-orm"

export const post = pgTable("Post", {
  content: text("content").notNull(),
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
});

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

export const user = pgTable(
  "User",
  {
    email: text("email"),
    emailVerified: timestamp("emailVerified", { mode: "string", precision: 3 }),
    id: text("id").primaryKey().notNull(),
    image: text("image"),
    name: text("name"),
  },
  (table) => {
    return {
      emailKey: uniqueIndex("User_email_key").on(table.email),
    };
  },
);

export const account = pgTable(
  "Account",
  {
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    id: text("id").primaryKey().notNull(),
    idToken: text("id_token"),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refresh_token"),
    scope: text("scope"),
    sessionState: text("session_state"),
    tokenType: text("token_type"),
    type: text("type").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      providerProviderAccountIdKey: uniqueIndex("Account_provider_providerAccountId_key").on(table.provider, table.providerAccountId),
    };
  },
);

export const session = pgTable(
  "Session",
  {
    expires: timestamp("expires", { mode: "string", precision: 3 }).notNull(),
    id: text("id").primaryKey().notNull(),
    sessionToken: text("sessionToken").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      sessionTokenKey: uniqueIndex("Session_sessionToken_key").on(table.sessionToken),
    };
  },
);

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "./env";
import * as schema from "./schema";

// for query purposes
const queryClient = postgres(env.DATABASE_URL, {});

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

const isProd = process.env.NODE_ENV === "production";
export const db: PostgresJsDatabase<typeof schema> =
  globalForDb.db ??
  drizzle(queryClient, {
    logger: !isProd,
    schema,
  });

if (isProd) {
  globalForDb.db = db;
}

export default db;

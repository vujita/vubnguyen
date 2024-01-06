import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import env from "./env";
import * as schema from "./schema";

const applyMigrations = async () => {
  const ssl = process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined;
  const migrationClient = postgres(env.DATABASE_URL, { max: 1, ssl });
  const migrateDb = drizzle(migrationClient, { schema });
  await migrate(migrateDb, { migrationsFolder: "drizzle" });
  await migrationClient.end();
};
(async () => {
  await applyMigrations();
})().catch((err) => {
  console.error(err);
});

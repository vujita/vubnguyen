import type { Config } from "drizzle-kit";

export default {
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  driver: "pg",
  out: "drizzle",
  schema: "./src/schema.ts",
} satisfies Config;

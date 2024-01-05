import type { Config } from "drizzle-kit";

console.log("DATABASE_URL", process.env.DATABASE_URL);
export default {
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  driver: "pg",
  out: "drizzle",
  schema: "./src/schema.ts",
} satisfies Config;

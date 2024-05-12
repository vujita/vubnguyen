import { type Config } from "drizzle-kit";

export default {
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  dialect: "postgresql",
  out: "drizzle",
  schema: "./src/schema.ts",
} satisfies Config;

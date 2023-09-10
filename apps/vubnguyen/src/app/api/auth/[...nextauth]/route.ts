import { handlers } from "@vujita/auth";

// TODO: Revisit typing
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const GET = handlers;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const POST = handlers;

// @note If you wanna enable edge runtime, either
// - https://auth-docs-git-feat-nextjs-auth-authjs.vercel.app/guides/upgrade-to-v5#edge-compatibility
// - swap prisma for kysely / drizzle
// export const runtime = "edge";

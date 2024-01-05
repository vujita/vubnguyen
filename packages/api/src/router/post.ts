import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db, schema } from "@vujita/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  all: publicProcedure.query(() => {
    return db.query.post.findMany({ orderBy: [desc(schema.post.id)] });
  }),
  create: publicProcedure
    .input(
      z.object({
        content: z.string().min(1),
        title: z.string().min(1),
      }),
    )
    .mutation(({ input }) => {
      return db.insert(schema.post).values(input);
    }),
  delete: publicProcedure.input(z.string()).mutation(({ input }) => {
    return db.delete(schema.post).where(eq(schema.post.id, input));
  }),
});

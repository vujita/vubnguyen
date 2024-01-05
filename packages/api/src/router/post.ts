import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db, prisma, schema } from "@vujita/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  all: publicProcedure.query(() => {
    // return prisma.post.findMany({ orderBy: { id: "desc" } });
    return db.query.post.findMany({ orderBy: [desc(schema.post.id)] });
  }),
  byId: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    return prisma.post.findFirst({ where: { id: input.id } });
  }),
  create: publicProcedure
    .input(
      z.object({
        content: z.string().min(1),
        title: z.string().min(1),
      }),
    )
    .mutation(({ input }) => {
      return prisma.post.create({ data: input });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ input }) => {
    return db.delete(schema.post).where(eq(schema.post.id, input));
  }),
});

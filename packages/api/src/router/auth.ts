import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  getSecretMessage: protectedProcedure.query(() => {
    // testing type validation of overridden next-auth Session in @vujita/auth package
    return "you can see this secret message!";
  }),
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
});

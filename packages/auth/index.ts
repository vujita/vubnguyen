import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Discord from "next-auth/providers/discord";

import { prisma } from "@vujita/db";

import { env } from "./env.mjs";

export type { Session } from "next-auth";

// Update this whenever adding new providers so that the client can
export const providers = ["discord"] as const;
export type OAuthProviders = (typeof providers)[number];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),

    // @TODO - if you wanna have auth on the edge
    // jwt: ({ token, profile }) => {
    //   if (profile?.id) {
    //     token.id = profile.id;
    //     token.image = profile.picture;
    //   }
    //   return token;
    // },

    // @TODO
    // authorized({ request, auth }) {
    //   return !!auth?.user
    // }
  },
  providers: [
    Discord({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
};
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const handlers = NextAuth(authOptions);
export const auth = async () => getServerSession(authOptions);

import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "./password";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            password: true,
          },
        });

        if (!user?.password) return null;

        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) return null;

        const { password, ...safeUser } = user;
        return safeUser;
      },
    }),
  ],

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/login",
  },
};
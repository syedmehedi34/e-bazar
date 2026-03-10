// src/auth.ts
import NextAuth, { Session, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import User from "../models/User";
import dbConnect from "../lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await dbConnect();

          const user = await User.findOne({
            email: credentials.email.toLowerCase().trim(),
          });

          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password as string,
          );

          if (!isValid) return null;

          return {
            id: user._id.toString(),
            name: user.name || user.email.split("@")[0],
            email: user.email as string,
            role: (user.role as string) || "user",
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
    maxAge: 7 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as string;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.id) session.user.id = token.id as string;
      if (token?.role) session.user.role = token.role as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);

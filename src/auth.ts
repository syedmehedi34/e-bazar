/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { Session, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // ← এটা add করো
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import User from "../models/User";
import dbConnect from "../lib/mongodb";

export const authOptions = {
  providers: [
    // ── Google Provider ──────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Credentials Provider (আগেরটা ঠিকই আছে) ─────
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
    // signIn callback একদম সরল রাখো
    async signIn({ account }: { user: NextAuthUser; account: any }) {
      if (account?.provider === "google") return true;
      return true;
    },

    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user?: NextAuthUser;
      account?: any;
    }) {
      // Credentials login
      if (user && account?.provider === "credentials") {
        token.id = user.id;
        token.role = (user.role as string) || "user";
        return token;
      }

      // Google login — একটাই operation এ find অথবা create
      if (account?.provider === "google") {
        try {
          await dbConnect();

          const dbUser = await User.findOneAndUpdate(
            { email: token.email }, // email দিয়ে খোঁজো
            {
              $setOnInsert: {
                name: token.name,
                email: token.email,
                photo: token.picture, // Google profile photo
                role: "user",
                password: null,
              },
            },
            {
              upsert: true, // না থাকলে create করো
              new: true, // created/updated doc return করো
              runValidators: false, // validation skip করো
            },
          );

          token.id = dbUser._id.toString(); // MongoDB _id token এ set করো
          token.role = dbUser.role || "user";

          console.log("✅ Google user saved:", dbUser.email, dbUser._id);
        } catch (error) {
          console.error("❌ JWT Google upsert error:", error);
        }
        return token;
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

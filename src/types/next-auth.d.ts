import "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string;
    photo?: string;
  }
  interface Session {
    user: {
      id: string;
      role: string;
      photo?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    photo?: string;
  }
}

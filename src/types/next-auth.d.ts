import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    photo?: string;
    mobileNumber?: string;
    fullAddress?: string;
    wishList?: string[];
  }
  interface Session {
    user: {
      id: string;
      role: string;
      photo?: string;
      mobileNumber?: string;
      fullAddress?: string;
      wishList?: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    photo?: string;
    mobileNumber?: string;
    fullAddress?: string;
    wishList?: string[];
  }
}

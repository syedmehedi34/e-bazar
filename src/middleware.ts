import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;
  const { pathname } = req.nextUrl;

  // ==================== PREVENT LOGGED IN USER FROM AUTH PAGES ====================
  if (
    isLoggedIn &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // ==================== ADMIN ONLY ====================
  // if (pathname.startsWith("/dashboard/admin")) {
  //   if (!isLoggedIn || userRole !== "admin") {
  //     return NextResponse.redirect(new URL("/login", req.nextUrl));
  //   }
  // }

  // ==================== USER DASHBOARD ====================
  // if (pathname.startsWith("/dashboard") && !isLoggedIn) {
  //   return NextResponse.redirect(new URL("/login", req.nextUrl));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/profile/:path*"],
};

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;
    if (!token) {
        const redirectUrl = new URL("/auth/login", req.url);
        redirectUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment", "/orderSummary","/my_orders", "/user_profile"],
};

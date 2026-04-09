// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";

/* ── GET /api/users ──────────────────────────────────────
   Admin only.
   Query params:
     search → name or email (case-insensitive)
     role → "user" | "admin"
   (Pagination removed - returns all matching users)
──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!session.user.role?.includes("admin"))
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search")?.trim() ?? "";
    const role = searchParams.get("role") ?? "";

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) filter.role = role;

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments(filter);

    return NextResponse.json(
      {
        users,
        total,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/users", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

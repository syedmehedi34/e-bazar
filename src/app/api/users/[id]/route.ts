// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error("Get user error:", err.message);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

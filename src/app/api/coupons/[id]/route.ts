// src/app/api/coupons/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "../../../../../lib/mongodb";
import Coupon from "../../../../../models/Coupon";

/* ── GET /api/coupons/[id] ── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.role?.includes("admin"))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const coupon = await Coupon.findById(id).lean();
  if (!coupon)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ coupon }, { status: 200 });
}

/* ── PATCH /api/coupons/[id] ── */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.role?.includes("admin"))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  // Protect immutable fields
  const IMMUTABLE = new Set([
    "_id",
    "createdAt",
    "createdBy",
    "usedCount",
    "usageRecords",
  ]);
  const update: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (!IMMUTABLE.has(k)) update[k] = v;
  }

  const updated = await Coupon.findByIdAndUpdate(
    id,
    { $set: update },
    { returnDocument: "after", runValidators: true },
  ).lean();
  if (!updated)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json(
    { message: "Coupon updated", coupon: updated },
    { status: 200 },
  );
}

/* ── DELETE /api/coupons/[id] ── */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.role?.includes("admin"))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const deleted = await Coupon.findByIdAndDelete(id);
  if (!deleted)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json({ message: "Coupon deleted" }, { status: 200 });
}

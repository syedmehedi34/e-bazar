// src/app/api/coupons/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "../../../../lib/mongodb";
import Coupon from "../../../../models/Coupon";

/* ── GET /api/coupons ─────────────────────────────────────
   Admin → all coupons with filters
   Public → validate a single coupon (pass ?code=XXX&userId=&subtotal=)
──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = req.nextUrl;

  // ── Public: validate coupon at checkout ──────────────────
  const code = searchParams.get("code");
  const userId = searchParams.get("userId");
  const subtotal = searchParams.get("subtotal");

  if (code && userId && subtotal) {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon)
      return NextResponse.json(
        { message: "Coupon not found" },
        { status: 404 },
      );

    const { allowed, reason } = coupon.canUserUse(userId, Number(subtotal));
    if (!allowed)
      return NextResponse.json({ message: reason }, { status: 400 });

    const discount = coupon.calcDiscount(Number(subtotal));
    return NextResponse.json(
      {
        coupon: {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          maxDiscountAmount: coupon.maxDiscountAmount,
          buyQuantity: coupon.buyQuantity,
          getQuantity: coupon.getQuantity,
          freeShipping: coupon.type === "free_shipping",
        },
        discount,
      },
      { status: 200 },
    );
  }

  // ── Admin: list all coupons ───────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session?.user?.role?.includes("admin"))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const search = searchParams.get("search") ?? "";
  const isActive = searchParams.get("isActive");
  const type = searchParams.get("type") ?? "";

  const filter: Record<string, unknown> = {};
  if (search) filter.code = { $regex: search, $options: "i" };
  if (type) filter.type = type;
  if (isActive !== null && isActive !== "")
    filter.isActive = isActive === "true";

  const coupons = await Coupon.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ coupons }, { status: 200 });
}

/* ── POST /api/coupons ────────────────────────────────── */
export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.role?.includes("admin"))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = await req.json();

  if (!body.code || !body.type || body.value === undefined)
    return NextResponse.json(
      { message: "code, type and value are required" },
      { status: 400 },
    );

  const exists = await Coupon.findOne({ code: body.code.toUpperCase() });
  if (exists)
    return NextResponse.json(
      { message: "Coupon code already exists" },
      { status: 409 },
    );

  const coupon = await Coupon.create({ ...body, createdBy: session.user.id });
  return NextResponse.json(
    { message: "Coupon created", coupon },
    { status: 201 },
  );
}

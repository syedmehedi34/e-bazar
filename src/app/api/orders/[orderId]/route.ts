// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "../../../../../lib/mongodb";
import Order from "../../../../../models/Order";

/* ── GET /api/orders/[orderId] ─────────────────────────── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  await dbConnect();
  const { orderId } = await params;
  const order = await Order.findOne({ orderId }).lean();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order }, { status: 200 });
}

/* ── PATCH /api/orders/[orderId] — admin only ──────────── */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role?.includes("admin");
    if (!isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { orderId } = await params;
    const body = await req.json();

    const ALLOWED = [
      "orderStatus",
      "paymentStatus",
      "note",
      "deliveryAddress",
      "items",
    ] as const;
    const update: Record<string, unknown> = {};

    for (const field of ALLOWED) {
      if (field in body && body[field] !== undefined) {
        update[field] = body[field];
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 },
      );
    }

    // Validate enums
    const validOrderStatus = [
      "processing",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    const validPaymentStatus = ["cod_pending", "pending", "paid", "failed"];

    if (
      update.orderStatus &&
      !validOrderStatus.includes(update.orderStatus as string)
    ) {
      return NextResponse.json(
        { message: "Invalid orderStatus" },
        { status: 400 },
      );
    }
    if (
      update.paymentStatus &&
      !validPaymentStatus.includes(update.paymentStatus as string)
    ) {
      return NextResponse.json(
        { message: "Invalid paymentStatus" },
        { status: 400 },
      );
    }

    // If items changed → recalculate pricing.subtotal and pricing.total
    if (update.items && Array.isArray(update.items)) {
      const existing = (await Order.findOne({ orderId }).lean()) as {
        pricing: { shippingCharge: number; couponDiscount: number };
      } | null;

      if (!existing) {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 },
        );
      }

      const newSubtotal = (update.items as { subtotal: number }[]).reduce(
        (sum, it) => sum + (it.subtotal ?? 0),
        0,
      );
      const newTotal =
        newSubtotal +
        existing.pricing.shippingCharge -
        (existing.pricing.couponDiscount ?? 0);

      update["pricing.subtotal"] = newSubtotal;
      update["pricing.total"] = newTotal;
    }

    const updated = await Order.findOneAndUpdate(
      { orderId },
      { $set: update },
      { new: true, runValidators: true },
    ).lean();

    if (!updated) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Order updated successfully",
      order: updated,
    });
  } catch (error) {
    console.error("[PATCH /api/orders/[orderId]]", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 },
    );
  }
}

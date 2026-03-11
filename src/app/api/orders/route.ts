// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dbConnect from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

export async function POST(req: NextRequest) {
  await dbConnect();
  console.log("object");

  const body = await req.json();
  const { items, deliveryAddress, paymentMethod, pricing, note } = body;

  // ── Basic server-side validation ──
  if (!items?.length)
    return NextResponse.json({ error: "No items" }, { status: 400 });
  if (!deliveryAddress)
    return NextResponse.json({ error: "No address" }, { status: 400 });
  if (!paymentMethod)
    return NextResponse.json({ error: "No payment method" }, { status: 400 });

  // ── Optional: attach logged-in user ──
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  // ── Create order ──
  const order = await Order.create({
    userId,
    items,
    deliveryAddress,
    paymentMethod,
    pricing,
    note: note ?? null,
    paymentStatus: paymentMethod === "cod" ? "cod_pending" : "pending",
    orderStatus: "processing",
  });

  // ── COD: no gateway needed, return orderId directly ──
  return NextResponse.json(
    { orderId: order.orderId, message: "Order placed successfully" },
    { status: 201 },
  );
}

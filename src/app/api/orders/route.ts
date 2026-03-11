import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { initiateSSLCommerz } from "@/lib/sslcommerz";
import dbConnect from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `EB-${date}-${random}`;
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const { items, deliveryAddress, paymentMethod, pricing, note } = body;

  // Basic validation
  if (!items?.length)
    return NextResponse.json({ error: "No items" }, { status: 400 });
  if (!deliveryAddress)
    return NextResponse.json({ error: "No address" }, { status: 400 });
  if (!paymentMethod)
    return NextResponse.json({ error: "No payment method" }, { status: 400 });

  // Attach logged-in user if available
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  // Create order in DB
  const order = await Order.create({
    orderId: generateOrderId(),
    userId,
    items,
    deliveryAddress,
    paymentMethod,
    pricing,
    note: note ?? null,
    paymentStatus: paymentMethod === "cod" ? "cod_pending" : "pending",
    orderStatus: "processing",
  });

  // ── COD: return directly ──
  if (paymentMethod === "cod") {
    return NextResponse.json(
      { orderId: order.orderId, redirect: null },
      { status: 201 },
    );
  }

  // ── SSLCommerz: get gateway URL ──
  if (paymentMethod === "sslcommerz") {
    const gatewayUrl = await initiateSSLCommerz(order);
    return NextResponse.json(
      { orderId: order.orderId, redirect: gatewayUrl },
      { status: 201 },
    );
  }

  return NextResponse.json(
    { error: "Unknown payment method" },
    { status: 400 },
  );
}

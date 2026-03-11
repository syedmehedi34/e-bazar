// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb";
import Order from "../../../../../models/Order";

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

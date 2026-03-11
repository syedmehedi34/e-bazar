import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../../lib/mongodb";
import Order from "../../../../../../models/Order";

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.formData();
  const data = Object.fromEntries(body) as Record<string, string>;

  console.log("🚫 SSLCommerz CANCEL callback:", data);

  await Order.findOneAndUpdate(
    { orderId: data.tran_id },
    { paymentStatus: "pending", gatewayData: data },
  );

  // User cancel করলে checkout এ ফেরত পাঠাও
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?cancelled=true`,
    { status: 303 },
  );
}

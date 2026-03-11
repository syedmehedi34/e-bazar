import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../../lib/mongodb";
import Order from "../../../../../../models/Order";

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.formData();
  const data = Object.fromEntries(body) as Record<string, string>;

  console.log("❌ SSLCommerz FAIL callback:", data);

  await Order.findOneAndUpdate(
    { orderId: data.tran_id },
    { paymentStatus: "failed", gatewayData: data },
  );

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed?id=${data.tran_id}`,
    { status: 303 },
  );
}

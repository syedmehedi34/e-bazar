import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../../lib/mongodb";
import Order from "../../../../../../models/Order";

export async function POST(req: NextRequest) {
  await dbConnect();

  // SSLCommerz sends form data (not JSON)
  const body = await req.formData();
  const data = Object.fromEntries(body) as Record<string, string>;

  console.log("✅ SSLCommerz SUCCESS callback:", data);

  const { tran_id, val_id, status, amount } = data;

  if (status === "VALID" || status === "VALIDATED") {
    await Order.findOneAndUpdate(
      { orderId: tran_id },
      {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        transactionId: val_id,
        gatewayData: data,
      },
    );

    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?id=${tran_id}`,
      { status: 303 },
    );
  }

  // Payment not valid
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed?id=${tran_id}`,
    { status: 303 },
  );
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "../../../../../../lib/mongodb";
import Order from "../../../../../../models/Order";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }
  //
  //
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("❌ Stripe webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await dbConnect();
  console.log("⚡ Stripe webhook event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    console.log("🔍 orderId from metadata:", orderId);

    if (!orderId) {
      return NextResponse.json({ error: "No orderId" }, { status: 400 });
    }

    const updated = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        transactionId: session.payment_intent as string,
        gatewayData: {
          sessionId: session.id,
          paymentIntent: session.payment_intent,
          amountTotal: session.amount_total,
          currency: session.currency,
        },
      },
      { new: true },
    );

    console.log(
      "✅ Order updated:",
      updated?.orderId,
      "→",
      updated?.paymentStatus,
    );
  }

  return NextResponse.json({ received: true });
}

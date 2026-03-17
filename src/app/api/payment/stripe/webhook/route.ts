/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "../../../../../../lib/mongodb";
import Order from "../../../../../../models/Order";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const body = await req.text();

  // Stripe signature header
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("No stripe-signature header received");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook Error: Invalid signature", details: err.message },
      { status: 400 },
    );
  }

  // Database connect
  await dbConnect();

  console.log("Stripe webhook event received:", event.type);

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    console.log("Order ID from metadata:", orderId);

    if (!orderId) {
      console.error("No orderId found in metadata");
      return NextResponse.json(
        { error: "No orderId in metadata" },
        { status: 400 },
      );
    }

    try {
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

      if (updated) {
        console.log(
          "Order updated successfully:",
          updated.orderId,
          "→",
          updated.paymentStatus,
        );
      } else {
        console.warn("No order found to update for ID:", orderId);
      }
    } catch (dbErr: any) {
      console.error("Database update error in webhook:", dbErr.message);
      // DB error হলেও Stripe-কে 200 দিতে হবে (retry avoid করতে)
    }
  }

  // Stripe-কে acknowledge করো
  return NextResponse.json({ received: true });
}

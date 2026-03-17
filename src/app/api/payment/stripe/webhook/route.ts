import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "../../../../../../lib/mongodb";
import Order from "../../../../../../models/Order";

export const runtime = "nodejs";

// Stripe initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any, // latest stable, adjust if needed
});

// IMPORTANT: Disable body parsing for this route (raw body দরকার)
export const config = {
  api: {
    bodyParser: false, // ← এটা মূল ফিক্স! Vercel/Next.js body parse করবে না
  },
};

export async function POST(req: NextRequest) {
  // Get raw body as text (string)
  const body = await req.text();

  // Get signature from header
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("No stripe-signature header");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Use raw body + signature to verify
    event = stripe.webhooks.constructEvent(
      body, // raw string
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

  // DB connect
  await dbConnect();

  console.log("Stripe webhook event received:", event.type);

  // Handle specific event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    console.log("Order ID from metadata:", orderId);

    if (!orderId) {
      console.error("No orderId in metadata");
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
        console.warn("Order not found for update:", orderId);
      }
    } catch (dbErr) {
      console.error("Database update failed:", dbErr);
      // Still return 200 to Stripe — don't let DB error block webhook ack
    }
  }

  // Always return 200 OK to acknowledge receipt (Stripe retry করবে না)
  return NextResponse.json({ received: true });
}

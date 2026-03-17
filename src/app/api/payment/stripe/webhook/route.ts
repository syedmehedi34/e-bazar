/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "../../../../../../lib/mongodb";
import Order from "../../../../../../models/Order";

// Force Node.js runtime — required for Stripe webhook signature verification.
// The Edge runtime does not support the crypto APIs Stripe uses internally.
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POST /api/payment/stripe/webhook
 *
 * Receives events from Stripe and updates orders in the database.
 *
 * IMPORTANT — Two different webhook secrets:
 *   • Local dev  → secret printed by `stripe listen` CLI (whsec_cli_...)
 *   • Production → secret from Stripe Dashboard → Webhooks → your endpoint
 *
 * Make sure STRIPE_WEBHOOK_SECRET in Vercel env matches the Dashboard secret,
 * NOT the CLI secret. A mismatch causes every webhook to return 400.
 */
export async function POST(req: NextRequest) {
  // Read the raw request body as text.
  // Stripe signature verification requires the exact original bytes —
  // parsing the body as JSON first would break the HMAC check.
  const rawBody = await req.text();

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("[Stripe Webhook] Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  // ── Verify webhook signature ──────────────────────────────────────────────
  // This confirms the request genuinely came from Stripe and was not tampered with.
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    // Signature mismatch almost always means the wrong STRIPE_WEBHOOK_SECRET
    // is set in Vercel environment variables. Check the Dashboard webhook secret.
    console.error(
      "[Stripe Webhook] Signature verification failed:",
      err.message,
    );
    return NextResponse.json(
      { error: "Invalid signature", details: err.message },
      { status: 400 },
    );
  }

  console.log("[Stripe Webhook] Event received:", event.type);

  // Connect to MongoDB before any DB operations
  await dbConnect();

  // ── Route events to their handlers ───────────────────────────────────────
  switch (event.type) {
    case "checkout.session.completed": {
      await handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session,
      );
      break;
    }

    case "checkout.session.expired": {
      // Payment page expired without the user completing payment
      const expiredSession = event.data.object as Stripe.Checkout.Session;
      const orderId = expiredSession.metadata?.orderId;

      if (orderId) {
        await Order.findOneAndUpdate(
          { orderId },
          { paymentStatus: "failed", orderStatus: "cancelled" },
        );
        console.log(
          "[Stripe Webhook] Session expired — order cancelled:",
          orderId,
        );
      }
      break;
    }

    default:
      // Unhandled event types — safe to ignore
      console.log("[Stripe Webhook] Unhandled event type:", event.type);
  }

  // Always return 200 to Stripe to acknowledge receipt.
  // If we return a non-2xx status, Stripe will keep retrying the webhook.
  return NextResponse.json({ received: true }, { status: 200 });
}

// ── Handler: checkout.session.completed ──────────────────────────────────────

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    // This should never happen if initiateStripe() always sets the metadata
    console.error(
      "[Stripe Webhook] checkout.session.completed received with no orderId in metadata",
    );
    return;
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        // payment_intent is the unique ID for the actual charge — useful for refunds
        transactionId: session.payment_intent as string,
        // Store raw gateway data for auditing / support queries
        gatewayData: {
          sessionId: session.id,
          paymentIntent: session.payment_intent,
          amountTotal: session.amount_total, // in cents
          currency: session.currency,
        },
      },
      , // return the updated document
    );

    if (updatedOrder) {
      console.log(
        "[Stripe Webhook] Order marked as paid:",
        updatedOrder.orderId,
      );
    } else {
      // The order might not exist yet if there is a race condition between
      // the checkout creation and the webhook arrival — monitor these warnings.
      console.warn("[Stripe Webhook] No order found for orderId:", orderId);
    }
  } catch (dbErr: any) {
    // Log the DB error but do NOT return a non-200 response.
    // Returning 500 here would cause Stripe to retry, potentially marking
    // the order as paid multiple times if a later retry succeeds.
    console.error("[Stripe Webhook] DB update failed:", dbErr.message);
  }
}

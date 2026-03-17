import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface OrderPayload {
  orderId: string;
  pricing: {
    total: number;
    shippingCharge: number;
    subtotal: number;
    couponDiscount: number;
  };
  items: {
    title: string;
    image: string;
    unitPrice: number;
    quantity: number;
  }[];
  deliveryAddress: {
    fullName: string;
    phone: string;
  };
}

/**
 * Creates a Stripe Checkout Session and returns the hosted payment URL.
 * The orderId is stored in session metadata so the webhook can identify
 * and update the correct order after payment succeeds.
 */
export async function initiateStripe(order: OrderPayload): Promise<string> {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;

  // Build line items — one entry per product in the cart
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    order.items.map((item) => ({
      price_data: {
        currency: "usd",
        // Stripe expects amounts in the smallest currency unit (cents)
        unit_amount: Math.round(item.unitPrice * 100),
        product_data: {
          name: item.title,
          // Only pass absolute URLs — local paths cause Stripe to reject the session
          images: [item.image].filter(
            (img) => typeof img === "string" && img.startsWith("http"),
          ),
        },
      },
      quantity: item.quantity,
    }));

  // If a coupon was applied, add a negative line item to show the discount
  if (order.pricing.couponDiscount > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: -Math.round(order.pricing.couponDiscount * 100),
        product_data: { name: "Coupon Discount" },
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,

    // Shipping charge is handled as a shipping_option so it appears separately
    // on the Stripe-hosted checkout page
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: Math.round(order.pricing.shippingCharge * 100),
            currency: "usd",
          },
          display_name: "Standard Delivery",
        },
      },
    ],

    // Store the orderId in metadata — the webhook reads this to update the DB
    metadata: {
      orderId: order.orderId,
    },

    // Redirect the user here after a successful payment
    success_url: `${base_url}/order-success?id=${order.orderId}`,

    // Redirect the user here if they close/cancel the checkout page
    cancel_url: `${base_url}/checkout?cancelled=true`,
  });

  // session.url is the hosted Stripe Checkout page URL
  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  return session.url;
}

/*
  Local webhook testing:
    stripe listen --forward-to localhost:3000/api/payment/stripe/webhook

  Events to enable in Stripe Dashboard (Production Webhook):
    - checkout.session.completed
    - checkout.session.expired
    - payment_intent.payment_failed
*/

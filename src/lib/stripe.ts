import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function initiateStripe(order: {
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
  deliveryAddress: { fullName: string; phone: string };
}) {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;

  // ── Line items: প্রতিটা product আলাদা ──
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    order.items.map((item) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.unitPrice * 100), // Stripe paisa তে নেয়
        product_data: {
          name: item.title,
          images: [item.image].filter((img) => img?.startsWith("http")), // local image দিলে error হয়
        },
      },
      quantity: item.quantity,
    }));

  // ── Coupon discount থাকলে আলাদা line item ──
  if (order.pricing.couponDiscount > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: -Math.round(order.pricing.couponDiscount * 100), // negative = discount
        product_data: { name: "Coupon Discount" },
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,

    // ── Shipping charge ──
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

    // ── Customer info pre-fill ──
    customer_email: undefined, // email থাকলে এখানে দাও
    phone_number_collection: { enabled: false },

    // ── orderId metadata তে রাখো — webhook এ দরকার হবে ──
    metadata: {
      orderId: order.orderId,
    },

    // ── Redirect URLs ──
    success_url: `${base_url}/order-success?id=${order.orderId}`,
    cancel_url: `${base_url}/checkout?cancelled=true`,
  });

  return session.url!;
}
// stripe listen --forward-to localhost:3000/api/payment/stripe/webhook
// enabled-events=
// checkout.session.completed,
// checkout.session.expired
// invoice.payment_succeeded
// payment_intent.payment_failed

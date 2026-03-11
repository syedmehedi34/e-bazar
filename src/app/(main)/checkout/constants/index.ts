import { PaymentOption } from "../types";

export const SHIPPING_INSIDE_DHAKA = 60;
export const SHIPPING_OUTSIDE_DHAKA = 120;

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "cod",
    label: "Cash on Delivery",
    logo: "💵",
    desc: "Pay when you receive",
    badge: "Most Popular",
  },
  {
    id: "sslcommerz",
    label: "SSLCommerz",
    logo: "/payment/ssl.png",
    desc: "All BD cards, bKash, Nagad, Rocket",
    badge: "All BD Methods",
  },
  {
    id: "stripe",
    label: "Stripe",
    logo: "/payment/stripe.png",
    desc: "Visa / Mastercard / Amex",
    badge: "International",
  },
  // {
  //   id: "paypal",
  //   label: "PayPal",
  //   logo: "/payment/paypal.png",
  //   desc: "Fast & secure global payments",
  //   badge: "International",
  // },
];

export const fmt = (n: number) => `৳${n.toLocaleString("en-BD")}`;

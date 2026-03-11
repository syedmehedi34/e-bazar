"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  ShoppingBag,
  ArrowRight,
  Copy,
  Check,
  Truck,
  Phone,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { removeAllFromCart } from "@/redux/feature/addToCart/addToCart";
import { clearBuyNowItem } from "@/redux/feature/buyNow/buyNow";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface OrderData {
  orderId: string;
  paymentMethod: "cod" | "sslcommerz" | "stripe";
  paymentStatus: string;
  orderStatus: string;
  items: {
    productId: string;
    title: string;
    brand?: string;
    image: string;
    selectedSize?: string | null;
    selectedColor?: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    altPhone?: string;
    division: string;
    district: string;
    upazila: string;
    address: string;
    addressType: string;
  };
  pricing: {
    subtotal: number;
    shippingCharge: number;
    couponDiscount: number;
    total: number;
  };
  note?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const fmt = (n: number) => `৳${n.toLocaleString("en-BD")}`;

function estimatedDelivery(division: string, createdAt: string): string {
  const base = new Date(createdAt);
  const days = division === "Dhaka" ? 2 : 5;
  base.setDate(base.getDate() + days);
  return base.toLocaleDateString("en-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ─────────────────────────────────────────────
// Timeline Steps
// ─────────────────────────────────────────────
const TIMELINE = [
  { label: "Order Placed", icon: CheckCircle2, done: true },
  { label: "Confirmed", icon: Package, done: true },
  { label: "Out for Delivery", icon: Truck, done: false },
  { label: "Delivered", icon: CheckCircle2, done: false },
];

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const dispatch = useDispatch();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Cart + BuyNow clear ───────────────────
  // COD:        useCheckout এ already clear হয়েছে — আবার clear করলেও কোনো সমস্যা নেই
  // SSLCommerz: gateway থেকে ফিরে এখানেই clear হবে
  useEffect(() => {
    dispatch(removeAllFromCart());
    dispatch(clearBuyNowItem());
    sessionStorage.removeItem("buyNowItem");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch order from DB ───────────────────
  useEffect(() => {
    if (!orderId) {
      router.replace("/");
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(({ order }) => setOrder(order))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  const copyOrderId = async () => {
    if (!order) return;
    await navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading ───────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          <p className="text-sm text-gray-500">Loading your order...</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────
  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-lg font-bold text-gray-800">Order not found</p>
          <p className="text-sm text-gray-500">
            We couldn&apos;t find this order. Please check your order ID.
          </p>
          <Link
            href="/"
            className="inline-block mt-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-600 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isCOD = order.paymentMethod === "cod";
  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
  const eta = estimatedDelivery(
    order.deliveryAddress.division,
    order.createdAt,
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-5">
        {/* ── Hero confirmation card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-teal-400 to-emerald-400" />
          <div className="px-6 py-8 text-center">
            <div className="relative inline-flex mb-5">
              <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center ring-8 ring-teal-50/60 animate-[pulse_2s_ease-in-out_1]">
                <CheckCircle2
                  className="w-10 h-10 text-teal-500"
                  strokeWidth={1.5}
                />
              </div>
              <span className="absolute -top-1 -right-1 text-2xl animate-bounce">
                🎉
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Order Placed!
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Thank you,{" "}
              <span className="font-semibold text-gray-700">
                {order.deliveryAddress.fullName}
              </span>
              !{" "}
              {isCOD
                ? "Your order is confirmed. Please keep ৳ ready for delivery."
                : "Your payment was successful."}
            </p>

            {/* Order ID chip */}
            <div className="mt-5 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3">
              <div className="text-left">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Order ID
                </p>
                <p className="text-base font-bold text-gray-800 font-mono tracking-wide">
                  {order.orderId}
                </p>
              </div>
              <button
                onClick={copyOrderId}
                className="ml-2 p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                title="Copy order ID"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-teal-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>

            {isCOD && (
              <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-amber-700">
                💵 Pay{" "}
                <span className="font-black">{fmt(order.pricing.total)}</span>{" "}
                when your order arrives
              </div>
            )}
          </div>
        </div>

        {/* ── Estimated delivery + Timeline ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Estimated Delivery
              </p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{eta}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {order.deliveryAddress.division === "Dhaka"
                  ? "1–2 business days (Inside Dhaka)"
                  : "4–5 business days (Outside Dhaka)"}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between relative">
            <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-gray-100 z-0" />
            <div className="absolute top-3.5 left-0 w-2/4 h-0.5 bg-teal-400 z-0" />
            {TIMELINE.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="relative z-10 flex flex-col items-center gap-1.5 flex-1"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all
                    ${step.done ? "bg-teal-500 border-teal-500" : "bg-white border-gray-200"}`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${step.done ? "text-white" : "text-gray-300"}`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold text-center leading-tight
                    ${step.done ? "text-teal-600" : "text-gray-400"}`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Ordered items ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-teal-500" />
              <h2 className="font-bold text-gray-900 text-sm">Your Items</h2>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="divide-y divide-gray-50">
            {order.items.map((item, idx) => (
              <div key={`${item.productId}-${idx}`} className="flex gap-3 p-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {item.title}
                  </p>
                  {item.brand && (
                    <p className="text-xs text-gray-400">{item.brand}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.selectedColor && (
                      <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {item.selectedColor}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Size: {item.selectedSize}
                      </span>
                    )}
                    <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      ×{item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">
                    {fmt(item.subtotal)}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {fmt(item.unitPrice)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price summary */}
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span>{fmt(order.pricing.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Delivery</span>
              <span>{fmt(order.pricing.shippingCharge)}</span>
            </div>
            {order.pricing.couponDiscount > 0 && (
              <div className="flex justify-between text-xs text-teal-600">
                <span>Coupon Discount</span>
                <span>-{fmt(order.pricing.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-200">
              <span>
                Total{" "}
                {isCOD && (
                  <span className="font-normal text-amber-600 text-xs">
                    (Pay on delivery)
                  </span>
                )}
              </span>
              <span>{fmt(order.pricing.total)}</span>
            </div>
          </div>
        </div>

        {/* ── Delivery address ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-teal-500" />
            <h2 className="font-bold text-gray-900 text-sm">
              Delivery Address
            </h2>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">
              {order.deliveryAddress.addressType === "home"
                ? "🏠"
                : order.deliveryAddress.addressType === "office"
                  ? "🏢"
                  : "📍"}
            </span>
            <div className="space-y-0.5">
              <p className="font-semibold text-gray-800">
                {order.deliveryAddress.fullName}
              </p>
              <p className="text-sm text-gray-600">
                {order.deliveryAddress.address}
              </p>
              <p className="text-sm text-gray-500">
                {order.deliveryAddress.upazila},{" "}
                {order.deliveryAddress.district},{" "}
                {order.deliveryAddress.division}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {order.deliveryAddress.phone}
                </span>
                {order.deliveryAddress.altPhone && (
                  <span className="text-sm text-gray-400">
                    / {order.deliveryAddress.altPhone}
                  </span>
                )}
              </div>
            </div>
          </div>
          {order.note && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
              📝 <span className="font-semibold">Delivery note:</span>{" "}
              {order.note}
            </div>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={`/dashboard/user/orders/${order.orderId}`}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 hover:bg-gray-800
                       text-white font-bold rounded-2xl transition-all shadow-lg shadow-gray-900/15 text-sm"
          >
            <Package className="w-4 h-4" />
            Track Order
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link
            href="/shopping"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-gray-50
                       text-gray-800 font-bold rounded-2xl transition-all border-2 border-gray-200
                       hover:border-teal-300 text-sm"
          >
            <ShoppingBag className="w-4 h-4 text-teal-500" />
            Continue Shopping
          </Link>
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-xs text-gray-400 pb-4">
          Order confirmation sent · Keep your Order ID{" "}
          <span className="font-mono font-bold text-gray-600">
            {order.orderId}
          </span>{" "}
          for reference
        </p>
      </div>
    </div>
  );
}

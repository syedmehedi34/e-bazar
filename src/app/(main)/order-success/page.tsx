"use client";

import { useEffect, useState, useRef } from "react";
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

const TIMELINE = [
  { label: "Placed", icon: CheckCircle2, done: true },
  { label: "Confirmed", icon: Package, done: true },
  { label: "Shipped", icon: Truck, done: false },
  { label: "Delivered", icon: CheckCircle2, done: false },
];

const MAX_POLL = 10;
const POLL_MS = 2000;

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const dispatch = useDispatch();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [polling, setPolling] = useState(false);
  const pollCount = useRef(0);

  useEffect(() => {
    dispatch(removeAllFromCart());
    dispatch(clearBuyNowItem());
    sessionStorage.removeItem("buyNowItem");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrder = async () => {
    if (!orderId) {
      router.replace("/");
      return;
    }
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Not found");
      const { order } = await res.json();
      setOrder(order);
      if (
        order.paymentMethod !== "cod" &&
        order.paymentStatus === "pending" &&
        pollCount.current < MAX_POLL
      ) {
        setPolling(true);
        pollCount.current += 1;
        setTimeout(fetchOrder, POLL_MS);
      } else {
        setPolling(false);
        setLoading(false);
      }
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const copyOrderId = async () => {
    if (!order) return;
    await navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || (polling && !order)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
          <p className="text-sm text-slate-400 font-medium">
            Loading your order...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="font-bold text-slate-800">Order not found</p>
          <p className="text-sm text-slate-400">
            We couldn&apos;t find this order.
          </p>
          <Link
            href="/"
            className="inline-block mt-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isPending =
    order.paymentMethod !== "cod" && order.paymentStatus === "pending";
  const isCOD = order.paymentMethod === "cod";
  const isPaid = order.paymentStatus === "paid";
  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
  const eta = estimatedDelivery(
    order.deliveryAddress.division,
    order.createdAt,
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        {/* ── Hero ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div
            className={`h-1 ${isPending ? "bg-amber-400" : "bg-emerald-500"}`}
          />
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 bg-emerald-50 border border-emerald-100">
              {isPending ? (
                <Loader2 className="w-7 h-7 text-amber-500 animate-spin" />
              ) : (
                <CheckCircle2
                  className="w-7 h-7 text-emerald-500"
                  strokeWidth={2}
                />
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isPending ? "Verifying Payment" : "Order Confirmed"}
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm leading-relaxed max-w-sm mx-auto">
              {isPending ? (
                "Hang tight — we're confirming your payment. This usually takes a few seconds."
              ) : isCOD ? (
                <>
                  Hey{" "}
                  <span className="font-semibold text-slate-700">
                    {order.deliveryAddress.fullName}
                  </span>
                  , your order is on its way! Pay on delivery.
                </>
              ) : (
                <>
                  Hey{" "}
                  <span className="font-semibold text-slate-700">
                    {order.deliveryAddress.fullName}
                  </span>
                  , payment received. Your order is confirmed!
                </>
              )}
            </p>

            {/* Order ID */}
            <div className="mt-5 inline-flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <div className="text-left">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Order ID
                </p>
                <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                  {order.orderId}
                </p>
              </div>
              <button
                onClick={copyOrderId}
                className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors ml-1"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            </div>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {isCOD && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  💵 Pay {fmt(order.pricing.total)} on delivery
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  ⏳ Waiting for confirmation...
                </span>
              )}
              {!isCOD && isPaid && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  ✓ {fmt(order.pricing.total)} paid
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Timeline ── */}
        {!isPending && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Estimated Delivery
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {eta}
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                {order.deliveryAddress.division === "Dhaka"
                  ? "1–2 days"
                  : "4–5 days"}
              </span>
            </div>

            <div className="flex items-start">
              {TIMELINE.map((step, i) => {
                const Icon = step.icon;
                const isLast = i === TIMELINE.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="flex items-center w-full">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2
                        ${step.done ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-200"}`}
                      >
                        <Icon
                          className={`w-2.5 h-2.5 ${step.done ? "text-white" : "text-slate-300"}`}
                        />
                      </div>
                      {!isLast && (
                        <div
                          className={`h-px flex-1 ${i < 1 ? "bg-emerald-500" : "bg-slate-200"}`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-semibold mt-1.5 ${step.done ? "text-emerald-600" : "text-slate-300"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Items ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">
                Your Items
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {order.items.map((item, idx) => (
              <div key={`${item.productId}-${idx}`} className="flex gap-3 p-4">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                    {item.title}
                  </p>
                  {item.brand && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.brand}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.selectedColor && (
                      <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                        {item.selectedColor}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                        Size {item.selectedSize}
                      </span>
                    )}
                    <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                      ×{item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-slate-900">
                    {fmt(item.subtotal)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {fmt(item.unitPrice)} ea.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal</span>
              <span>{fmt(order.pricing.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Delivery</span>
              <span>{fmt(order.pricing.shippingCharge)}</span>
            </div>
            {order.pricing.couponDiscount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600">
                <span>Discount</span>
                <span>-{fmt(order.pricing.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>
                Total{" "}
                {isCOD && (
                  <span className="font-normal text-amber-500 text-xs">
                    (on delivery)
                  </span>
                )}
              </span>
              <span>{fmt(order.pricing.total)}</span>
            </div>
          </div>
        </div>

        {/* ── Address ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">
              Delivery Address
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5 flex-shrink-0">
              {order.deliveryAddress.addressType === "home"
                ? "🏠"
                : order.deliveryAddress.addressType === "office"
                  ? "🏢"
                  : "📍"}
            </span>
            <div className="space-y-0.5 min-w-0">
              <p className="font-semibold text-slate-800 text-sm">
                {order.deliveryAddress.fullName}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                {order.deliveryAddress.address}
              </p>
              <p className="text-xs text-slate-400">
                {order.deliveryAddress.upazila},{" "}
                {order.deliveryAddress.district},{" "}
                {order.deliveryAddress.division}
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="text-xs text-slate-500">
                  {order.deliveryAddress.phone}
                </span>
                {order.deliveryAddress.altPhone && (
                  <span className="text-xs text-slate-400">
                    · {order.deliveryAddress.altPhone}
                  </span>
                )}
              </div>
            </div>
          </div>
          {order.note && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 leading-relaxed">
              📝 <span className="font-semibold">Note:</span> {order.note}
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        {!isPending && (
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/dashboard/user/orders/${order.orderId}`}
              className="flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-slate-700
                         text-white font-semibold rounded-xl transition-colors text-sm"
            >
              <Package className="w-4 h-4" />
              Track Order
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </Link>
            <Link
              href="/shopping"
              className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white hover:bg-slate-50
                         text-slate-700 font-semibold rounded-xl transition-all border border-slate-200
                         hover:border-slate-300 text-sm"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              Shop More
            </Link>
          </div>
        )}

        <p className="text-center text-xs text-slate-400 pb-2">
          Reference:{" "}
          <span className="font-mono font-semibold text-slate-500">
            {order.orderId}
          </span>
        </p>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import {
  Package,
  Truck,
  Tag,
  Banknote,
  CheckCircle2,
  X,
  ShieldCheck,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { OrderItem, PaymentMethod } from "@/app/(main)/checkout/types";
import { fmt, PAYMENT_OPTIONS } from "@/app/(main)/checkout/constants";

interface Props {
  orderItems: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  division: string;
  paymentMethod: PaymentMethod;
  couponCode: string;
  couponApplied: boolean;
  couponDiscount: number;
  setCouponCode: (v: string) => void;
  handleApplyCoupon: () => void;
  removeCoupon: () => void;
  handleSubmit: () => void;
  submitting: boolean;
}

export function OrderSummary({
  orderItems,
  subtotal,
  shipping,
  total,
  division,
  paymentMethod,
  couponCode,
  couponApplied,
  couponDiscount,
  setCouponCode,
  handleApplyCoupon,
  removeCoupon,
  handleSubmit,
  submitting,
}: Props) {
  const totalQty = orderItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      {/* ── Items list ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-teal-500" />
            <h2 className="font-bold text-gray-900 text-sm">Order Summary</h2>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {orderItems.length} {orderItems.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
          {orderItems.map((item, idx) => (
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
      </div>

      {/* ── Coupon ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" /> Coupon Code
        </p>

        {couponApplied ? (
          <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-semibold text-teal-700">
                {couponCode}
              </span>
              <span className="text-xs text-teal-600">
                -{fmt(couponDiscount)} off
              </span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              placeholder="Enter coupon code"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
            />
            <button
              onClick={handleApplyCoupon}
              className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all"
            >
              Apply
            </button>
          </div>
        )}
        <p className="text-[11px] text-gray-400 mt-1.5">
          Try <span className="font-mono font-bold text-gray-600">SAVE10</span>{" "}
          for 10% off
        </p>
      </div>

      {/* ── Price breakdown ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal ({totalQty} items)</span>
          <span className="text-gray-800 font-medium">{fmt(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1.5 text-gray-500">
            <Truck className="w-3.5 h-3.5" />
            Delivery
            {division && (
              <span className="text-[11px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">
                {division === "Dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
              </span>
            )}
          </span>
          <span className="text-gray-800 font-medium">{fmt(shipping)}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1.5 text-teal-600">
              <Tag className="w-3.5 h-3.5" /> Discount
            </span>
            <span className="text-teal-600 font-semibold">
              -{fmt(couponDiscount)}
            </span>
          </div>
        )}

        <div className="pt-3 border-t border-dashed border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-xl font-extrabold text-gray-900">
              {fmt(total)}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5 text-right">
            Inclusive of all taxes
          </p>
        </div>

        {/* Payment tag */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
          <Banknote className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500">
            via{" "}
            <span className="font-semibold text-gray-700">
              {PAYMENT_OPTIONS.find((o) => o.id === paymentMethod)?.label}
            </span>
          </span>
          <button
            onClick={() =>
              document
                .getElementById("payment-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="ml-auto text-[11px] text-teal-500 hover:underline flex items-center gap-0.5"
          >
            Change <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── CTA ── */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full relative overflow-hidden bg-gray-900 hover:bg-gray-800 disabled:opacity-60
                   disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all
                   flex items-center justify-center gap-2.5 text-base shadow-lg shadow-gray-900/20 group"
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-transparent
                        translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
        />
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Placing Order...
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5 text-teal-400" /> Place Order ·{" "}
            {fmt(total)}
          </>
        )}
      </button>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4">
        {["🔒 SSL Secured", "↩ Easy Returns", "✓ Verified"].map((t) => (
          <span key={t} className="text-[11px] text-gray-400">
            {t}
          </span>
        ))}
      </div>

      <p className="text-center text-[11px] text-gray-400">
        By placing your order, you agree to our{" "}
        <span className="text-teal-500 underline cursor-pointer hover:text-teal-600">
          Terms & Conditions
        </span>
      </p>
    </div>
  );
}

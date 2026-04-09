"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useCheckout } from "./hooks/useCheckout";
import { CheckoutSteps } from "@/Components/checkout/ui";
import { AddressForm } from "@/Components/checkout/AddressForm";
import { PaymentSection } from "@/Components/checkout/PaymentSection";
import { DeliveryNote } from "@/Components/checkout/DeliveryNote";
import { OrderSummary } from "@/Components/checkout/OrderSummary";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "cart";

  const {
    orderItems,
    address,
    paymentMethod,
    couponCode,
    couponApplied,
    couponDiscount,
    note,
    submitting,
    divisionNames,
    districtNames,
    upazilaNames,
    subtotal,
    shipping,
    total,
    setField,
    setPaymentMethod,
    setCouponCode,
    setNote,
    setAddress,
    handleApplyCoupon,
    removeCoupon,
    handleSubmit,
  } = useCheckout(mode);

  // Loading state
  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          <p className="text-sm text-gray-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[75px]">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-800 transition-colors" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Checkout
            </span>
            <span className="hidden sm:block text-gray-300">·</span>
            <span className="hidden sm:block text-sm text-gray-400">
              {orderItems.length} {orderItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div
            className="ml-auto flex items-center gap-1.5 text-xs text-gray-500
                          bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
            <span className="hidden sm:block">100% Secure Checkout</span>
            <span className="sm:hidden">Secure</span>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <CheckoutSteps current={1} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 xl:gap-8">
          {/* LEFT — Forms */}
          <div className="space-y-5">
            <AddressForm
              address={address}
              setField={setField}
              setAddress={setAddress}
              divisionNames={divisionNames}
              districtNames={districtNames}
              upazilaNames={upazilaNames}
            />
            <PaymentSection
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
            <DeliveryNote note={note} setNote={setNote} />
          </div>

          {/* RIGHT — Summary */}
          <OrderSummary
            orderItems={orderItems}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            division={address.division}
            paymentMethod={paymentMethod}
            couponCode={couponCode}
            couponApplied={couponApplied}
            couponDiscount={couponDiscount}
            setCouponCode={setCouponCode}
            handleApplyCoupon={handleApplyCoupon}
            removeCoupon={removeCoupon}
            handleSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}

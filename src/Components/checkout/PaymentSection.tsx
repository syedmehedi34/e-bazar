"use client";

import Image from "next/image";
import { CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";
import { SectionCard } from "./ui";
import { PaymentMethod } from "@/app/(main)/checkout/types";
import { PAYMENT_OPTIONS } from "@/app/(main)/checkout/constants";

interface Props {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
}

export function PaymentSection({ paymentMethod, setPaymentMethod }: Props) {
  const isRedirect = paymentMethod === "stripe" || paymentMethod === "paypal";
  const isSSL = paymentMethod === "sslcommerz";

  return (
    <SectionCard icon={CreditCard} title="Payment Method">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAYMENT_OPTIONS.map((opt) => {
          const isSelected = paymentMethod === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPaymentMethod(opt.id)}
              className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left
                ${
                  isSelected
                    ? "border-teal-500 bg-gradient-to-br from-teal-50 to-white shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
            >
              {opt.badge && (
                <span className="absolute -top-2.5 left-3 text-[10px] font-bold bg-teal-500 text-white px-2 py-0.5 rounded-full">
                  {opt.badge}
                </span>
              )}

              {/* Logo */}
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl bg-gray-50 border border-gray-100">
                {opt.logo.startsWith("/") ? (
                  <Image
                    src={opt.logo}
                    alt={opt.label}
                    width={28}
                    height={28}
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <span>{opt.logo}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold ${isSelected ? "text-teal-700" : "text-gray-800"}`}
                >
                  {opt.label}
                </p>
                <p className="text-xs text-gray-400 truncate">{opt.desc}</p>
              </div>

              {isSelected ? (
                <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Context notices */}
      {(isRedirect || isSSL) && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            {isRedirect
              ? `You'll be redirected to ${paymentMethod === "stripe" ? "Stripe" : "PayPal"} to complete payment securely.`
              : "Supports all BD debit/credit cards, bKash, Nagad, Rocket via SSLCommerz gateway."}
          </p>
        </div>
      )}
    </SectionCard>
  );
}

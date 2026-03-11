"use client";

import { CheckCircle2 } from "lucide-react";

// ── InputField ────────────────────────────────────────────
export function InputField({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
  icon?: React.ElementType;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-white border border-gray-200 rounded-xl py-3 pr-4 text-sm text-gray-800
                      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                      focus:border-teal-500 transition-all hover:border-gray-300
                      ${Icon ? "pl-10" : "pl-4"}`}
        />
      </div>
    </div>
  );
}

// ── SectionCard ───────────────────────────────────────────
export function SectionCard({
  icon: Icon,
  title,
  badge,
  children,
}: {
  icon: React.ElementType;
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
          <Icon className="w-4 h-4 text-teal-600" />
        </div>
        <h2 className="font-bold text-gray-900">{title}</h2>
        {badge && (
          <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── CheckoutSteps ─────────────────────────────────────────
export function CheckoutSteps({ current }: { current: number }) {
  const steps = ["Address", "Payment", "Review"];
  return (
    <div className="flex items-center gap-1 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-1 flex-1">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${
                i < current
                  ? "bg-teal-500 text-white"
                  : i === current
                    ? "bg-teal-500 text-white ring-4 ring-teal-100"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:block ${i <= current ? "text-teal-600" : "text-gray-400"}`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${i < current ? "bg-teal-400" : "bg-gray-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

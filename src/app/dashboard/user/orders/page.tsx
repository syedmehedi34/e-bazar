"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  Calendar,
  CreditCard,
  MapPin,
  RotateCcw,
  Eye,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useFetchOrders } from "@/hook/useFetchOrders";

// ── Types ────────────────────────────────────────────────────────
interface OrderItem {
  productId: string;
  title: string;
  brand?: string;
  image: string;
  selectedSize?: string | null;
  selectedColor?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    division: string;
    district: string;
    upazila: string;
    address: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  pricing: {
    subtotal: number;
    shippingCharge: number;
    couponDiscount: number;
    total: number;
  };
  note?: string;
  createdAt: string;
}

// ── Config ────────────────────────────────────────────────────────
const ORDER_STATUSES = [
  { value: "", label: "All Orders", icon: ShoppingBag, color: "text-gray-500" },
  {
    value: "processing",
    label: "Processing",
    icon: Clock,
    color: "text-amber-500",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-blue-500",
  },
  { value: "shipped", label: "Shipped", icon: Truck, color: "text-violet-500" },
  {
    value: "delivered",
    label: "Delivered",
    icon: Package,
    color: "text-teal-500",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
  },
];

const PAYMENT_METHODS = [
  { value: "", label: "All Methods" },
  { value: "cod", label: "Cash on Delivery" },
  { value: "sslcommerz", label: "SSLCommerz" },
  { value: "stripe", label: "Stripe" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "high", label: "Highest Total" },
  { value: "low", label: "Lowest Total" },
];

// ── Helper components ────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    processing: {
      label: "Processing",
      cls: "bg-amber-50  dark:bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-200  dark:border-amber-500/20",
    },
    confirmed: {
      label: "Confirmed",
      cls: "bg-blue-50   dark:bg-blue-500/10   text-blue-600   dark:text-blue-400   border-blue-200   dark:border-blue-500/20",
    },
    shipped: {
      label: "Shipped",
      cls: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20",
    },
    delivered: {
      label: "Delivered",
      cls: "bg-teal-50   dark:bg-teal-500/10   text-teal-600   dark:text-teal-400   border-teal-200   dark:border-teal-500/20",
    },
    cancelled: {
      label: "Cancelled",
      cls: "bg-red-50    dark:bg-red-500/10    text-red-600    dark:text-red-400    border-red-200    dark:border-red-500/20",
    },
    paid: {
      label: "Paid",
      cls: "bg-teal-50   dark:bg-teal-500/10   text-teal-600   dark:text-teal-400   border-teal-200   dark:border-teal-500/20",
    },
    pending: {
      label: "Pending",
      cls: "bg-amber-50  dark:bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-200  dark:border-amber-500/20",
    },
    cod_pending: {
      label: "COD Pending",
      cls: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20",
    },
    failed: {
      label: "Failed",
      cls: "bg-red-50    dark:bg-red-500/10    text-red-600    dark:text-red-400    border-red-200    dark:border-red-500/20",
    },
  };
  const { label, cls } = map[status] ?? {
    label: status,
    cls: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cls}`}
    >
      {label}
    </span>
  );
};

// Progress stepper for order tracking
const OrderProgress = ({ status }: { status: string }) => {
  const steps = ["processing", "confirmed", "shipped", "delivered"];
  const cancelled = status === "cancelled";
  const currentIdx = cancelled ? -1 : steps.indexOf(status);

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => {
        const done = !cancelled && i <= currentIdx;
        const current = !cancelled && i === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center
                              text-[10px] font-bold border-2 transition-all duration-300
                ${
                  done
                    ? "bg-teal-500 border-teal-500 text-white"
                    : cancelled
                      ? "bg-red-100 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 text-red-400"
                      : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400"
                }
                ${current ? "ring-2 ring-teal-500/30 ring-offset-1" : ""}`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-[9px] font-semibold capitalize hidden sm:block
                ${done ? "text-teal-500" : "text-gray-400"}`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 rounded-full transition-all duration-300
                ${!cancelled && i < currentIdx ? "bg-teal-500" : "bg-gray-200 dark:bg-gray-700"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Expandable order card
const OrderCard = ({ order }: { order: Order }) => {
  const [expanded, setExpanded] = useState(false);

  const paymentMethodLabel: Record<string, string> = {
    cod: "Cash on Delivery",
    sslcommerz: "SSLCommerz",
    stripe: "Stripe",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white dark:bg-gray-800
                 border border-gray-100 dark:border-gray-700/50
                 rounded-2xl overflow-hidden shadow-sm
                 hover:shadow-md dark:hover:shadow-black/20
                 transition-shadow duration-200"
    >
      {/* ── Card header ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between
                   gap-4 px-5 py-4 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Left: order info */}
        <div className="flex items-start sm:items-center gap-4">
          {/* First product thumbnail */}
          <div
            className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700
                          border border-gray-100 dark:border-gray-600 flex-shrink-0"
          >
            <Image
              src={order.items[0]?.image || ""}
              alt={order.items[0]?.title || ""}
              width={56}
              height={56}
              className="w-full h-full object-contain p-1"
            />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-gray-900 dark:text-white font-mono tracking-wide">
                {order.orderId}
              </span>
              <StatusBadge status={order.orderStatus} />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {order.items.length} item{order.items.length > 1 ? "s" : ""}
              {order.items.length > 1 && (
                <span className="text-gray-400">
                  {" "}
                  ·{" "}
                  {order.items
                    .slice(1)
                    .map((i) => i.title)
                    .join(", ")
                    .slice(0, 40)}
                  {order.items.length > 2 ? "…" : ""}
                </span>
              )}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <CreditCard size={10} />
                {paymentMethodLabel[order.paymentMethod] || order.paymentMethod}
              </span>
            </div>
          </div>
        </div>

        {/* Right: total + payment status + expand */}
        <div className="flex items-center gap-4 sm:flex-shrink-0">
          <div className="text-right">
            <p className="text-base font-extrabold text-gray-900 dark:text-white">
              ৳{order.pricing.total.toLocaleString()}
            </p>
            <StatusBadge status={order.paymentStatus} />
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400 flex-shrink-0"
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </div>

      {/* ── Expanded content ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 dark:border-gray-700/50 px-5 py-5 space-y-5">
              {/* Order progress */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                  Order Progress
                </p>
                <OrderProgress status={order.orderStatus} />
              </div>

              {/* Items list */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                  Items Ordered
                </p>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3
                                            bg-gray-50 dark:bg-gray-700/40
                                            rounded-xl p-3"
                    >
                      <div
                        className="w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-gray-700
                                      border border-gray-100 dark:border-gray-600 flex-shrink-0"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold text-gray-900 dark:text-white
                                      line-clamp-1"
                        >
                          {item.title}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-0.5">
                          {item.brand && (
                            <span className="text-[10px] text-teal-500 font-bold uppercase">
                              {item.brand}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-[10px] text-gray-400">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-[10px] text-gray-400">
                              Color: {item.selectedColor}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          ৳{item.subtotal.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {item.quantity} × ৳{item.unitPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom: address + pricing */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Delivery address */}
                <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    Delivery Address
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {order.deliveryAddress.fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                    <MapPin
                      size={11}
                      className="text-teal-500 flex-shrink-0 mt-0.5"
                    />
                    {order.deliveryAddress.address},{" "}
                    {order.deliveryAddress.upazila},{" "}
                    {order.deliveryAddress.district},{" "}
                    {order.deliveryAddress.division}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.deliveryAddress.phone}
                  </p>
                </div>

                {/* Pricing breakdown */}
                <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    Price Summary
                  </p>
                  {[
                    { label: "Subtotal", val: order.pricing.subtotal },
                    { label: "Shipping", val: order.pricing.shippingCharge },
                    {
                      label: "Discount",
                      val: -order.pricing.couponDiscount,
                      hide: !order.pricing.couponDiscount,
                    },
                  ]
                    .filter((r) => !r.hide)
                    .map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between text-xs text-gray-500 dark:text-gray-400"
                      >
                        <span>{row.label}</span>
                        <span className={row.val < 0 ? "text-teal-500" : ""}>
                          {row.val < 0 ? "-" : ""}৳
                          {Math.abs(row.val).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  <div
                    className="flex justify-between text-sm font-extrabold text-gray-900 dark:text-white
                                  border-t border-gray-200 dark:border-gray-600 pt-2"
                  >
                    <span>Total</span>
                    <span>৳{order.pricing.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Note */}
              {order.note && (
                <div
                  className="text-xs text-gray-500 dark:text-gray-400 bg-amber-50 dark:bg-amber-500/10
                                border border-amber-200 dark:border-amber-500/20 rounded-xl px-4 py-3"
                >
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    Note:{" "}
                  </span>
                  {order.note}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  href={`/order-success/${order.orderId}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold
                             bg-gray-100 dark:bg-gray-700
                             text-gray-700 dark:text-gray-200
                             hover:bg-gray-200 dark:hover:bg-gray-600
                             transition-all duration-200"
                >
                  <Eye size={13} /> View Details
                </Link>
                {order.orderStatus === "delivered" && (
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold
                               bg-teal-50 dark:bg-teal-500/10
                               text-teal-600 dark:text-teal-400
                               border border-teal-200 dark:border-teal-500/30
                               hover:bg-teal-100 dark:hover:bg-teal-500/20
                               transition-all duration-200"
                  >
                    <RotateCcw size={13} /> Return / Exchange
                  </button>
                )}
                {(order.orderStatus === "processing" ||
                  order.orderStatus === "confirmed") && (
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold
                               bg-red-50 dark:bg-red-500/10
                               text-red-500 dark:text-red-400
                               border border-red-200 dark:border-red-500/30
                               hover:bg-red-100 dark:hover:bg-red-500/20
                               transition-all duration-200"
                  >
                    <XCircle size={13} /> Cancel Order
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Main page ─────────────────────────────────────────────────────
const UserOrdersPage = () => {
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const { orders, total, ordersLoading, ordersError } = useFetchOrders({
    orderStatus: orderStatus || undefined,
    paymentMethod: paymentMethod || undefined,
    date: date || undefined,
  });

  // Client-side search + sort (since search is lightweight for user's own orders)
  const filtered = useMemo(() => {
    let result = [...(orders as Order[])];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.items.some((i) => i.title.toLowerCase().includes(q)) ||
          o.items.some((i) => i.brand?.toLowerCase().includes(q)),
      );
    }

    switch (sortBy) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "high":
        result.sort((a, b) => b.pricing.total - a.pricing.total);
        break;
      case "low":
        result.sort((a, b) => a.pricing.total - b.pricing.total);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    return result;
  }, [orders, search, sortBy]);

  const activeFilterCount = [orderStatus, paymentMethod, date].filter(
    Boolean,
  ).length;

  const clearFilters = () => {
    setOrderStatus("");
    setPaymentMethod("");
    setDate("");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 rubik">
      <div className="mx-auto px-4 py-5">
        {/* ── Page header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag size={13} className="text-teal-500" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500">
              My Account
            </p>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                My Orders
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {total} order{total !== 1 ? "s" : ""} placed
              </p>
            </div>
            <Link
              href="/shopping"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold
                         bg-teal-500 hover:bg-teal-600 text-white
                         shadow-sm shadow-teal-500/30 transition-all duration-200"
            >
              Continue Shopping <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* ── Status tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
          {ORDER_STATUSES.map((s) => {
            const Icon = s.icon;
            const active = orderStatus === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setOrderStatus(s.value)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl
                            text-xs font-bold whitespace-nowrap flex-shrink-0
                            transition-all duration-200 border
                  ${
                    active
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-sm"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700/50 hover:border-gray-300"
                  }`}
              >
                <Icon size={12} className={active ? "" : s.color} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* ── Search + filter bar ── */}
        <div className="flex gap-3 mb-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, product name, brand..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm
                         bg-white dark:bg-gray-800
                         border border-gray-100 dark:border-gray-700/50
                         text-gray-800 dark:text-gray-200
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:border-teal-500/60
                         transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm font-medium
                         bg-white dark:bg-gray-800
                         border border-gray-100 dark:border-gray-700/50
                         text-gray-700 dark:text-gray-200
                         focus:outline-none focus:border-teal-500/60
                         transition-all duration-200 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                        border transition-all duration-200
              ${
                showFilters || activeFilterCount > 0
                  ? "bg-teal-500 text-white border-teal-500 shadow-sm shadow-teal-500/30"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-gray-700/50 hover:border-gray-300"
              }`}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span
                className="w-4 h-4 rounded-full bg-white text-teal-600 text-[10px] font-black
                               flex items-center justify-center"
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Filter panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden mb-4"
            >
              <div
                className="bg-white dark:bg-gray-800
                              border border-gray-100 dark:border-gray-700/50
                              rounded-2xl p-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Payment method */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      Payment Method
                    </label>
                    <div className="relative">
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm
                                   bg-gray-50 dark:bg-gray-700
                                   border border-gray-100 dark:border-gray-600
                                   text-gray-700 dark:text-gray-200
                                   focus:outline-none focus:border-teal-500/60
                                   transition-all duration-200 cursor-pointer"
                      >
                        {PAYMENT_METHODS.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={13}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Exact date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      Order Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm
                                 bg-gray-50 dark:bg-gray-700
                                 border border-gray-100 dark:border-gray-600
                                 text-gray-700 dark:text-gray-200
                                 focus:outline-none focus:border-teal-500/60
                                 transition-all duration-200 cursor-pointer"
                    />
                  </div>

                  {/* Clear */}
                  <div className="flex items-end">
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold
                                   text-red-500 dark:text-red-400
                                   bg-red-50 dark:bg-red-500/10
                                   border border-red-200 dark:border-red-500/30
                                   hover:bg-red-100 dark:hover:bg-red-500/20
                                   transition-all duration-200 w-full justify-center"
                      >
                        <X size={13} /> Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results summary ── */}
        {(search || activeFilterCount > 0) && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Showing{" "}
            <span className="font-bold text-gray-900 dark:text-white">
              {filtered.length}
            </span>{" "}
            result{filtered.length !== 1 ? "s" : ""}
            {search && (
              <span>
                {" "}
                for <span className="text-teal-500">{search}</span>
              </span>
            )}
          </p>
        )}

        {/* ── Orders list ── */}
        {ordersLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : ordersError ? (
          <div className="text-center py-20">
            <XCircle
              size={40}
              className="mx-auto text-red-400 mb-3 opacity-50"
            />
            <p className="text-sm font-medium text-gray-500">
              Failed to load orders.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 space-y-3"
          >
            <ShoppingBag
              size={48}
              className="mx-auto text-gray-200 dark:text-gray-700"
            />
            <p className="text-base font-bold text-gray-700 dark:text-gray-300">
              No orders found
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {activeFilterCount > 0 || search
                ? "Try adjusting your filters or search."
                : "You haven't placed any orders yet."}
            </p>
            {(activeFilterCount > 0 || search) && (
              <button
                onClick={clearFilters}
                className="text-sm font-bold text-teal-500 hover:underline mt-2"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((order) => (
                <OrderCard key={order._id} order={order as Order} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserOrdersPage;

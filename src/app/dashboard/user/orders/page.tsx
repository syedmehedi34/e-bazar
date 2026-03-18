/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useFetchOrders } from "@/hook/useFetchOrders";
import { toast } from "react-toastify";
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
  SlidersHorizontal,
  X,
  Eye,
  Receipt,
  Phone,
  User,
  Ban,
  AlertTriangle,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────
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
    altPhone?: string;
    division: string;
    district: string;
    upazila: string;
    address: string;
    addressType?: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  pricing: {
    subtotal: number;
    shippingCharge: number;
    couponDiscount: number;
    couponCode?: string;
    total: number;
  };
  transactionId?: string;
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
  {
    value: "shipped",
    label: "Shipped",
    icon: Truck,
    color: "text-violet-500",
  },
  {
    value: "delivered",
    label: "Delivered",
    icon: Package,
    color: "text-teal-500",
  },
  {
    value: "cancelled_by_customer",
    label: "Cancelled (Customer)",
    icon: XCircle,
    color: "text-red-500",
  },
  {
    value: "cancelled_by_admin",
    label: "Cancelled (Admin)",
    icon: XCircle,
    color: "text-red-500",
  },
  {
    value: "returned",
    label: "Returned",
    icon: RotateCcw,
    color: "text-orange-500",
  },
  {
    value: "failed",
    label: "Failed",
    icon: AlertCircle,
    color: "text-rose-500",
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

const PM_LABEL: Record<string, string> = {
  cod: "Cash on Delivery",
  sslcommerz: "SSLCommerz",
  stripe: "Stripe",
};

const ORDER_STATUS_CFG: Record<
  string,
  { label: string; cls: string; icon: React.ElementType }
> = {
  processing: {
    label: "Processing",
    icon: Clock,
    cls: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  },

  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    cls: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  },

  shipped: {
    label: "Shipped",
    icon: Truck,
    cls: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20",
  },

  delivered: {
    label: "Delivered",
    icon: Package,
    cls: "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-500/20",
  },

  cancelled_by_customer: {
    label: "Cancelled (You)",
    icon: Ban,
    cls: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20",
  },

  cancelled_by_admin: {
    label: "Cancelled (Admin)",
    icon: Ban,
    cls: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20",
  },

  returned: {
    label: "Returned",
    icon: RotateCcw,
    cls: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20",
  },

  failed: {
    label: "Failed",
    icon: AlertCircle,
    cls: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
  },
};

const PAYMENT_STATUS_CFG: Record<string, { label: string; cls: string }> = {
  cod_pending: {
    label: "COD Pending",
    cls: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20",
  },
  pending: {
    label: "Pending",
    cls: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  },
  paid: {
    label: "Paid",
    cls: "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-500/20",
  },
  failed: {
    label: "Failed",
    cls: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20",
  },
};

// ── Shared helpers ────────────────────────────────────────────────
const StatusBadge = ({
  status,
  cfgMap,
}: {
  status: string;
  cfgMap: Record<
    string,
    { label: string; cls: string; icon?: React.ElementType }
  >;
}) => {
  const cfg = cfgMap[status] ?? {
    label: status,
    cls: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.cls}`}
    >
      {Icon && <Icon size={10} />}
      {cfg.label}
    </span>
  );
};

const OrderProgress = ({ status }: { status: string }) => {
  const steps = ["processing", "confirmed", "shipped", "delivered"];
  const cancelled = status === "cancelled";
  const currentIdx = cancelled ? -1 : steps.indexOf(status);
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const done = !cancelled && i <= currentIdx;
        const current = !cancelled && i === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-300
                ${done ? "bg-teal-500 border-teal-500 text-white" : cancelled ? "bg-red-100 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 text-red-400" : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400"}
                ${current ? "ring-2 ring-teal-500/30 ring-offset-1" : ""}`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-[9px] font-semibold capitalize hidden sm:block ${done ? "text-teal-500" : "text-gray-400"}`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 rounded-full transition-all duration-300 ${!cancelled && i < currentIdx ? "bg-teal-500" : "bg-gray-200 dark:bg-gray-700"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const MODAL_ID = "user-order-detail-modal";

// ── Main Page ─────────────────────────────────────────────────────
const UserOrdersPage = () => {
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  // return states
  const [returning, setReturning] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");

  const { orders, total, ordersLoading, ordersError, refetchOrders } =
    useFetchOrders({
      orderStatus: orderStatus || undefined,
      paymentMethod: paymentMethod || undefined,
      date: date || undefined,
    });

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

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setConfirmCancel(false);
    (document.getElementById(MODAL_ID) as HTMLDialogElement)?.showModal();
  };

  const closeModal = () =>
    (document.getElementById(MODAL_ID) as HTMLDialogElement)?.close();

  // handle cancel
  const handleCancel = async () => {
    if (!selectedOrder) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: "cancelled" }),
      });
      if (!res.ok) throw new Error();
      closeModal();
      toast.success("Order cancelled successfully.");
      refetchOrders();
      setSelectedOrder((prev) =>
        prev ? { ...prev, orderStatus: "cancelled" } : null,
      );
    } catch {
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
    }
  };

  // ? handle return function .
  const handleReturn = async () => {
    if (!selectedOrder) return;

    if (!returnReason.trim()) {
      toast.error("Please select a return reason.");
      return;
    }

    setReturning(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: "returned",
          returnDetails: {
            reason: returnReason,
            description: returnDescription,
          },
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Return request submitted successfully.");

      setShowReturnForm(false);
      closeModal();
      refetchOrders();
    } catch {
      toast.error("Failed to submit return request.");
    } finally {
      setReturning(false);
    }
  };

  const canCancel = selectedOrder?.orderStatus === "processing";
  // const canReturn = selectedOrder?.orderStatus === "delivered";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 rubik">
      <div className="mx-auto px-4 py-5">
        {/* Header */}
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-sm shadow-teal-500/30 transition-all"
            >
              Continue Shopping <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
          {ORDER_STATUSES.map((s) => {
            const Icon = s.icon;
            const active = orderStatus === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setOrderStatus(s.value)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all border
                  ${active ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-sm" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700/50 hover:border-gray-300"}`}
              >
                <Icon size={12} className={active ? "" : s.color} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Search + sort + filter */}
        <div className="flex gap-3 mb-4">
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-teal-500/60 transition-all"
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
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-teal-500/60 transition-all cursor-pointer"
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all
              ${showFilters || activeFilterCount > 0 ? "bg-teal-500 text-white border-teal-500 shadow-sm shadow-teal-500/30" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-gray-700/50 hover:border-gray-300"}`}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-teal-600 text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Payment Method
                    </label>
                    <div className="relative">
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-teal-500/60 transition-all cursor-pointer"
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
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Order Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-teal-500/60 transition-all"
                    />
                  </div>
                  <div className="flex items-end">
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 hover:bg-red-100 transition-all w-full justify-center"
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

        {(search || activeFilterCount > 0) && (
          <p className="text-xs text-gray-500 mb-4">
            Showing{" "}
            <span className="font-bold text-gray-900 dark:text-white">
              {filtered.length}
            </span>{" "}
            result{filtered.length !== 1 ? "s" : ""}
            {search && (
              <span>
                {" "}
                for{" "}
                <span className="text-teal-500">&ldquo;{search}&rdquo;</span>
              </span>
            )}
          </p>
        )}

        {/* Orders list */}
        {ordersLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"
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
            <p className="text-sm text-gray-400">
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
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex-shrink-0">
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
                          <StatusBadge
                            status={order.orderStatus}
                            cfgMap={ORDER_STATUS_CFG}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.items.length} item
                          {order.items.length > 1 ? "s" : ""}
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
                        <div className="flex items-center gap-3 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <CreditCard size={10} />
                            {PM_LABEL[order.paymentMethod] ||
                              order.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-shrink-0">
                      <div className="text-right">
                        <p className="text-base font-extrabold text-gray-900 dark:text-white">
                          ৳{order.pricing.total.toLocaleString()}
                        </p>
                        <StatusBadge
                          status={order.paymentStatus}
                          cfgMap={PAYMENT_STATUS_CFG}
                        />
                      </div>
                      <button
                        onClick={() => openDetail(order)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 border border-gray-200 dark:border-gray-600 hover:border-teal-200 transition-all"
                      >
                        <Eye size={13} />
                        <span className="hidden sm:inline">Details</span>
                        <ChevronRight size={11} />
                      </button>
                    </div>
                  </div>
                  <div className="px-5 pb-4">
                    <OrderProgress status={order.orderStatus} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Modal ── */}
      <dialog id={MODAL_ID} className="modal">
        <div className="modal-box max-w-2xl bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
          {selectedOrder && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                      {selectedOrder.orderId}
                    </p>
                    <StatusBadge
                      status={selectedOrder.orderStatus}
                      cfgMap={ORDER_STATUS_CFG}
                    />
                    <StatusBadge
                      status={selectedOrder.paymentStatus}
                      cfgMap={PAYMENT_STATUS_CFG}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(selectedOrder.createdAt).toLocaleString("en-BD", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[65vh] overflow-y-auto p-6 space-y-6">
                {/* Progress */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Order Progress
                  </p>
                  <OrderProgress status={selectedOrder.orderStatus} />
                  {selectedOrder.orderStatus === "cancelled" && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5">
                      <Ban size={11} /> This order has been cancelled.
                    </p>
                  )}
                </div>

                {/* Status row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                      Order Status
                    </p>
                    <StatusBadge
                      status={selectedOrder.orderStatus}
                      cfgMap={ORDER_STATUS_CFG}
                    />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                      Payment
                    </p>
                    <StatusBadge
                      status={selectedOrder.paymentStatus}
                      cfgMap={PAYMENT_STATUS_CFG}
                    />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 col-span-2 sm:col-span-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                      Method
                    </p>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {PM_LABEL[selectedOrder.paymentMethod] ??
                        selectedOrder.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                    <ShoppingBag size={12} /> Items (
                    {selectedOrder.items.length})
                  </p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                      >
                        {item.image && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800">
                            <Image
                              src={item.image}
                              fill
                              alt={item.title}
                              className="object-contain p-1"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {item.brand && (
                              <span className="text-[10px] text-teal-500 font-bold uppercase">
                                {item.brand}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500">
                                Color: {item.selectedColor}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
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

                {/* Pricing + Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                      <Receipt size={12} /> Price Summary
                    </p>
                    <div className="space-y-2">
                      {[
                        {
                          label: "Subtotal",
                          val: selectedOrder.pricing.subtotal,
                        },
                        {
                          label: "Shipping",
                          val: selectedOrder.pricing.shippingCharge,
                        },
                        ...(selectedOrder.pricing.couponDiscount > 0
                          ? [
                              {
                                label: `Coupon${selectedOrder.pricing.couponCode ? ` (${selectedOrder.pricing.couponCode})` : ""}`,
                                val: -selectedOrder.pricing.couponDiscount,
                              },
                            ]
                          : []),
                      ].map(({ label, val }) => (
                        <div
                          key={label}
                          className="flex justify-between text-xs"
                        >
                          <span className="text-gray-500">{label}</span>
                          <span
                            className={
                              val < 0
                                ? "text-teal-500 font-semibold"
                                : "text-gray-700 dark:text-gray-300"
                            }
                          >
                            {val < 0 ? "-" : ""}৳
                            {Math.abs(val).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                          ৳{selectedOrder.pricing.total.toLocaleString()}
                        </span>
                      </div>
                      {selectedOrder.transactionId && (
                        <p className="text-[10px] text-gray-400 font-mono break-all pt-1">
                          TXN: {selectedOrder.transactionId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                      <MapPin size={12} /> Delivery Address
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <User size={11} className="text-gray-400 shrink-0" />
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {selectedOrder.deliveryAddress.fullName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={11} className="text-gray-400 shrink-0" />
                        <p className="text-xs text-gray-500">
                          {selectedOrder.deliveryAddress.phone}
                          {selectedOrder.deliveryAddress.altPhone &&
                            ` / ${selectedOrder.deliveryAddress.altPhone}`}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={11}
                          className="text-gray-400 shrink-0 mt-0.5"
                        />
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {selectedOrder.deliveryAddress.address},{" "}
                          {selectedOrder.deliveryAddress.upazila},{" "}
                          {selectedOrder.deliveryAddress.district},{" "}
                          {selectedOrder.deliveryAddress.division}
                        </p>
                      </div>
                      {selectedOrder.deliveryAddress.addressType && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 capitalize">
                          {selectedOrder.deliveryAddress.addressType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {selectedOrder.note && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                      Note
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {selectedOrder.note}
                    </p>
                  </div>
                )}

                {/* Cancel section */}
                {canCancel && (
                  <div className="rounded-xl border border-red-200 dark:border-red-500/20 overflow-hidden">
                    {!confirmCancel ? (
                      <button
                        onClick={() => setConfirmCancel(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                      >
                        <XCircle size={15} /> Cancel This Order
                      </button>
                    ) : (
                      <div className="p-4 bg-red-50 dark:bg-red-500/10 space-y-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle
                            size={15}
                            className="text-red-500 shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="text-sm font-bold text-red-700 dark:text-red-400">
                              Are you sure?
                            </p>
                            <p className="text-xs text-red-500 mt-0.5">
                              This will cancel your order and cannot be undone.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {cancelling ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <XCircle size={12} />
                            )}{" "}
                            Yes, Cancel Order
                          </button>
                          <button
                            onClick={() => setConfirmCancel(false)}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Keep My Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
                {/* {selectedOrder?.orderStatus === "delivered" ? (
                  <button
                    onClick={() => handleReturn()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 hover:bg-teal-100 transition-colors"
                  >
                    <RotateCcw size={12} /> Return / Exchange
                  </button>
                ) : (
                  <div />
                )} */}
                {selectedOrder?.orderStatus === "delivered" && (
                  <div className="border border-teal-200 dark:border-teal-500/20 rounded-xl p-4 space-y-3">
                    {!showReturnForm ? (
                      <button
                        onClick={() => setShowReturnForm(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 hover:bg-teal-100 transition-colors"
                      >
                        <RotateCcw size={12} /> Return / Exchange
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm font-bold text-gray-800 dark:text-white">
                          Return Request
                        </p>

                        {/* Reason */}
                        <select
                          value={returnReason}
                          onChange={(e) => setReturnReason(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        >
                          <option value="">Select reason</option>
                          <option value="defective">Defective product</option>
                          <option value="wrong_item">
                            Wrong item received
                          </option>
                          <option value="size_issue">Size issue</option>
                          <option value="changed_mind">Changed my mind</option>
                          <option value="other">Any other reason</option>
                        </select>

                        {/* Description */}
                        <textarea
                          value={returnDescription}
                          onChange={(e) => setReturnDescription(e.target.value)}
                          placeholder="Optional description..."
                          className="w-full px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={handleReturn}
                            disabled={returning}
                            className="flex-1 py-2 rounded-lg text-xs font-bold text-white bg-teal-500 hover:bg-teal-600"
                          >
                            {returning ? "Submitting..." : "Submit Return"}
                          </button>

                          <button
                            onClick={() => setShowReturnForm(false)}
                            className="flex-1 py-2 rounded-lg text-xs font-bold bg-gray-200 dark:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default UserOrdersPage;

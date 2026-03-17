"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useFetchOrders } from "@/hook/useFetchOrders";
import { IOrder } from "../../../../../models/Order";
import { toast } from "react-toastify";
import {
  Search,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  PackageOpen,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Ban,
  CreditCard,
  Loader2,
  Eye,
  Save,
  X,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  Receipt,
  Edit3,
  ChevronRight,
  RefreshCw,
  RotateCcw,
  XCircle,
} from "lucide-react";

type Order = IOrder & { _id: string; createdAt: string };
type SortField =
  | "orderId"
  | "createdAt"
  | "pricing.total"
  | "orderStatus"
  | "paymentStatus";

// const ORDER_STATUS = {
//   processing: {
//     label: "Processing",
//     icon: Clock,
//     cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
//   },
//   confirmed: {
//     label: "Confirmed",
//     icon: CheckCircle2,
//     cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
//   },
//   shipped: {
//     label: "Shipped",
//     icon: Truck,
//     cls: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
//   },
//   delivered: {
//     label: "Delivered",
//     icon: CheckCircle2,
//     cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
//   },
//   cancelled: {
//     label: "Cancelled",
//     icon: Ban,
//     cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
//   },
// } as const;

const ORDER_STATUS = {
  pending: {
    label: "Pending",
    icon: Clock,
    cls: "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    cls: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  cancelled_by_customer: {
    label: "Cancelled (Customer)",
    icon: Ban,
    cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  },
  cancelled_by_admin: {
    label: "Cancelled (Admin)",
    icon: Ban,
    cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  },
  returned: {
    label: "Returned",
    icon: RotateCcw,
    cls: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    cls: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  },
} as const;

const PAYMENT_STATUS = {
  cod_pending: {
    label: "COD Pending",
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  pending: {
    label: "Pending",
    cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  paid: {
    label: "Paid",
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  failed: {
    label: "Failed",
    cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  },
} as const;

const PAYMENT_METHOD = {
  cod: {
    label: "Cash on Delivery",
    cls: "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
  },
  sslcommerz: {
    label: "SSLCommerz",
    cls: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  stripe: {
    label: "Stripe",
    cls: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  },
} as const;

const inp = `w-full px-3 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800
  border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white
  focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all`;
const lbl =
  "block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5";

const Badge = ({
  cls,
  label,
  icon: Icon,
}: {
  cls: string;
  label: string;
  icon?: React.ElementType;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cls}`}
  >
    {Icon && <Icon size={10} />}
    {label}
  </span>
);

/* ─────────────────────────────────────────────────────── */
const AdminOrdersPage = () => {
  const [search, setSearch] = useState("");
  const [filterOS, setFilterOS] = useState("");
  const [filterPS, setFilterPS] = useState("");
  const [filterPM, setFilterPM] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Modal state
  const [order, setOrder] = useState<Order | null>(null);
  const [tab, setTab] = useState<"details" | "edit">("details");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{
    orderStatus: string;
    paymentStatus: string;
    note: string;
    fullName: string;
    phone: string;
    altPhone: string;
    address: string;
    items: { quantity: number; unitPrice: number; subtotal: number }[];
  } | null>(null);

  const { orders, total, ordersLoading, ordersError, refetchOrders } =
    useFetchOrders({
      search: search || undefined,
      orderStatus: filterOS || undefined,
      paymentStatus: filterPS || undefined,
      paymentMethod: filterPM || undefined,
      createdAtFrom: dateFrom || undefined,
      createdAtTo: dateTo || undefined,
    });

  const allOrders = useMemo(() => (orders || []) as Order[], [orders]);

  const stats = {
    total,
    delivered: allOrders.filter((o) => o.orderStatus === "delivered").length,
    pending: allOrders.filter((o) =>
      ["processing", "confirmed"].includes(o.orderStatus),
    ).length,
    revenue: allOrders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((s, o) => s + o.pricing.total, 0),
  };

  const sorted = useMemo(
    () =>
      [...allOrders].sort((a, b) => {
        const av =
          sortField === "pricing.total"
            ? a.pricing.total
            : ((a as never as Record<string, unknown>)[sortField] ?? "");
        const bv =
          sortField === "pricing.total"
            ? b.pricing.total
            : ((b as never as Record<string, unknown>)[sortField] ?? "");
        return av < bv
          ? sortDir === "asc"
            ? -1
            : 1
          : av > bv
            ? sortDir === "asc"
              ? 1
              : -1
            : 0;
      }),
    [allOrders, sortField, sortDir],
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  // Open modal
  const openOrder = (o: Order) => {
    setOrder(o);
    setTab("details");
    setForm({
      orderStatus: o.orderStatus,
      paymentStatus: o.paymentStatus,
      note: o.note ?? "",
      fullName: o.deliveryAddress.fullName,
      phone: o.deliveryAddress.phone,
      altPhone: o.deliveryAddress.altPhone ?? "",
      address: o.deliveryAddress.address,
      items: o.items.map((it) => ({
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        subtotal: it.subtotal,
      })),
    });
    (document.getElementById("order-modal") as HTMLDialogElement)?.showModal();
  };

  const closeModal = () =>
    (document.getElementById("order-modal") as HTMLDialogElement)?.close();

  // Update item qty/price
  const updateItem = (
    i: number,
    field: "quantity" | "unitPrice",
    val: number,
  ) => {
    setForm((prev) => {
      if (!prev) return prev;
      const items = [...prev.items];
      items[i] = {
        ...items[i],
        [field]: val,
        subtotal:
          field === "quantity"
            ? val * items[i].unitPrice
            : items[i].quantity * val,
      };
      return { ...prev, items };
    });
  };

  // Save changes
  const handleSave = async () => {
    if (!order || !form) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${order.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: form.orderStatus,
          paymentStatus: form.paymentStatus,
          note: form.note,
          deliveryAddress: {
            ...order.deliveryAddress,
            fullName: form.fullName,
            phone: form.phone,
            altPhone: form.altPhone,
            address: form.address,
          },
          items: order.items.map((it, i) => ({ ...it, ...form.items[i] })),
        }),
      });
      if (res.ok) {
        console.log("print");
        toast.success("Order updated successfully!");
        closeModal();
        refetchOrders();
      } else {
        throw new Error();
        // toast.error("Order error detected!");
      }
    } catch {
      toast.error("Failed to update order.");
    } finally {
      setSaving(false);
    }
  };

  const hasFilter =
    search || filterOS || filterPS || filterPM || dateFrom || dateTo;
  const clearFilters = () => {
    setSearch("");
    setFilterOS("");
    setFilterPS("");
    setFilterPM("");
    setDateFrom("");
    setDateTo("");
  };

  const os = order
    ? (ORDER_STATUS[order.orderStatus as keyof typeof ORDER_STATUS] ??
      ORDER_STATUS.processing)
    : null;
  const ps = order
    ? (PAYMENT_STATUS[order.paymentStatus as keyof typeof PAYMENT_STATUS] ??
      PAYMENT_STATUS.pending)
    : null;
  const pm = order
    ? (PAYMENT_METHOD[order.paymentMethod as keyof typeof PAYMENT_METHOD] ??
      PAYMENT_METHOD.cod)
    : null;

  /* ── Loading / Error ── */
  if (ordersLoading)
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-800" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 animate-spin" />
          </div>
          <p className="text-sm text-gray-400">Loading orders…</p>
        </div>
      </div>
    );

  if (ordersError)
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <AlertTriangle size={32} className="text-red-400 mx-auto" />
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Failed to load orders
          </p>
          <button
            onClick={() => refetchOrders()}
            className="text-sm text-teal-500 hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw size={13} /> Try again
          </button>
        </div>
      </div>
    );

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Orders
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetchOrders()}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-teal-500 hover:border-teal-300 transition-all"
            >
              <RefreshCw size={15} />
            </button>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              {sorted.length} / {stats.total} orders
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: "Total Orders",
              value: stats.total,
              icon: ShoppingBag,
              color: "text-gray-700 dark:text-gray-300",
            },
            {
              label: "Delivered",
              value: stats.delivered,
              sub: "completed",
              icon: CheckCircle2,
              color: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "In Progress",
              value: stats.pending,
              sub: "proc+confirm",
              icon: Clock,
              color: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Revenue (Paid)",
              value: `৳${stats.revenue.toLocaleString()}`,
              icon: CreditCard,
              color: "text-teal-600 dark:text-teal-400",
            },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {label}
                </p>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center bg-opacity-10`}
                >
                  <Icon size={14} className={color} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by Order ID, User ID, product title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${showFilters ? "bg-teal-500 text-white" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"}`}
            >
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Filters</span>
              {hasFilter && (
                <span className="w-2 h-2 rounded-full bg-current inline-block opacity-60" />
              )}
            </button>
            {hasFilter && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 transition-colors"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
          {showFilters && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div>
                <label className={lbl}>Order Status</label>
                <select
                  value={filterOS}
                  onChange={(e) => setFilterOS(e.target.value)}
                  className={inp}
                >
                  <option value="">All</option>
                  {Object.entries(ORDER_STATUS).map(([v, { label }]) => (
                    <option key={v} value={v}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Payment Status</label>
                <select
                  value={filterPS}
                  onChange={(e) => setFilterPS(e.target.value)}
                  className={inp}
                >
                  <option value="">All</option>
                  {Object.entries(PAYMENT_STATUS).map(([v, { label }]) => (
                    <option key={v} value={v}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Payment Method</label>
                <select
                  value={filterPM}
                  onChange={(e) => setFilterPM(e.target.value)}
                  className={inp}
                >
                  <option value="">All</option>
                  {Object.entries(PAYMENT_METHOD).map(([v, { label }]) => (
                    <option key={v} value={v}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Date To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={inp}
                />
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <PackageOpen
              size={40}
              className="text-gray-300 dark:text-gray-700"
            />
            <p className="text-gray-500 font-medium">No orders found</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                    {(
                      [
                        { label: "Order ID", field: "orderId" as SortField },
                        { label: "Customer", field: null },
                        {
                          label: "Items",
                          field: null,
                          hidden: "hidden md:table-cell",
                        },
                        { label: "Total", field: "pricing.total" as SortField },
                        {
                          label: "Payment",
                          field: "paymentStatus" as SortField,
                          hidden: "hidden sm:table-cell",
                        },
                        { label: "Status", field: "orderStatus" as SortField },
                        {
                          label: "Date",
                          field: "createdAt" as SortField,
                          hidden: "hidden lg:table-cell",
                        },
                      ] as {
                        label: string;
                        field: SortField | null;
                        hidden?: string;
                      }[]
                    ).map(({ label, field, hidden }) => (
                      <th
                        key={label}
                        className={`text-left px-4 py-3.5 first:pl-5 ${hidden ?? ""}`}
                      >
                        {field ? (
                          <button
                            onClick={() => toggleSort(field)}
                            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                          >
                            {label}
                            <span className="flex flex-col ml-1 opacity-40">
                              <ChevronUp
                                size={10}
                                className={
                                  sortField === field && sortDir === "asc"
                                    ? "opacity-100 text-teal-500"
                                    : ""
                                }
                              />
                              <ChevronDown
                                size={10}
                                className={
                                  sortField === field && sortDir === "desc"
                                    ? "opacity-100 text-teal-500"
                                    : ""
                                }
                              />
                            </span>
                          </button>
                        ) : (
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {label}
                          </span>
                        )}
                      </th>
                    ))}
                    <th className="px-4 py-3.5 text-right">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {sorted.map((o) => {
                    const rowOs =
                      ORDER_STATUS[
                        o.orderStatus as keyof typeof ORDER_STATUS
                      ] ?? ORDER_STATUS.processing;
                    const rowPs =
                      PAYMENT_STATUS[
                        o.paymentStatus as keyof typeof PAYMENT_STATUS
                      ] ?? PAYMENT_STATUS.pending;
                    const RowIcon = rowOs.icon;
                    return (
                      <tr
                        key={o._id}
                        onClick={() => openOrder(o)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      >
                        <td className="pl-5 pr-4 py-4">
                          <p className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                            {o.orderId}
                          </p>
                          <Badge
                            cls={
                              PAYMENT_METHOD[
                                o.paymentMethod as keyof typeof PAYMENT_METHOD
                              ]?.cls ?? ""
                            }
                            label={
                              PAYMENT_METHOD[
                                o.paymentMethod as keyof typeof PAYMENT_METHOD
                              ]?.label ?? o.paymentMethod
                            }
                          />
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-1">
                            {o.deliveryAddress.fullName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {o.deliveryAddress.phone}
                          </p>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            {o.items.slice(0, 3).map((item, i) =>
                              item.image ? (
                                <div
                                  key={i}
                                  className="relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 shrink-0"
                                >
                                  <Image
                                    src={item.image}
                                    fill
                                    alt=""
                                    className="object-cover"
                                  />
                                </div>
                              ) : null,
                            )}
                            <span className="text-xs text-gray-400 ml-1">
                              {o.items.length} item
                              {o.items.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-bold text-gray-900 dark:text-white">
                            ৳{o.pricing.total.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <Badge cls={rowPs.cls} label={rowPs.label} />
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            cls={rowOs.cls}
                            label={rowOs.label}
                            icon={RowIcon}
                          />
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <p className="text-xs text-gray-500">
                            {new Date(o.createdAt).toLocaleDateString("en-BD", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {new Date(o.createdAt).toLocaleTimeString("en-BD", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </td>
                        <td
                          className="px-4 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => openOrder(o)}
                            className="p-2 rounded-lg text-gray-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 transition-all flex items-center gap-1"
                          >
                            <Eye size={15} />
                            <ChevronRight size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {sorted.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {stats.total}
                </span>{" "}
                orders
              </p>
              {hasFilter && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <dialog id="order-modal" className="modal">
        <div className="modal-box max-w-3xl bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
          {order &&
            form &&
            os &&
            ps &&
            pm &&
            (() => {
              const OsIcon = os.icon;
              return (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold font-mono text-gray-900 dark:text-white">
                          {order.orderId}
                        </p>
                        <Badge cls={os.cls} label={os.label} icon={OsIcon} />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleString("en-BD", {
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

                  {/* Tabs */}
                  <div className="flex border-b border-gray-100 dark:border-gray-800 px-6">
                    {(["details", "edit"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 -mb-px transition-all
                      ${tab === t ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                      >
                        {t === "details" ? "Order Details" : "Edit Order"}
                      </button>
                    ))}
                  </div>

                  {/* Body */}
                  <div className="max-h-[65vh] overflow-y-auto p-6 space-y-6">
                    {tab === "details" && (
                      <>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            {
                              title: "Order Status",
                              el: (
                                <Badge
                                  cls={os.cls}
                                  label={os.label}
                                  icon={OsIcon}
                                />
                              ),
                            },
                            {
                              title: "Payment",
                              el: <Badge cls={ps.cls} label={ps.label} />,
                            },
                            {
                              title: "Method",
                              el: <Badge cls={pm.cls} label={pm.label} />,
                            },
                          ].map(({ title, el }) => (
                            <div
                              key={title}
                              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1.5"
                            >
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                {title}
                              </p>
                              {el}
                            </div>
                          ))}
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                            <ShoppingBag size={12} /> Items (
                            {order.items.length})
                          </p>
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                              >
                                {item.image && (
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
                                    <Image
                                      src={item.image}
                                      fill
                                      alt={item.title}
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                                    {item.title}
                                  </p>
                                  <div className="flex gap-2 mt-0.5 flex-wrap">
                                    {item.brand && (
                                      <span className="text-[11px] text-gray-400">
                                        {item.brand}
                                      </span>
                                    )}
                                    {item.selectedSize && (
                                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500">
                                        Size: {item.selectedSize}
                                      </span>
                                    )}
                                    {item.selectedColor && (
                                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500">
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
                                    {item.quantity} × ৳
                                    {item.unitPrice.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800 space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 mb-3">
                              <Receipt size={12} /> Pricing
                            </p>
                            {[
                              ["Subtotal", order.pricing.subtotal],
                              ["Shipping", order.pricing.shippingCharge],
                            ].map(([k, v]) => (
                              <div
                                key={k as string}
                                className="flex justify-between text-xs"
                              >
                                <span className="text-gray-500">{k}</span>
                                <span className="text-gray-700 dark:text-gray-300">
                                  ৳{(v as number).toLocaleString()}
                                </span>
                              </div>
                            ))}
                            {order.pricing.couponDiscount > 0 && (
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">
                                  Coupon{" "}
                                  {order.pricing.couponCode &&
                                    `(${order.pricing.couponCode})`}
                                </span>
                                <span className="text-teal-500">
                                  -৳
                                  {order.pricing.couponDiscount.toLocaleString()}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                Total
                              </span>
                              <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                                ৳{order.pricing.total.toLocaleString()}
                              </span>
                            </div>
                            {order.transactionId && (
                              <p className="text-[10px] text-gray-400 font-mono break-all">
                                TXN: {order.transactionId}
                              </p>
                            )}
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800 space-y-1.5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 mb-3">
                              <MapPin size={12} /> Delivery Address
                            </p>
                            <div className="flex items-center gap-2">
                              <User
                                size={11}
                                className="text-gray-400 shrink-0"
                              />
                              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                {order.deliveryAddress.fullName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone
                                size={11}
                                className="text-gray-400 shrink-0"
                              />
                              <p className="text-xs text-gray-500">
                                {order.deliveryAddress.phone}
                                {order.deliveryAddress.altPhone &&
                                  ` / ${order.deliveryAddress.altPhone}`}
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin
                                size={11}
                                className="text-gray-400 shrink-0 mt-0.5"
                              />
                              <p className="text-xs text-gray-500 leading-relaxed">
                                {order.deliveryAddress.address},{" "}
                                {order.deliveryAddress.upazila},{" "}
                                {order.deliveryAddress.district},{" "}
                                {order.deliveryAddress.division}
                              </p>
                            </div>
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 capitalize">
                              {order.deliveryAddress.addressType}
                            </span>
                          </div>
                        </div>

                        {order.note && (
                          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                              Customer Note
                            </p>
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                              {order.note}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {tab === "edit" && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={lbl}>Order Status</label>
                            <select
                              value={form.orderStatus}
                              onChange={(e) =>
                                setForm(
                                  (p) =>
                                    p && { ...p, orderStatus: e.target.value },
                                )
                              }
                              className={inp}
                            >
                              {Object.entries(ORDER_STATUS).map(
                                ([v, { label }]) => (
                                  <option key={v} value={v}>
                                    {label}
                                  </option>
                                ),
                              )}
                            </select>
                          </div>
                          <div>
                            <label className={lbl}>Payment Status</label>
                            <select
                              value={form.paymentStatus}
                              onChange={(e) =>
                                setForm(
                                  (p) =>
                                    p && {
                                      ...p,
                                      paymentStatus: e.target.value,
                                    },
                                )
                              }
                              className={inp}
                            >
                              {Object.entries(PAYMENT_STATUS).map(
                                ([v, { label }]) => (
                                  <option key={v} value={v}>
                                    {label}
                                  </option>
                                ),
                              )}
                            </select>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                            <MapPin size={12} /> Delivery Address
                          </p>
                          <div className="space-y-3">
                            <div>
                              <label className={lbl}>Full Name</label>
                              <input
                                type="text"
                                value={form.fullName}
                                onChange={(e) =>
                                  setForm(
                                    (p) =>
                                      p && { ...p, fullName: e.target.value },
                                  )
                                }
                                className={inp}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className={lbl}>Phone</label>
                                <input
                                  type="text"
                                  value={form.phone}
                                  onChange={(e) =>
                                    setForm(
                                      (p) =>
                                        p && { ...p, phone: e.target.value },
                                    )
                                  }
                                  className={inp}
                                />
                              </div>
                              <div>
                                <label className={lbl}>Alt Phone</label>
                                <input
                                  type="text"
                                  value={form.altPhone}
                                  onChange={(e) =>
                                    setForm(
                                      (p) =>
                                        p && { ...p, altPhone: e.target.value },
                                    )
                                  }
                                  className={inp}
                                />
                              </div>
                            </div>
                            <div>
                              <label className={lbl}>Address</label>
                              <textarea
                                rows={2}
                                value={form.address}
                                onChange={(e) =>
                                  setForm(
                                    (p) =>
                                      p && { ...p, address: e.target.value },
                                  )
                                }
                                className={`${inp} resize-none`}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                            <ShoppingBag size={12} /> Items
                          </p>
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                              >
                                <p className="text-xs font-semibold text-gray-800 dark:text-white mb-3 line-clamp-1">
                                  {item.title}
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <label className={lbl}>Qty</label>
                                    <input
                                      type="number"
                                      min={1}
                                      value={form.items[i].quantity}
                                      onChange={(e) =>
                                        updateItem(
                                          i,
                                          "quantity",
                                          Number(e.target.value),
                                        )
                                      }
                                      className={inp}
                                    />
                                  </div>
                                  <div>
                                    <label className={lbl}>Unit Price</label>
                                    <input
                                      type="number"
                                      min={0}
                                      value={form.items[i].unitPrice}
                                      onChange={(e) =>
                                        updateItem(
                                          i,
                                          "unitPrice",
                                          Number(e.target.value),
                                        )
                                      }
                                      className={inp}
                                    />
                                  </div>
                                  <div>
                                    <label className={lbl}>Subtotal</label>
                                    <div
                                      className={`${inp} text-teal-600 dark:text-teal-400 font-semibold flex items-center`}
                                    >
                                      ৳{form.items[i].subtotal.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className={lbl}>Admin / Customer Note</label>
                          <textarea
                            rows={3}
                            value={form.note}
                            onChange={(e) =>
                              setForm(
                                (p) => p && { ...p, note: e.target.value },
                              )
                            }
                            placeholder="Internal note or customer instruction..."
                            className={`${inp} resize-none`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
                    <div>
                      {tab === "details" && (
                        <button
                          onClick={() => setTab("edit")}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 hover:bg-teal-100 transition-colors"
                        >
                          <Edit3 size={12} /> Edit Order
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                      {tab === "edit" && (
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-teal-500 hover:bg-teal-400 disabled:opacity-50 flex items-center gap-2 transition-all"
                        >
                          {saving ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Save size={14} />
                          )}{" "}
                          Save Changes
                        </button>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default AdminOrdersPage;

"use client";
import React, { useState, useMemo, useCallback } from "react";
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
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────── */
type Order = IOrder & { _id: string; createdAt: string };
type SortField =
  | "orderId"
  | "createdAt"
  | "pricing.total"
  | "orderStatus"
  | "paymentStatus";
type SortDir = "asc" | "desc";

/* ─── Config maps ────────────────────────────────────── */
const ORDER_STATUS = {
  processing: {
    label: "Processing",
    icon: Clock,
    cls: "bg-amber-100  text-amber-700  dark:bg-amber-500/10  dark:text-amber-400",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    cls: "bg-blue-100   text-blue-700   dark:bg-blue-500/10   dark:text-blue-400",
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
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    cls: "bg-red-100    text-red-700    dark:bg-red-500/10    dark:text-red-400",
  },
} as const;

const PAYMENT_STATUS = {
  cod_pending: {
    label: "COD Pending",
    cls: "bg-amber-100  text-amber-700  dark:bg-amber-500/10  dark:text-amber-400",
  },
  pending: {
    label: "Pending",
    cls: "bg-gray-100   text-gray-600   dark:bg-gray-800      dark:text-gray-400",
  },
  paid: {
    label: "Paid",
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  failed: {
    label: "Failed",
    cls: "bg-red-100    text-red-700    dark:bg-red-500/10    dark:text-red-400",
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

/* ─── Shared styles ──────────────────────────────────── */
const inputCls = `w-full px-3 py-2.5 rounded-xl text-sm
  bg-gray-50 dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  text-gray-900 dark:text-white
  placeholder-gray-400 dark:placeholder-gray-600
  focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15
  transition-all duration-200`;

const labelCls =
  "block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1.5";

/* ─── Stat Card ──────────────────────────────────────── */
const StatCard = ({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  sub?: string;
  color: string;
  icon: React.ElementType;
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} bg-opacity-10`}
      >
        <Icon size={14} className={color} />
      </div>
    </div>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

/* ─── Badge ──────────────────────────────────────────── */
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

/* ─── Order Detail & Edit Modal ──────────────────────── */
const OrderModal = ({
  order,
  modalId,
  onUpdate,
}: {
  order: Order | null;
  modalId: string;
  onUpdate: () => void;
}) => {
  const [tab, setTab] = useState<"details" | "edit">("details");
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<{
    orderStatus: string;
    paymentStatus: string;
    note: string;
    address: string;
    phone: string;
    altPhone: string;
    fullName: string;
    items: { quantity: number; unitPrice: number; subtotal: number }[];
  } | null>(null);

  React.useEffect(() => {
    if (order) {
      setTab("details");
      setEditForm({
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        note: order.note ?? "",
        address: order.deliveryAddress.address,
        phone: order.deliveryAddress.phone,
        altPhone: order.deliveryAddress.altPhone ?? "",
        fullName: order.deliveryAddress.fullName,
        items: order.items.map((it) => ({
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          subtotal: it.subtotal,
        })),
      });
    }
  }, [order]);

  const updateItem = (
    i: number,
    field: "quantity" | "unitPrice",
    val: number,
  ) => {
    if (!editForm) return;
    const items = [...editForm.items];
    items[i] = {
      ...items[i],
      [field]: val,
      subtotal:
        field === "quantity"
          ? val * items[i].unitPrice
          : items[i].quantity * val,
    };
    setEditForm((p) => p && { ...p, items });
  };

  const handleSave = async () => {
    if (!order || !editForm) return;
    setSaving(true);
    try {
      const payload = {
        orderStatus: editForm.orderStatus,
        paymentStatus: editForm.paymentStatus,
        note: editForm.note,
        deliveryAddress: {
          ...order.deliveryAddress,
          fullName: editForm.fullName,
          phone: editForm.phone,
          altPhone: editForm.altPhone,
          address: editForm.address,
        },
        items: order.items.map((it, i) => ({
          ...it,
          quantity: editForm.items[i].quantity,
          unitPrice: editForm.items[i].unitPrice,
          subtotal: editForm.items[i].subtotal,
        })),
      };

      const res = await fetch(`/api/orders/${order.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success("Order updated successfully!");
      onUpdate();
      (document.getElementById(modalId) as HTMLDialogElement)?.close();
    } catch {
      toast.error("Failed to update order.");
    } finally {
      setSaving(false);
    }
  };

  const close = () =>
    (document.getElementById(modalId) as HTMLDialogElement)?.close();

  if (!order || !editForm)
    return (
      <dialog id={modalId} className="modal">
        <div className="modal-box" />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );

  const osCfg = ORDER_STATUS[order.orderStatus] ?? ORDER_STATUS.processing;
  const psCfg = PAYMENT_STATUS[order.paymentStatus] ?? PAYMENT_STATUS.pending;
  const pmCfg = PAYMENT_METHOD[order.paymentMethod] ?? PAYMENT_METHOD.cod;
  const OsIcon = osCfg.icon;

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box max-w-3xl bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                {order.orderId}
              </p>
              <Badge cls={osCfg.cls} label={osCfg.label} icon={OsIcon} />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(order.createdAt).toLocaleString("en-BD", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <button
            onClick={close}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
              className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-150 border-b-2 -mb-px
                ${
                  tab === t
                    ? "border-teal-500 text-teal-600 dark:text-teal-400"
                    : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
            >
              {t === "details" ? "Order Details" : "Edit Order"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto p-6 space-y-6">
          {/* ── DETAILS TAB ── */}
          {tab === "details" && (
            <>
              {/* Status row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Order Status
                  </p>
                  <Badge cls={osCfg.cls} label={osCfg.label} icon={OsIcon} />
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Payment
                  </p>
                  <Badge cls={psCfg.cls} label={psCfg.label} />
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Method
                  </p>
                  <Badge cls={pmCfg.cls} label={pmCfg.label} />
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-3 flex items-center gap-1.5">
                  <ShoppingBag size={12} /> Items ({order.items.length})
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
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {item.brand && (
                            <span className="text-[11px] text-gray-400">
                              {item.brand}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
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

              {/* Pricing + Address side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pricing */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2 border border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 flex items-center gap-1.5 mb-3">
                    <Receipt size={12} /> Pricing
                  </p>
                  {[
                    ["Subtotal", `৳${order.pricing.subtotal.toLocaleString()}`],
                    [
                      "Shipping",
                      `৳${order.pricing.shippingCharge.toLocaleString()}`,
                    ],
                    ...(order.pricing.couponDiscount > 0
                      ? [
                          [
                            "Coupon",
                            `-৳${order.pricing.couponDiscount.toLocaleString()}`,
                          ],
                        ]
                      : []),
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        {k}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {v}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                      ৳{order.pricing.total.toLocaleString()}
                    </span>
                  </div>
                  {order.pricing.couponCode && (
                    <p className="text-[11px] text-teal-600 dark:text-teal-400">
                      Coupon: {order.pricing.couponCode}
                    </p>
                  )}
                  {order.transactionId && (
                    <p className="text-[11px] text-gray-400 font-mono break-all">
                      TXN: {order.transactionId}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2 border border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 flex items-center gap-1.5 mb-3">
                    <MapPin size={12} /> Delivery Address
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <User size={11} className="text-gray-400 shrink-0" />
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {order.deliveryAddress.fullName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={11} className="text-gray-400 shrink-0" />
                      <p className="text-xs text-gray-600 dark:text-gray-300">
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
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {order.deliveryAddress.address},{" "}
                        {order.deliveryAddress.upazila},{" "}
                        {order.deliveryAddress.district},{" "}
                        {order.deliveryAddress.division}
                      </p>
                    </div>
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold
                                     bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 capitalize"
                    >
                      {order.deliveryAddress.addressType}
                    </span>
                  </div>
                </div>
              </div>

              {order.note && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/8 border border-amber-200 dark:border-amber-500/20">
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

          {/* ── EDIT TAB ── */}
          {tab === "edit" && (
            <div className="space-y-6">
              {/* Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Order Status</label>
                  <select
                    value={editForm.orderStatus}
                    onChange={(e) =>
                      setEditForm(
                        (p) => p && { ...p, orderStatus: e.target.value },
                      )
                    }
                    className={inputCls}
                  >
                    {Object.entries(ORDER_STATUS).map(([v, { label }]) => (
                      <option key={v} value={v}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Payment Status</label>
                  <select
                    value={editForm.paymentStatus}
                    onChange={(e) =>
                      setEditForm(
                        (p) => p && { ...p, paymentStatus: e.target.value },
                      )
                    }
                    className={inputCls}
                  >
                    {Object.entries(PAYMENT_STATUS).map(([v, { label }]) => (
                      <option key={v} value={v}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-3 flex items-center gap-1.5">
                  <MapPin size={12} /> Delivery Address
                </p>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) =>
                        setEditForm(
                          (p) => p && { ...p, fullName: e.target.value },
                        )
                      }
                      className={inputCls}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Phone</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm(
                            (p) => p && { ...p, phone: e.target.value },
                          )
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Alt Phone</label>
                      <input
                        type="text"
                        value={editForm.altPhone}
                        onChange={(e) =>
                          setEditForm(
                            (p) => p && { ...p, altPhone: e.target.value },
                          )
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Address</label>
                    <textarea
                      rows={2}
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm(
                          (p) => p && { ...p, address: e.target.value },
                        )
                      }
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-3 flex items-center gap-1.5">
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
                          <label className={labelCls}>Qty</label>
                          <input
                            type="number"
                            min={1}
                            value={editForm.items[i].quantity}
                            onChange={(e) =>
                              updateItem(i, "quantity", Number(e.target.value))
                            }
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Unit Price</label>
                          <input
                            type="number"
                            min={0}
                            value={editForm.items[i].unitPrice}
                            onChange={(e) =>
                              updateItem(i, "unitPrice", Number(e.target.value))
                            }
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Subtotal</label>
                          <div
                            className={`${inputCls} flex items-center text-teal-600 dark:text-teal-400 font-semibold`}
                          >
                            ৳{editForm.items[i].subtotal.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className={labelCls}>Admin / Customer Note</label>
                <textarea
                  rows={3}
                  value={editForm.note}
                  onChange={(e) =>
                    setEditForm((p) => p && { ...p, note: e.target.value })
                  }
                  placeholder="Internal note or customer instruction..."
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
          <div className="flex items-center gap-2">
            {tab === "details" && (
              <button
                onClick={() => setTab("edit")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                                 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10
                                 hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors"
              >
                <Edit3 size={12} /> Edit Order
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={close}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400
                               bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
            {tab === "edit" && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white
                                 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed
                                 flex items-center gap-2 transition-all duration-200"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

/* ─── Main Page ──────────────────────────────────────── */
const MODAL_ID = "order-detail-modal";

const AdminOrdersPage = () => {
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { orders, total, ordersLoading, ordersError, refetchOrders } =
    useFetchOrders({
      search: search || undefined,
      orderStatus: orderStatus || undefined,
      paymentStatus: paymentStatus || undefined,
      paymentMethod: paymentMethod || undefined,
      createdAtFrom: dateFrom || undefined,
      createdAtTo: dateTo || undefined,
    });

  const allOrders = useMemo(() => (orders || []) as Order[], [orders]);

  /* ── Stats ── */
  const stats = useMemo(
    () => ({
      total: total,
      delivered: allOrders.filter((o) => o.orderStatus === "delivered").length,
      pending: allOrders.filter(
        (o) => o.orderStatus === "processing" || o.orderStatus === "confirmed",
      ).length,
      revenue: allOrders
        .filter((o) => o.paymentStatus === "paid")
        .reduce((s, o) => s + o.pricing.total, 0),
    }),
    [allOrders, total],
  );

  /* ── Client-side sort ── */
  const sorted = useMemo(() => {
    const list = [...allOrders];
    list.sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";
      if (sortField === "pricing.total") {
        av = a.pricing.total;
        bv = b.pricing.total;
      } else {
        av =
          ((a as unknown as Record<string, unknown>)[sortField] as string) ??
          "";
        bv =
          ((b as unknown as Record<string, unknown>)[sortField] as string) ??
          "";
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [allOrders, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => (
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
  );

  const openOrder = useCallback((order: Order) => {
    setSelectedOrder(order);
    (document.getElementById(MODAL_ID) as HTMLDialogElement)?.showModal();
  }, []);

  const clearFilters = () => {
    setSearch("");
    setOrderStatus("");
    setPaymentStatus("");
    setPaymentMethod("");
    setDateFrom("");
    setDateTo("");
  };

  const hasFilter =
    search ||
    orderStatus ||
    paymentStatus ||
    paymentMethod ||
    dateFrom ||
    dateTo;

  /* ── Loading ── */
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
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Orders
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetchOrders()}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                               text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400
                               hover:border-teal-300 dark:hover:border-teal-500/50 transition-all duration-200"
            >
              <RefreshCw size={15} />
            </button>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold
                             bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
            >
              {sorted.length} / {stats.total} orders
            </span>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Orders"
            value={stats.total}
            color="text-gray-700 dark:text-gray-300"
            icon={ShoppingBag}
          />
          <StatCard
            label="Delivered"
            value={stats.delivered}
            color="text-emerald-600 dark:text-emerald-400"
            icon={CheckCircle2}
            sub="completed"
          />
          <StatCard
            label="In Progress"
            value={stats.pending}
            color="text-amber-600 dark:text-amber-400"
            icon={Clock}
            sub="processing + confirmed"
          />
          <StatCard
            label="Revenue (Paid)"
            value={`৳${stats.revenue.toLocaleString()}`}
            color="text-teal-600 dark:text-teal-400"
            icon={CreditCard}
          />
        </div>

        {/* ── Search + Filters ── */}
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm
                           bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
                           text-gray-900 dark:text-white placeholder-gray-400
                           focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  showFilters
                    ? "bg-teal-500 text-white"
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                }`}
            >
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Filters</span>
              {hasFilter && (
                <span className="w-2 h-2 rounded-full bg-white/80 inline-block" />
              )}
            </button>
            {hasFilter && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold
                                 text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          {showFilters && (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4
                            bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <div>
                <label className={labelCls}>Order Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className={inputCls}
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
                <label className={labelCls}>Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className={inputCls}
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
                <label className={labelCls}>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={inputCls}
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
                <label className={labelCls}>Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        {sorted.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 gap-3
                          bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800"
          >
            <PackageOpen
              size={40}
              className="text-gray-300 dark:text-gray-700"
            />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No orders found
            </p>
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
                    {[
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
                    ].map(({ label, field, hidden }) => (
                      <th
                        key={label}
                        className={`text-left px-4 py-3.5 first:pl-5 ${hidden ?? ""}`}
                      >
                        {field ? (
                          <button
                            onClick={() => toggleSort(field)}
                            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider
                                             text-gray-500 dark:text-gray-500
                                             hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                          >
                            {label}
                            <SortIcon field={field} />
                          </button>
                        ) : (
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">
                            {label}
                          </span>
                        )}
                      </th>
                    ))}
                    <th className="px-4 py-3.5 text-right">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {sorted.map((order) => {
                    const osCfg =
                      ORDER_STATUS[order.orderStatus] ??
                      ORDER_STATUS.processing;
                    const psCfg =
                      PAYMENT_STATUS[order.paymentStatus] ??
                      PAYMENT_STATUS.pending;
                    const OsIcon = osCfg.icon;

                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                        onClick={() => openOrder(order)}
                      >
                        {/* Order ID */}
                        <td className="pl-5 pr-4 py-4">
                          <p className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                            {order.orderId}
                          </p>
                          <Badge
                            cls={PAYMENT_METHOD[order.paymentMethod]?.cls ?? ""}
                            label={
                              PAYMENT_METHOD[order.paymentMethod]?.label ??
                              order.paymentMethod
                            }
                          />
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-1">
                            {order.deliveryAddress.fullName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {order.deliveryAddress.phone}
                          </p>
                        </td>

                        {/* Items count */}
                        <td className="px-4 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            {order.items.slice(0, 3).map((item, i) =>
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
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-4 py-4">
                          <p className="font-bold text-gray-900 dark:text-white">
                            ৳{order.pricing.total.toLocaleString()}
                          </p>
                        </td>

                        {/* Payment status */}
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <Badge cls={psCfg.cls} label={psCfg.label} />
                        </td>

                        {/* Order status */}
                        <td className="px-4 py-4">
                          <Badge
                            cls={osCfg.cls}
                            label={osCfg.label}
                            icon={OsIcon}
                          />
                        </td>

                        {/* Date */}
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-BD",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {new Date(order.createdAt).toLocaleTimeString(
                              "en-BD",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                        </td>

                        {/* Actions */}
                        <td
                          className="px-4 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => openOrder(order)}
                            className="p-2 rounded-lg text-gray-400
                                             hover:bg-teal-50 dark:hover:bg-teal-500/10
                                             hover:text-teal-600 dark:hover:text-teal-400
                                             transition-all duration-150 flex items-center gap-1"
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

            {/* Footer */}
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

      {/* Modal */}
      <OrderModal
        order={selectedOrder}
        modalId={MODAL_ID}
        onUpdate={refetchOrders}
      />
    </>
  );
};

export default AdminOrdersPage;

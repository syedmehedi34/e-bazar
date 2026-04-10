"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Tag,
  Plus,
  Search,
  X,
  Edit3,
  Trash2,
  Loader2,
  Save,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Users,
  ShoppingBag,
  Percent,
  DollarSign,
  Truck,
  Gift,
  Copy,
  Check,
  AlertTriangle,
  Eye,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
interface IUsageRecord {
  userId: string;
  orderId: string;
  usedAt: string;
}
interface ICoupon {
  _id: string;
  code: string;
  type: "percentage" | "fixed_amount" | "free_shipping" | "buy_x_get_y";
  value: number;
  maxDiscountAmount: number | null;
  buyQuantity: number | null;
  getQuantity: number | null;
  minOrderAmount: number;
  applicableTo: "all" | "specific_products" | "specific_categories";
  productIds: string[];
  categories: string[];
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  usageLimit: number | null;
  perUserLimit: number;
  usedCount: number;
  usageRecords: IUsageRecord[];
  createdAt: string;
}

type ModalMode = "view" | "add" | "edit";

// ── Styles ─────────────────────────────────────────────────────────
const inp = `w-full px-3 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800
  border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white
  placeholder-gray-400 focus:outline-none focus:border-teal-500
  focus:ring-2 focus:ring-teal-500/15 transition-all`;
const lbl =
  "block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5";

const MODAL_ID = "coupon-modal";
const openModal = () =>
  (document.getElementById(MODAL_ID) as HTMLDialogElement)?.showModal();
const closeModal = () =>
  (document.getElementById(MODAL_ID) as HTMLDialogElement)?.close();

// ── Type config ────────────────────────────────────────────────────
const TYPE_CFG = {
  percentage: {
    label: "Percentage",
    icon: Percent,
    cls: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  fixed_amount: {
    label: "Fixed Amount",
    icon: DollarSign,
    cls: "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  free_shipping: {
    label: "Free Shipping",
    icon: Truck,
    cls: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  buy_x_get_y: {
    label: "Buy X Get Y",
    icon: Gift,
    cls: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
};

const emptyForm = () => ({
  code: "",
  type: "percentage" as ICoupon["type"],
  value: 0,
  maxDiscountAmount: "" as string | number,
  buyQuantity: "" as string | number,
  getQuantity: "" as string | number,
  minOrderAmount: 0,
  applicableTo: "all" as ICoupon["applicableTo"],
  productIds: "",
  categories: "",
  startDate: "",
  endDate: "",
  isActive: true,
  usageLimit: "" as string | number,
  perUserLimit: 1,
});

type FormState = ReturnType<typeof emptyForm>;

// ── Helpers ────────────────────────────────────────────────────────
const fmt = (n: number) => `৳${n.toLocaleString("en-BD")}`;
const fmtDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
const isExpired = (c: ICoupon) =>
  c.endDate ? new Date(c.endDate) < new Date() : false;
const isNotStarted = (c: ICoupon) =>
  c.startDate ? new Date(c.startDate) > new Date() : false;

const couponStatus = (c: ICoupon) => {
  if (!c.isActive)
    return {
      label: "Inactive",
      cls: "bg-gray-100 dark:bg-gray-800 text-gray-500",
    };
  if (isExpired(c))
    return {
      label: "Expired",
      cls: "bg-red-50 dark:bg-red-500/10 text-red-500",
    };
  if (isNotStarted(c))
    return {
      label: "Scheduled",
      cls: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  return {
    label: "Active",
    cls: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
};

const discountLabel = (c: ICoupon) => {
  switch (c.type) {
    case "percentage":
      return `${c.value}% off${c.maxDiscountAmount ? ` (max ${fmt(c.maxDiscountAmount)})` : ""}`;
    case "fixed_amount":
      return `${fmt(c.value)} off`;
    case "free_shipping":
      return "Free shipping";
    case "buy_x_get_y":
      return `Buy ${c.buyQuantity ?? "?"} Get ${c.getQuantity ?? "?"} Free`;
    default:
      return "—";
  }
};

// ── Main Page ──────────────────────────────────────────────────────
const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortField, setSortField] = useState<
    "code" | "usedCount" | "createdAt"
  >("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Modal
  const [mode, setMode] = useState<ModalMode>("view");
  const [selected, setSelected] = useState<ICoupon | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // ── Fetch ────────────────────────────────────────────────────
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterType) params.set("type", filterType);
      const res = await fetch(`/api/coupons?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCoupons(data.coupons ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [search, filterType]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // ── Client-side filter by status + sort ──────────────────────
  const filtered = useMemo(() => {
    let list = [...coupons];
    if (filterStatus === "active")
      list = list.filter(
        (c) => c.isActive && !isExpired(c) && !isNotStarted(c),
      );
    if (filterStatus === "inactive") list = list.filter((c) => !c.isActive);
    if (filterStatus === "expired") list = list.filter((c) => isExpired(c));
    if (filterStatus === "scheduled")
      list = list.filter((c) => isNotStarted(c));
    list.sort((a, b) => {
      const av = (a as never as Record<string, unknown>)[sortField] ?? "";
      const bv = (b as never as Record<string, unknown>)[sortField] ?? "";
      return av < bv
        ? sortDir === "asc"
          ? -1
          : 1
        : av > bv
          ? sortDir === "asc"
            ? 1
            : -1
          : 0;
    });
    return list;
  }, [coupons, filterStatus, sortField, sortDir]);

  // ── Stats ────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: coupons.length,
      active: coupons.filter((c) => c.isActive && !isExpired(c)).length,
      expired: coupons.filter((c) => isExpired(c)).length,
      totalUses: coupons.reduce((s, c) => s + c.usedCount, 0),
    }),
    [coupons],
  );

  const toggleSort = (f: typeof sortField) => {
    if (sortField === f) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(f);
      setSortDir("desc");
    }
  };

  // ── Open modal helpers ────────────────────────────────────────
  const openView = (c: ICoupon) => {
    setSelected(c);
    setMode("view");
    openModal();
  };

  const openAdd = () => {
    setSelected(null);
    setForm(emptyForm());
    setMode("add");
    openModal();
  };

  const openEdit = (c: ICoupon) => {
    setSelected(c);
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      maxDiscountAmount: c.maxDiscountAmount ?? "",
      buyQuantity: c.buyQuantity ?? "",
      getQuantity: c.getQuantity ?? "",
      minOrderAmount: c.minOrderAmount,
      applicableTo: c.applicableTo,
      productIds: c.productIds.join(", "),
      categories: c.categories.join(", "),
      startDate: c.startDate ? c.startDate.slice(0, 10) : "",
      endDate: c.endDate ? c.endDate.slice(0, 10) : "",
      isActive: c.isActive,
      usageLimit: c.usageLimit ?? "",
      perUserLimit: c.perUserLimit,
    });
    setMode("edit");
    openModal();
  };

  // ── Save ─────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.code.trim()) {
      toast.error("Code is required.");
      return;
    }
    if (form.value === 0 && form.type !== "free_shipping") {
      toast.error("Value is required.");
      return;
    }

    const payload = {
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value: Number(form.value),
      maxDiscountAmount:
        form.maxDiscountAmount !== "" ? Number(form.maxDiscountAmount) : null,
      buyQuantity: form.buyQuantity !== "" ? Number(form.buyQuantity) : null,
      getQuantity: form.getQuantity !== "" ? Number(form.getQuantity) : null,
      minOrderAmount: Number(form.minOrderAmount),
      applicableTo: form.applicableTo,
      productIds: form.productIds
        ? form.productIds
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      categories: form.categories
        ? form.categories
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      isActive: form.isActive,
      usageLimit: form.usageLimit !== "" ? Number(form.usageLimit) : null,
      perUserLimit: Number(form.perUserLimit),
    };

    setSaving(true);
    try {
      const url =
        mode === "edit" ? `/api/coupons/${selected?._id}` : "/api/coupons";
      const method = mode === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message ?? "Failed to save.");
        return;
      }
      toast.success(mode === "edit" ? "Coupon updated!" : "Coupon created!");
      closeModal();
      fetchCoupons();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Coupon deleted.");
      fetchCoupons();
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setDeleting(null);
    }
  };

  // ── Toggle active ─────────────────────────────────────────────
  const handleToggle = async (c: ICoupon) => {
    try {
      const res = await fetch(`/api/coupons/${c._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      if (!res.ok) throw new Error();
      toast.success(c.isActive ? "Coupon deactivated." : "Coupon activated.");
      fetchCoupons();
    } catch {
      toast.error("Failed to toggle.");
    }
  };

  // ── Copy code ─────────────────────────────────────────────────
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  // ── Loading ───────────────────────────────────────────────────
  if (loading && coupons.length === 0)
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-gray-100 dark:bg-gray-800" />
      </div>
    );

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Coupons & Discounts
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Create and manage promotional codes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchCoupons}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-teal-500 hover:border-teal-300 transition-all"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-white transition-all shadow-sm shadow-teal-500/20"
            >
              <Plus size={15} /> Add Coupon
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Coupons",
              value: stats.total,
              icon: Tag,
              color: "text-gray-700 dark:text-gray-300",
              bg: "bg-gray-100 dark:bg-gray-800",
            },
            {
              label: "Active",
              value: stats.active,
              icon: ToggleRight,
              color: "text-teal-600 dark:text-teal-400",
              bg: "bg-teal-50 dark:bg-teal-500/10",
            },
            {
              label: "Expired",
              value: stats.expired,
              icon: Calendar,
              color: "text-red-500",
              bg: "bg-red-50 dark:bg-red-500/10",
            },
            {
              label: "Total Uses",
              value: stats.totalUses,
              icon: Users,
              color: "text-violet-600 dark:text-violet-400",
              bg: "bg-violet-50 dark:bg-violet-500/10",
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {label}
                </p>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}
                >
                  <Icon size={15} className={color} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search coupon code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
          >
            <option value="">All Types</option>
            {Object.entries(TYPE_CFG).map(([v, { label }]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="scheduled">Scheduled</option>
          </select>
          {(search || filterType || filterStatus) && (
            <button
              onClick={() => {
                setSearch("");
                setFilterType("");
                setFilterStatus("");
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-500 flex items-center gap-2">
            <AlertTriangle size={14} /> Failed to load coupons.
            <button onClick={fetchCoupons} className="underline font-semibold">
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {filtered.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <Tag size={40} className="text-gray-300 dark:text-gray-700" />
            <p className="text-gray-500 font-medium">No coupons found</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                    {[
                      { label: "Code", field: "code" as const },
                      { label: "Type", field: null },
                      {
                        label: "Discount",
                        field: null,
                        hidden: "hidden md:table-cell",
                      },
                      {
                        label: "Uses",
                        field: "usedCount" as const,
                        hidden: "hidden sm:table-cell",
                      },
                      {
                        label: "Validity",
                        field: null,
                        hidden: "hidden lg:table-cell",
                      },
                      { label: "Status", field: null },
                    ].map(({ label, field, hidden }) => (
                      <th
                        key={label}
                        className={`text-left px-4 py-3.5 first:pl-5 ${hidden ?? ""}`}
                      >
                        {field ? (
                          <button
                            onClick={() => toggleSort(field)}
                            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-teal-600 transition-colors"
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
                  {filtered.map((c) => {
                    const tc = TYPE_CFG[c.type];
                    const TypeIcon = tc.icon;
                    const st = couponStatus(c);
                    return (
                      <tr
                        key={c._id}
                        onClick={() => openView(c)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      >
                        {/* Code */}
                        <td className="pl-5 pr-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                              {c.code}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyCode(c.code);
                              }}
                              className="p-1 rounded text-gray-400 hover:text-teal-600 transition-colors"
                            >
                              {copied === c.code ? (
                                <Check size={11} className="text-teal-500" />
                              ) : (
                                <Copy size={11} />
                              )}
                            </button>
                          </div>
                          {c.minOrderAmount > 0 && (
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Min. {fmt(c.minOrderAmount)}
                            </p>
                          )}
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${tc.cls}`}
                          >
                            <TypeIcon size={10} />
                            {tc.label}
                          </span>
                        </td>

                        {/* Discount */}
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">
                            {discountLabel(c)}
                          </p>
                        </td>

                        {/* Uses */}
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-gray-800 dark:text-white">
                              {c.usedCount}
                            </span>
                            {c.usageLimit && (
                              <span className="text-xs text-gray-400">
                                / {c.usageLimit}
                              </span>
                            )}
                          </div>
                          {c.usageLimit && (
                            <div className="w-16 h-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full bg-teal-500 rounded-full"
                                style={{
                                  width: `${Math.min(100, (c.usedCount / c.usageLimit) * 100)}%`,
                                }}
                              />
                            </div>
                          )}
                        </td>

                        {/* Validity */}
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <p className="text-xs text-gray-500">
                            {fmtDate(c.startDate)} → {fmtDate(c.endDate)}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${st.cls}`}
                          >
                            {st.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td
                          className="px-4 py-3.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openView(c)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-all"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => openEdit(c)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleToggle(c)}
                              title={c.isActive ? "Deactivate" : "Activate"}
                              className={`p-1.5 rounded-lg transition-all ${c.isActive ? "text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-500/10" : "text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10"}`}
                            >
                              {c.isActive ? (
                                <ToggleRight size={14} />
                              ) : (
                                <ToggleLeft size={14} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
                              disabled={deleting === c._id}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all disabled:opacity-50"
                            >
                              {deleting === c._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {coupons.length}
                </span>{" "}
                coupons
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <dialog id={MODAL_ID} className="modal">
        <div className="modal-box max-w-2xl bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              {mode === "view"
                ? "Coupon Details"
                : mode === "add"
                  ? "New Coupon"
                  : "Edit Coupon"}
            </h2>
            <button
              onClick={closeModal}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[72vh] overflow-y-auto p-6">
            {/* ── VIEW MODE ── */}
            {mode === "view" &&
              selected &&
              (() => {
                const tc = TYPE_CFG[selected.type];
                const TypeIcon = tc.icon;
                const st = couponStatus(selected);
                return (
                  <div className="space-y-5">
                    {/* Code + status row */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tc.cls}`}
                        >
                          <TypeIcon size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black font-mono text-gray-900 dark:text-white tracking-widest">
                              {selected.code}
                            </span>
                            <button
                              onClick={() => copyCode(selected.code)}
                              className="text-gray-400 hover:text-teal-600 transition-colors"
                            >
                              {copied === selected.code ? (
                                <Check size={13} className="text-teal-500" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {tc.label} — {discountLabel(selected)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${st.cls}`}
                      >
                        {st.label}
                      </span>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        {
                          label: "Min. Order",
                          value: fmt(selected.minOrderAmount),
                        },
                        {
                          label: "Usage Limit",
                          value: selected.usageLimit
                            ? `${selected.usedCount} / ${selected.usageLimit}`
                            : `${selected.usedCount} / ∞`,
                        },
                        {
                          label: "Per User",
                          value: `${selected.perUserLimit}x`,
                        },
                        {
                          label: "Applies To",
                          value: selected.applicableTo.replace("_", " "),
                        },
                        {
                          label: "Start Date",
                          value: fmtDate(selected.startDate),
                        },
                        { label: "End Date", value: fmtDate(selected.endDate) },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                            {label}
                          </p>
                          <p className="text-sm font-bold text-gray-800 dark:text-white capitalize">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Usage progress */}
                    {selected.usageLimit && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                          <span>Usage progress</span>
                          <span>
                            {Math.round(
                              (selected.usedCount / selected.usageLimit) * 100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (selected.usedCount / selected.usageLimit) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Categories / Products */}
                    {selected.categories.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                          Categories
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {selected.categories.map((c) => (
                            <span
                              key={c}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent usage */}
                    {selected.usageRecords.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                          <Users size={11} /> Recent Uses (
                          {selected.usageRecords.length})
                        </p>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {[...selected.usageRecords]
                            .reverse()
                            .slice(0, 10)
                            .map((r, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-xs"
                              >
                                <span className="text-gray-500 font-mono">
                                  {r.userId.slice(-8)}
                                </span>
                                <span className="text-gray-400 font-mono">
                                  {r.orderId}
                                </span>
                                <span className="text-gray-400">
                                  {new Date(r.usedAt).toLocaleDateString(
                                    "en-BD",
                                    { day: "numeric", month: "short" },
                                  )}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

            {/* ── ADD / EDIT MODE ── */}
            {(mode === "add" || mode === "edit") && (
              <div className="space-y-5">
                {/* Code + Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Code *</label>
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          code: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="e.g. SAVE20"
                      className={`${inp} font-mono font-bold tracking-widest`}
                      readOnly={mode === "edit"}
                    />
                  </div>
                  <div>
                    <label className={lbl}>Type *</label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          type: e.target.value as ICoupon["type"],
                        }))
                      }
                      className={inp}
                    >
                      {Object.entries(TYPE_CFG).map(([v, { label }]) => (
                        <option key={v} value={v}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Value fields */}
                {form.type !== "free_shipping" &&
                  form.type !== "buy_x_get_y" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>
                          {form.type === "percentage"
                            ? "Percentage (%)"
                            : "Amount (৳)"}{" "}
                          *
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={form.value}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              value: Number(e.target.value),
                            }))
                          }
                          className={inp}
                          placeholder="0"
                        />
                      </div>
                      {form.type === "percentage" && (
                        <div>
                          <label className={lbl}>Max Discount (৳)</label>
                          <input
                            type="number"
                            min={0}
                            value={form.maxDiscountAmount}
                            onChange={(e) =>
                              setForm((p) => ({
                                ...p,
                                maxDiscountAmount: e.target.value,
                              }))
                            }
                            className={inp}
                            placeholder="No cap"
                          />
                        </div>
                      )}
                    </div>
                  )}

                {/* buy_x_get_y */}
                {form.type === "buy_x_get_y" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>Buy Quantity</label>
                      <input
                        type="number"
                        min={1}
                        value={form.buyQuantity}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            buyQuantity: e.target.value,
                          }))
                        }
                        className={inp}
                        placeholder="e.g. 2"
                      />
                    </div>
                    <div>
                      <label className={lbl}>Get Quantity Free</label>
                      <input
                        type="number"
                        min={1}
                        value={form.getQuantity}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            getQuantity: e.target.value,
                          }))
                        }
                        className={inp}
                        placeholder="e.g. 1"
                      />
                    </div>
                  </div>
                )}

                {/* Conditions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Min. Order Amount (৳)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.minOrderAmount}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          minOrderAmount: Number(e.target.value),
                        }))
                      }
                      className={inp}
                      placeholder="0 = no minimum"
                    />
                  </div>
                  <div>
                    <label className={lbl}>Applies To</label>
                    <select
                      value={form.applicableTo}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          applicableTo: e.target
                            .value as ICoupon["applicableTo"],
                        }))
                      }
                      className={inp}
                    >
                      <option value="all">All Products</option>
                      <option value="specific_products">
                        Specific Products
                      </option>
                      <option value="specific_categories">
                        Specific Categories
                      </option>
                    </select>
                  </div>
                </div>

                {/* Scope inputs */}
                {form.applicableTo === "specific_categories" && (
                  <div>
                    <label className={lbl}>Categories (comma separated)</label>
                    <input
                      type="text"
                      value={form.categories}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, categories: e.target.value }))
                      }
                      className={inp}
                      placeholder="Electronics, Clothing, Books"
                    />
                  </div>
                )}
                {form.applicableTo === "specific_products" && (
                  <div>
                    <label className={lbl}>Product IDs (comma separated)</label>
                    <input
                      type="text"
                      value={form.productIds}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, productIds: e.target.value }))
                      }
                      className={inp}
                      placeholder="productId1, productId2"
                    />
                  </div>
                )}

                {/* Validity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Start Date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, startDate: e.target.value }))
                      }
                      className={inp}
                    />
                  </div>
                  <div>
                    <label className={lbl}>End Date</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, endDate: e.target.value }))
                      }
                      className={inp}
                    />
                  </div>
                </div>

                {/* Usage limits */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Total Usage Limit</label>
                    <input
                      type="number"
                      min={1}
                      value={form.usageLimit}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, usageLimit: e.target.value }))
                      }
                      className={inp}
                      placeholder="Leave blank = unlimited"
                    />
                  </div>
                  <div>
                    <label className={lbl}>Per User Limit</label>
                    <input
                      type="number"
                      min={1}
                      value={form.perUserLimit}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          perUserLimit: Number(e.target.value),
                        }))
                      }
                      className={inp}
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      Active
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Coupon can be used by customers
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, isActive: !p.isActive }))
                    }
                    className={`w-12 h-6 rounded-full relative transition-colors ${form.isActive ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-6" : "translate-x-0.5"}`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
            <div>
              {mode === "view" && selected && (
                <button
                  onClick={() => openEdit(selected)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 transition-colors"
                >
                  <Edit3 size={12} /> Edit
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors"
              >
                {mode === "view" ? "Close" : "Cancel"}
              </button>
              {(mode === "add" || mode === "edit") && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-teal-500 hover:bg-teal-400 disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  {mode === "add" ? "Create Coupon" : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default AdminCouponsPage;

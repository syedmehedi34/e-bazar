"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useFetchProduct } from "@/hook/useFetchProduct";
import {
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  PackageOpen,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Star,
  Tag,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { IProduct } from "../../../../../models/Products";

/* ─── Types ─────────────────────────────────────────── */
type SortField =
  | "title"
  | "price"
  | "stock"
  | "totalSold"
  | "averageRating"
  | "status";
type SortDir = "asc" | "desc";
type Product = IProduct & { _id: string };

/* ─── Status badge config ────────────────────────────── */
const STATUS_CONFIG = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  inactive: {
    label: "Inactive",
    icon: Clock,
    cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  "out-of-stock": {
    label: "Out of Stock",
    icon: XCircle,
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  discontinued: {
    label: "Discontinued",
    icon: Ban,
    cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  },
};

/* ─── Stat Card ──────────────────────────────────────── */
const StatCard = ({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
      {label}
    </p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400">{sub}</p>}
  </div>
);

/* ─── Edit Modal (daisyUI dialog) ────────────────────── */
const EditModal = ({
  product,
  modalId,
  onSave,
}: {
  product: Product | null;
  modalId: string;
  onSave: (id: string, data: Partial<Product>) => Promise<void>;
}) => {
  const [form, setForm] = useState<{
    title: string;
    price: number;
    discountPrice: number;
    stock: number;
    status: string;
    category: string;
    subCategory: string;
    brand: string;
    description: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync form when product changes
  React.useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        status: product.status,
        category: product.category,
        subCategory: product.subCategory,
        brand: product.brand,
        description: product.description,
      });
    }
  }, [product]);

  const handleEditProduct = async () => {
    if (!product || !form) return;
    setSaving(true);
    await onSave(product._id, form as Partial<Product>);
    setSaving(false);
    // Close daisyUI modal
    (document.getElementById(modalId) as HTMLDialogElement)?.close();
  };

  const inputCls = `w-full px-3 py-2.5 rounded-xl text-sm
    bg-gray-50 dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    text-gray-900 dark:text-white
    focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15
    transition-all duration-200`;

  const labelCls =
    "block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500";

  if (!form) return null;

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box max-w-2xl bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {product?.images?.[0] && (
              <div className="relative w-10 h-10 rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
                <Image
                  src={product.images[0]}
                  fill
                  alt=""
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Edit Product
              </p>
              <p className="text-xs text-gray-400 font-mono">{product?._id}</p>
            </div>
          </div>
          <form method="dialog">
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                               hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </form>
        </div>

        {/* Form body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className={labelCls}>Product Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((p) => p && { ...p, title: e.target.value })
              }
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {(["price", "discountPrice", "stock"] as const).map((key) => (
              <div key={key} className="space-y-1.5">
                <label className={labelCls}>
                  {key === "price"
                    ? "Price (BDT)"
                    : key === "discountPrice"
                      ? "Discount Price"
                      : "Stock"}
                </label>
                <input
                  type="number"
                  value={form[key]}
                  onChange={(e) =>
                    setForm((p) => p && { ...p, [key]: Number(e.target.value) })
                  }
                  className={inputCls}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => p && { ...p, category: e.target.value })
                }
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Sub-Category</label>
              <input
                type="text"
                value={form.subCategory}
                onChange={(e) =>
                  setForm((p) => p && { ...p, subCategory: e.target.value })
                }
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) =>
                  setForm((p) => p && { ...p, brand: e.target.value })
                }
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => p && { ...p, status: e.target.value })
                }
                className={inputCls}
              >
                {["active", "inactive", "out-of-stock", "discontinued"].map(
                  (o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelCls}>Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((p) => p && { ...p, description: e.target.value })
              }
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <form method="dialog">
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold
                               text-gray-600 dark:text-gray-400
                               bg-gray-100 dark:bg-gray-800
                               hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </form>
          <button
            onClick={handleEditProduct}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white
                             bg-teal-500 hover:bg-teal-400
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center gap-2 transition-all duration-200"
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

/* ─── Main Page ──────────────────────────────────────── */
const MODAL_ID = "edit-product-modal";

const AdminProductsPage = () => {
  const {
    products,
    categories,
    productsLoading,
    productsError,
    refetchProducts,
  } = useFetchProduct();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [editProd, setEditProd] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  /* ── Derived data ── */
  const allProducts = useMemo(() => (products || []) as Product[], [products]);

  const stats = useMemo(
    () => ({
      total: allProducts.length,
      active: allProducts.filter((p) => p.status === "active").length,
      outOfStock: allProducts.filter((p) => p.status === "out-of-stock").length,
      lowStock: allProducts.filter((p) => p.stock > 0 && p.stock <= 5).length,
    }),
    [allProducts],
  );

  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (search)
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.brand?.toLowerCase().includes(search.toLowerCase()) ||
          p.sku?.toLowerCase().includes(search.toLowerCase()),
      );

    if (catFilter !== "all")
      list = list.filter((p) => p.category === catFilter);

    if (statusFilter !== "all")
      list = list.filter((p) => p.status === statusFilter);

    list.sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [allProducts, search, catFilter, statusFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
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

  /* ── Open edit modal ── */
  const openEdit = (product: Product) => {
    setEditProd(product);
    (document.getElementById(MODAL_ID) as HTMLDialogElement)?.showModal();
  };

  /* ── Save handler ── */
  const handleEditProduct = async (id: string, data: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Product updated successfully!");
      refetchProducts();
    } catch {
      toast.error("Failed to update product.");
    }
  };

  /* ── Delete handler with toast confirm ── */
  const handleDelete = (product: Product) => {
    toast(
      ({ closeToast }) => (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            Delete &ldquo;{product.title.slice(0, 30)}
            {product.title.length > 30 ? "…" : ""}&rdquo;?
          </p>
          <p className="text-xs text-gray-500">This action cannot be undone.</p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={async () => {
                closeToast?.();
                try {
                  const res = await fetch(`/api/products/${product._id}`, {
                    method: "DELETE",
                  });
                  if (!res.ok) throw new Error();
                  toast.success("Product deleted.", {
                    position: "top-center",
                  });
                  refetchProducts();
                } catch {
                  toast.error("Failed to delete product.", {
                    position: "top-center",
                  });
                }
              }}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white
                         bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center gap-1"
            >
              <Trash2 size={11} /> Confirm Delete
            </button>
            <button
              onClick={closeToast}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold
                         bg-gray-100 dark:bg-gray-700
                         text-gray-600 dark:text-gray-300
                         hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeButton: false,
        position: "top-center",
        icon: <AlertTriangle size={18} className="text-red-500 shrink-0" />,
      },
    );
  };

  /* ── Loading / Error ── */
  if (productsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-800" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 animate-spin" />
          </div>
          <p className="text-sm text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <AlertTriangle size={32} className="text-red-400 mx-auto" />
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Failed to load products
          </p>
          <button
            onClick={() => refetchProducts()}
            className="text-sm text-teal-500 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-6">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Products
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage, edit and remove your store products
            </p>
          </div>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold
                           bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
          >
            {filtered.length} / {stats.total} products
          </span>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Products"
            value={stats.total}
            color="text-gray-900 dark:text-white"
          />
          <StatCard
            label="Active"
            value={stats.active}
            color="text-emerald-600 dark:text-emerald-400"
            sub="currently on sale"
          />
          <StatCard
            label="Out of Stock"
            value={stats.outOfStock}
            color="text-amber-600 dark:text-amber-400"
          />
          <StatCard
            label="Low Stock"
            value={stats.lowStock}
            color="text-red-500 dark:text-red-400"
            sub="≤ 5 units left"
          />
        </div>

        {/* ── Search + Filter bar ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by title, brand or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm
                         bg-white dark:bg-gray-900
                         border border-gray-200 dark:border-gray-800
                         text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-600
                         focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15
                         transition-all duration-200"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                       bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
                       text-gray-600 dark:text-gray-400"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>

          <div
            className={`flex flex-col sm:flex-row gap-3 ${showFilters ? "flex" : "hidden sm:flex"}`}
          >
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900
                               border border-gray-200 dark:border-gray-800
                               text-gray-700 dark:text-gray-300
                               focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15
                               transition-all duration-200"
            >
              <option value="all">All Categories</option>
              {(categories as { name: string }[]).map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900
                               border border-gray-200 dark:border-gray-800
                               text-gray-700 dark:text-gray-300
                               focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15
                               transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>

        {/* ── Table ── */}
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 gap-3
                          bg-white dark:bg-gray-900 rounded-2xl
                          border border-gray-200 dark:border-gray-800"
          >
            <PackageOpen
              size={40}
              className="text-gray-300 dark:text-gray-700"
            />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No products found
            </p>
            <p className="text-sm text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl border border-gray-200 dark:border-gray-800
                          bg-white dark:bg-gray-900 overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                    <th className="text-left px-5 py-3.5">
                      <button
                        onClick={() => toggleSort("title")}
                        className="flex items-center gap-1 text-xs font-semibold uppercase
                                         tracking-wider text-gray-500 dark:text-gray-500
                                         hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        Product <SortIcon field="title" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3.5 hidden md:table-cell">
                      <span
                        className="flex items-center gap-1 text-xs font-semibold uppercase
                                       tracking-wider text-gray-500 dark:text-gray-500"
                      >
                        <Tag size={11} /> Category
                      </span>
                    </th>
                    <th className="text-left px-4 py-3.5">
                      <button
                        onClick={() => toggleSort("price")}
                        className="flex items-center gap-1 text-xs font-semibold uppercase
                                         tracking-wider text-gray-500 dark:text-gray-500
                                         hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        Price <SortIcon field="price" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3.5 hidden sm:table-cell">
                      <button
                        onClick={() => toggleSort("stock")}
                        className="flex items-center gap-1 text-xs font-semibold uppercase
                                         tracking-wider text-gray-500 dark:text-gray-500
                                         hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        Stock <SortIcon field="stock" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3.5 hidden lg:table-cell">
                      <button
                        onClick={() => toggleSort("averageRating")}
                        className="flex items-center gap-1 text-xs font-semibold uppercase
                                         tracking-wider text-gray-500 dark:text-gray-500
                                         hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        <Star size={11} /> Rating{" "}
                        <SortIcon field="averageRating" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3.5">
                      <button
                        onClick={() => toggleSort("status")}
                        className="flex items-center gap-1 text-xs font-semibold uppercase
                                         tracking-wider text-gray-500 dark:text-gray-500
                                         hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        Status <SortIcon field="status" />
                      </button>
                    </th>
                    <th className="px-4 py-3.5 text-right">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filtered.map((product) => {
                    const statusCfg =
                      STATUS_CONFIG[product.status] ?? STATUS_CONFIG.inactive;
                    const StatusIcon = statusCfg.icon;
                    const isLow = product.stock > 0 && product.stock <= 5;

                    return (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        {/* Product */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0
                                            ring-1 ring-gray-200 dark:ring-gray-700 bg-gray-100 dark:bg-gray-800"
                            >
                              {product.images?.[0] ? (
                                <Image
                                  src={product.images[0]}
                                  fill
                                  alt={product.title}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <PackageOpen
                                    size={16}
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white line-clamp-1 text-sm">
                                {product.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {product.brand}
                                {product.sku && (
                                  <span
                                    className="ml-2 font-mono text-[10px] bg-gray-100 dark:bg-gray-800
                                                   px-1.5 py-0.5 rounded text-gray-500"
                                  >
                                    {product.sku}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-4 hidden md:table-cell">
                          <div>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {product.category}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {product.subCategory}
                            </p>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                              ৳{product.discountPrice.toLocaleString()}
                            </p>
                            {product.discountPrice < product.price && (
                              <p className="text-[11px] text-gray-400 line-through">
                                ৳{product.price.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold
                            ${
                              isLow
                                ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                                : product.stock === 0
                                  ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            }`}
                          >
                            {product.stock}
                            {isLow && " ⚠"}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            <Star
                              size={12}
                              className="text-amber-400 fill-amber-400"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {product.averageRating?.toFixed(1) ?? "—"}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({product.reviews?.length ?? 0})
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1
                                           rounded-full text-[11px] font-semibold ${statusCfg.cls}`}
                          >
                            <StatusIcon size={10} />
                            {statusCfg.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEdit(product)}
                              className="p-2 rounded-lg text-gray-400
                                         hover:bg-teal-50 dark:hover:bg-teal-500/10
                                         hover:text-teal-600 dark:hover:text-teal-400
                                         transition-all duration-150"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="p-2 rounded-lg text-gray-400
                                         hover:bg-red-50 dark:hover:bg-red-500/10
                                         hover:text-red-500 dark:hover:text-red-400
                                         transition-all duration-150"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div
              className="px-5 py-3 border-t border-gray-100 dark:border-gray-800
                            flex items-center justify-between"
            >
              <p className="text-xs text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {stats.total}
                </span>{" "}
                products
              </p>
              {(search || catFilter !== "all" || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCatFilter("all");
                    setStatusFilter("all");
                  }}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── daisyUI Edit Modal ── */}
      <EditModal
        product={editProd}
        modalId={MODAL_ID}
        onSave={handleEditProduct}
      />
    </>
  );
};

export default AdminProductsPage;

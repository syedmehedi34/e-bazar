"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Package,
  DollarSign,
  Tag,
  Layers,
  Truck,
  FileText,
  Star,
  Plus,
  X,
  Loader2,
  ImagePlus,
  CheckCircle2,
  Upload,
  Trash2,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────── */
type FormState = {
  title: string;
  description: string;
  images: string[];
  price: number | "";
  discountPrice: number | "";
  costPrice: number | "";
  currency: string;
  category: string;
  subCategory: string;
  brand: string;
  tags: string[];
  sku: string;
  sizes: string[];
  colors: string[];
  stock: number | "";
  status: "active" | "inactive" | "out-of-stock" | "discontinued";
  weight: number | "";
  dimensions: { length: number | ""; width: number | ""; height: number | "" };
  freeShipping: boolean;
  countryOfOrigin: string;
  specifications: { key: string; value: string }[];
  warranty: string;
  featured: boolean;
};

type PreviewImage = {
  id: string; // stable unique ID for async tracking
  objectUrl: string; // local blob URL for preview
  url: string; // cloudinary URL after upload
  publicId: string; // cloudinary public_id for deletion
  loading: boolean;
};

const INITIAL: FormState = {
  title: "",
  description: "",
  images: [],
  price: "",
  discountPrice: "",
  costPrice: "",
  currency: "BDT",
  category: "",
  subCategory: "",
  brand: "",
  tags: [],
  sku: "",
  sizes: [],
  colors: [],
  stock: "",
  status: "active",
  weight: "",
  dimensions: { length: "", width: "", height: "" },
  freeShipping: false,
  countryOfOrigin: "",
  specifications: [],
  warranty: "",
  featured: false,
};

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

/* ─── Section Card ───────────────────────────────────── */
const SectionCard = ({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon size={14} />
      </div>
      <h2 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">
        {title}
      </h2>
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

/* ─── Chip Input ─────────────────────────────────────── */
const ChipInput = ({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) => {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !values.includes(t)) onChange([...values, t]);
    setInput("");
  };
  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder ?? `Add ${label.toLowerCase()}...`}
          className={inputCls}
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2.5 rounded-xl text-white bg-teal-500 hover:bg-teal-400 transition-colors shrink-0"
        >
          <Plus size={15} />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                                     bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400
                                     border border-teal-200 dark:border-teal-500/20"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="text-teal-400 hover:text-teal-600 transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Toggle ─────────────────────────────────────────── */
const Toggle = ({
  checked,
  onChange,
  label,
  sub,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  sub?: string;
}) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div
      className={`w-10 h-5 rounded-full transition-colors duration-200 relative shrink-0
                    ${checked ? "bg-teal-500" : "bg-gray-200 dark:bg-gray-700"}`}
      onClick={onChange}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                      ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </p>
      {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
    </div>
  </label>
);

/* ─── Image Uploader ─────────────────────────────────── */
const ImageUploader = ({
  onChange,
}: {
  onChange: (urls: string[]) => void;
}) => {
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync uploaded URLs to parent — runs AFTER render, never during
  React.useEffect(() => {
    const finalUrls = previews
      .filter((p) => !p.loading && p.url)
      .map((p) => p.url);
    onChange(finalUrls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previews]);

  const uploadToServer = async (
    file: File,
  ): Promise<{ url: string; publicId: string }> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return { url: data.url as string, publicId: data.publicId as string };
  };

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);

    // Validate
    const valid = arr.filter((f) => {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name}: not an image`);
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name}: exceeds 5MB`);
        return false;
      }
      return true;
    });

    if (!valid.length) return;

    if (previews.length + valid.length > 8) {
      toast.error("Maximum 8 images allowed");
      return;
    }

    // Assign a stable ID to each file — safe to use in async callbacks
    const entries = valid.map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      objectUrl: URL.createObjectURL(f),
    }));

    // Add loading placeholders immediately
    setPreviews((prev) => [
      ...prev,
      ...entries.map((e) => ({
        id: e.id,
        objectUrl: e.objectUrl,
        url: "",
        publicId: "",
        loading: true,
      })),
    ]);

    // Upload in parallel, find each by its stable ID
    await Promise.all(
      entries.map(async ({ id, file }) => {
        try {
          const { url: cloudUrl, publicId } = await uploadToServer(file);
          setPreviews((prev) =>
            prev.map((p) =>
              p.id === id
                ? { ...p, url: cloudUrl, publicId, loading: false }
                : p,
            ),
          );
        } catch {
          toast.error(`Failed to upload ${file.name}`);
          setPreviews((prev) => prev.filter((p) => p.id !== id));
        }
      }),
    );
  };

  const removeImage = async (idx: number) => {
    const target = previews[idx];
    // Remove from UI immediately
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    // If already uploaded to Cloudinary, delete it
    if (target?.publicId) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: target.publicId }),
        });
      } catch {
        // Silent fail — not critical if delete fails
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl
                    border-2 border-dashed cursor-pointer transition-all duration-200
                    ${
                      dragOver
                        ? "border-teal-400 bg-teal-50 dark:bg-teal-500/8"
                        : "border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                         ${dragOver ? "bg-teal-100 dark:bg-teal-500/15" : "bg-gray-100 dark:bg-gray-800"}`}
        >
          <Upload
            size={18}
            className={dragOver ? "text-teal-500" : "text-gray-400"}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Drop images here or <span className="text-teal-500">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            PNG, JPG, WEBP — max 5MB each, up to 8
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {previews.map((img, i) => (
            <div
              key={i}
              className="relative group aspect-square rounded-xl overflow-hidden
                                    ring-1 ring-gray-200 dark:ring-gray-700 bg-gray-100 dark:bg-gray-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.objectUrl}
                alt=""
                className="w-full h-full object-cover"
              />

              {/* Upload spinner overlay */}
              {img.loading && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1.5">
                  <Loader2 size={20} className="text-white animate-spin" />
                  <p className="text-[10px] text-white/80 font-medium">
                    Uploading...
                  </p>
                </div>
              )}

              {/* Uploaded ✓ flash */}
              {!img.loading && img.url && i === 0 && (
                <span
                  className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px]
                                 font-bold bg-teal-500 text-white shadow"
                >
                  Main
                </span>
              )}

              {/* Remove */}
              {!img.loading && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60
                                   text-white flex items-center justify-center
                                   opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {previews.filter((p) => !p.loading).length} / 8 uploaded
        </p>
      )}
    </div>
  );
};

/* ─── Main Page ──────────────────────────────────────── */
const AddProductPage = () => {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const addSpec = () =>
    set("specifications", [...form.specifications, { key: "", value: "" }]);
  const updateSpec = (i: number, field: "key" | "value", val: string) => {
    const u = [...form.specifications];
    u[i] = { ...u[i], [field]: val };
    set("specifications", u);
  };
  const removeSpec = (i: number) =>
    set(
      "specifications",
      form.specifications.filter((_, idx) => idx !== i),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Product title is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (form.price === "") return toast.error("Price is required");
    if (form.discountPrice === "")
      return toast.error("Discount price is required");
    if (!form.category.trim()) return toast.error("Category is required");
    if (!form.subCategory.trim())
      return toast.error("Sub-category is required");
    if (!form.brand.trim()) return toast.error("Brand is required");
    if (form.stock === "") return toast.error("Stock quantity is required");

    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice),
        costPrice: Number(form.costPrice) || 0,
        stock: Number(form.stock),
        weight: Number(form.weight) || 0,
        dimensions: {
          length: Number(form.dimensions.length) || 0,
          width: Number(form.dimensions.width) || 0,
          height: Number(form.dimensions.height) || 0,
        },
        specifications: form.specifications.filter(
          (s) => s.key.trim() && s.value.trim(),
        ),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to add product");
        return;
      }

      toast.success("Product published successfully!");
      setForm(INITIAL);
      router.push("/dashboard/admin/products");
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add Product
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Fill in the details to list a new product
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                           bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 shadow-sm"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <CheckCircle2 size={15} />
          )}
          {loading ? "Publishing..." : "Publish Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          <SectionCard
            icon={Package}
            title="Core Information"
            color="bg-teal-500/10 text-teal-500"
          >
            <div className="space-y-1.5">
              <label className={labelCls}>Product Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Premium Cotton Polo Shirt"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Description *</label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the product in detail..."
                className={`${inputCls} resize-none`}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>SKU</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                placeholder="e.g. PLO-CTN-BLK-XL"
                className={inputCls}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={DollarSign}
            title="Pricing"
            color="bg-emerald-500/10 text-emerald-500"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(
                [
                  ["price", "Original Price *"],
                  ["discountPrice", "Discount Price *"],
                  ["costPrice", "Cost Price"],
                ] as const
              ).map(([key, lbl]) => (
                <div key={key} className="space-y-1.5">
                  <label className={labelCls}>{lbl}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      ৳
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={form[key]}
                      onChange={(e) =>
                        set(
                          key,
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      placeholder="0"
                      className={`${inputCls} pl-7`}
                    />
                  </div>
                </div>
              ))}
            </div>
            {form.price !== "" &&
              form.discountPrice !== "" &&
              Number(form.price) > 0 && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg
                              bg-emerald-50 dark:bg-emerald-500/8 border border-emerald-200 dark:border-emerald-500/20"
                >
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {Math.round(
                      (1 - Number(form.discountPrice) / Number(form.price)) *
                        100,
                    )}
                    % discount applied
                  </p>
                </div>
              )}
            <div className="space-y-1.5">
              <label className={labelCls}>Currency</label>
              <select
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
                className={inputCls}
              >
                <option value="BDT">BDT — Bangladeshi Taka</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
              </select>
            </div>
          </SectionCard>

          <SectionCard
            icon={Layers}
            title="Variants"
            color="bg-violet-500/10 text-violet-500"
          >
            <ChipInput
              label="Sizes"
              values={form.sizes}
              onChange={(v) => set("sizes", v)}
              placeholder="e.g. S, M, L, XL"
            />
            <ChipInput
              label="Colors"
              values={form.colors}
              onChange={(v) => set("colors", v)}
              placeholder="e.g. Black, White"
            />
          </SectionCard>

          <SectionCard
            icon={FileText}
            title="Specifications"
            color="bg-sky-500/10 text-sky-500"
          >
            <div className="space-y-3">
              {form.specifications.map((spec, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Key (e.g. Material)"
                    value={spec.key}
                    onChange={(e) => updateSpec(i, "key", e.target.value)}
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 100% Cotton)"
                    value={spec.value}
                    onChange={(e) => updateSpec(i, "value", e.target.value)}
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-500
                                     hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpec}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium w-full justify-center
                                 border border-dashed border-gray-300 dark:border-gray-700
                                 text-gray-500 dark:text-gray-400
                                 hover:border-teal-400 hover:text-teal-500 transition-all duration-200"
              >
                <Plus size={14} /> Add Specification
              </button>
            </div>
            <div className="space-y-1.5 pt-2">
              <label className={labelCls}>Warranty</label>
              <input
                type="text"
                value={form.warranty}
                onChange={(e) => set("warranty", e.target.value)}
                placeholder="e.g. 1 Year Manufacturer Warranty"
                className={inputCls}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={Truck}
            title="Shipping"
            color="bg-amber-500/10 text-amber-500"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelCls}>Weight (kg)</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.weight}
                  onChange={(e) =>
                    set(
                      "weight",
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  placeholder="0.00"
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelCls}>Country of Origin</label>
                <input
                  type="text"
                  value={form.countryOfOrigin}
                  onChange={(e) => set("countryOfOrigin", e.target.value)}
                  placeholder="e.g. Bangladesh"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Dimensions (cm)</label>
              <div className="grid grid-cols-3 gap-3">
                {(["length", "width", "height"] as const).map((dim) => (
                  <div key={dim} className="space-y-1">
                    <p className="text-[10px] font-medium text-gray-400 tracking-wider capitalize">
                      {dim}
                    </p>
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={form.dimensions[dim]}
                      onChange={(e) =>
                        set("dimensions", {
                          ...form.dimensions,
                          [dim]:
                            e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                      placeholder="0"
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Toggle
              checked={form.freeShipping}
              onChange={() => set("freeShipping", !form.freeShipping)}
              label="Free Shipping"
            />
          </SectionCard>
        </div>

        {/* RIGHT (1/3) */}
        <div className="space-y-6">
          <SectionCard
            icon={ImagePlus}
            title="Product Images"
            color="bg-pink-500/10 text-pink-500"
          >
            <ImageUploader onChange={(urls) => set("images", urls)} />
          </SectionCard>

          <SectionCard
            icon={Tag}
            title="Classification"
            color="bg-orange-500/10 text-orange-500"
          >
            <div className="space-y-1.5">
              <label className={labelCls}>Category *</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="e.g. Men's Fashion"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Sub-Category *</label>
              <input
                type="text"
                value={form.subCategory}
                onChange={(e) => set("subCategory", e.target.value)}
                placeholder="e.g. T-Shirts"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Brand *</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="e.g. Lacoste"
                className={inputCls}
              />
            </div>
            <ChipInput
              label="Tags"
              values={form.tags}
              onChange={(v) => set("tags", v)}
              placeholder="e.g. summer, cotton"
            />
          </SectionCard>

          <SectionCard
            icon={Star}
            title="Inventory & Status"
            color="bg-indigo-500/10 text-indigo-500"
          >
            <div className="space-y-1.5">
              <label className={labelCls}>Stock Quantity *</label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) =>
                  set(
                    "stock",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="0"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  set("status", e.target.value as FormState["status"])
                }
                className={inputCls}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
            <Toggle
              checked={form.featured}
              onChange={() => set("featured", !form.featured)}
              label="Featured Product"
              sub="Show on homepage featured section"
            />
          </SectionCard>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white
                             bg-gray-900 hover:bg-gray-700 dark:bg-teal-500 dark:hover:bg-teal-400
                             disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <CheckCircle2 size={15} />
            )}
            {loading ? "Publishing..." : "Publish Product"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddProductPage;

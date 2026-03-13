// app/dashboard/admin/add-product/page.tsx
"use client";
import {
  Package,
  DollarSign,
  Tag,
  Layers,
  Truck,
  FileText,
  Star,
  Plus,
  Loader2,
  ImagePlus,
  CheckCircle2,
  Trash2,
} from "lucide-react";

import SectionCard from "./_components/SectionCard";
import ChipInput from "./_components/ChipInput";
import Toggle from "./_components/Toggle";
import ImageUploader from "./_components/ImageUploader";
import { inputCls, labelCls } from "./_components/types";

export default function AddProductPage() {
  const { form, set, loading, addSpec, updateSpec, removeSpec, handleSubmit } =
    useAddProduct();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* ── Header ─────────────────────────────────────── */}
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
                     bg-teal-500 hover:bg-teal-400
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-sm"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <CheckCircle2 size={15} />
          )}
          {loading ? "Publishing…" : "Publish Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ════════════ LEFT (2/3) ════════════ */}
        <div className="xl:col-span-2 space-y-6">
          {/* Core */}
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
                placeholder="Describe the product in detail…"
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

          {/* Pricing */}
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
                              bg-emerald-50 dark:bg-emerald-500/8
                              border border-emerald-200 dark:border-emerald-500/20"
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

          {/* Variants */}
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

          {/* Specifications */}
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
                               hover:bg-red-50 dark:hover:bg-red-500/10
                               transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addSpec}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                           w-full justify-center
                           border border-dashed border-gray-300 dark:border-gray-700
                           text-gray-500 dark:text-gray-400
                           hover:border-teal-400 hover:text-teal-500
                           transition-all duration-200"
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

          {/* Shipping */}
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

        {/* ════════════ RIGHT (1/3) ════════════ */}
        <div className="space-y-6">
          {/* Images */}
          <SectionCard
            icon={ImagePlus}
            title="Product Images"
            color="bg-pink-500/10 text-pink-500"
          >
            <ImageUploader onChange={(urls) => set("images", urls)} />
          </SectionCard>

          {/* Classification */}
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

          {/* Inventory */}
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

          {/* Bottom publish button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                       text-sm font-semibold text-white
                       bg-gray-900 hover:bg-gray-700
                       dark:bg-teal-500 dark:hover:bg-teal-400
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-sm"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <CheckCircle2 size={15} />
            )}
            {loading ? "Publishing…" : "Publish Product"}
          </button>
        </div>
      </div>
    </form>
  );
}

// Re-export FormState so page.tsx doesn't need to import from _components directly
import type { FormState } from "./_components/types";
import { useAddProduct } from "@/hook/admin/useAddProduct";

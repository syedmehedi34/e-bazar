// app/dashboard/admin/add-product/_hooks/useAddProduct.ts
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FormState,
  INITIAL_FORM,
} from "@/app/dashboard/admin/add-product/_components/types";

export function useAddProduct() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /* ── Generic field setter ────────────────────────── */
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ── Specification helpers ───────────────────────── */
  const addSpec = () =>
    set("specifications", [...form.specifications, { key: "", value: "" }]);

  const updateSpec = (i: number, field: "key" | "value", val: string) => {
    const updated = [...form.specifications];
    updated[i] = { ...updated[i], [field]: val };
    set("specifications", updated);
  };

  const removeSpec = (i: number) =>
    set(
      "specifications",
      form.specifications.filter((_, idx) => idx !== i),
    );

  /* ── Form submit ─────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const checks: [boolean, string][] = [
      [!form.title.trim(), "Product title is required"],
      [!form.description.trim(), "Description is required"],
      [form.price === "", "Price is required"],
      [form.discountPrice === "", "Discount price is required"],
      [!form.category.trim(), "Category is required"],
      [!form.subCategory.trim(), "Sub-category is required"],
      [!form.brand.trim(), "Brand is required"],
      [form.stock === "", "Stock quantity is required"],
    ];

    for (const [condition, message] of checks) {
      if (condition) {
        toast.error(message);
        return;
      }
    }

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
        // Only send specs that have both key and value filled
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
      setForm(INITIAL_FORM);
      router.push("/dashboard/admin/products");
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    set,
    loading,
    addSpec,
    updateSpec,
    removeSpec,
    handleSubmit,
  };
}

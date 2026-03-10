"use client";

import { addToCart } from "@/redux/feature/addToCart/addToCart";
import { RootState } from "@/redux/store";
import { useFetchProduct } from "@/hook/useFetchProduct";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Product } from "./types";

export function useShoppingLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((s: RootState) => s.cart.value);

  const { products, categories, productsLoading, refetchProducts } =
    useFetchProduct();

  // ── Read URL params ────────────────────────────────────────────────────
  const qSearch = searchParams.get("search") || "";
  const qCat = searchParams.get("category") || "";
  const qSub = searchParams.get("subCategory") || "";
  const qMin = Number(searchParams.get("minPrice")) || 0;
  const qMax = Number(searchParams.get("maxPrice")) || 0;
  const qSort = searchParams.get("sort") || "";

  // ── Local state ────────────────────────────────────────────────────────
  const [search, setSearch] = useState(qSearch);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [perPage, setPerPage] = useState(12);
  const [page, setPage] = useState<typeof products>([]);
  const [drawer, setDrawer] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(qCat || null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  const activeCount = [qCat, qSub, qMin > 0, qMax > 0, qSearch].filter(
    Boolean,
  ).length;

  // ── Sync search input when URL changes ────────────────────────────────
  useEffect(() => {
    setSearch(qSearch);
  }, [qSearch]);
  useEffect(() => {
    refetchProducts();
  }, [searchParams, refetchProducts]);

  // ── Debounced search → URL ─────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      if (search === qSearch) return;
      const p = new URLSearchParams(searchParams.toString());
      search.trim() ? p.set("search", search.trim()) : p.delete("search");
      router.push(`/shopping?${p}`);
    }, 380);
    return () => clearTimeout(t);
  }, [search, qSearch, searchParams, router]);

  // ── URL mutation helper ────────────────────────────────────────────────
  const setParam = useCallback(
    (key: string, val: string | null) => {
      const p = new URLSearchParams(searchParams.toString());
      val ? p.set(key, val) : p.delete(key);
      router.push(`/shopping?${p}`);
    },
    [searchParams, router],
  );

  const reset = useCallback(() => {
    setSearch("");
    router.push("/shopping");
  }, [router]);

  // ── Wishlist ───────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // ── Cart ───────────────────────────────────────────────────────────────
  const handleAddToCart = useCallback(
    (product: Product) => {
      if (cartItems.find((i) => i._id === product._id)) {
        toast.info("Already in cart");
      } else {
        dispatch(addToCart({ ...product, quantity: 1 }));
        toast.success("Added to cart!");
      }
    },
    [cartItems, dispatch],
  );

  return {
    // data
    products,
    categories,
    productsLoading,
    page,
    setPage,
    // url params (read)
    qSearch,
    qCat,
    qSub,
    qMin,
    qMax,
    qSort,
    activeCount,
    // local state
    search,
    setSearch,
    view,
    setView,
    perPage,
    setPerPage,
    drawer,
    setDrawer,
    openCat,
    setOpenCat,
    wishlist,
    searchRef,
    // actions
    setParam,
    reset,
    toggleWishlist,
    handleAddToCart,
  };
}

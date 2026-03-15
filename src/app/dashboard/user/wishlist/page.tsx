"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Heart,
  Search,
  ShoppingBag,
  X,
  Trash2,
  ChevronRight,
  PackageOpen,
  Loader2,
  RefreshCw,
} from "lucide-react";
import useUser from "@/hook/useUser";
import useWishList from "@/hook/user/useAddToWishList";
import { useFetchProduct } from "@/hook/useFetchProduct";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addToCart } from "@/redux/feature/addToCart/addToCart";

// ── Types ─────────────────────────────────────────────────────────
interface Product {
  _id: string;
  title: string;
  brand?: string;
  category: string;
  images: string[];
  price: number;
  discountPrice: number;
  stock: number;
  averageRating?: number;
}

// ── Page ──────────────────────────────────────────────────────────
const UserWishlistPage = () => {
  const [search, setSearch] = useState("");

  const { user, isLoading: userLoading } = useUser();
  const { products, productsLoading } = useFetchProduct();
  const { removeFromWishList, loadingId } = useWishList();
  const dispatch = useDispatch();
  const cartItems = useSelector((s: RootState) => s.cart.value);

  // Filter products that are in user's wishlist
  const wishlistProducts = useMemo(() => {
    if (!user?.wishList || !products) return [];
    return (products as Product[]).filter((p) =>
      user.wishList!.includes(p._id),
    );
  }, [user?.wishList, products]);

  // Client-side search
  const filtered = useMemo(() => {
    if (!search.trim()) return wishlistProducts;
    const q = search.toLowerCase();
    return wishlistProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [wishlistProducts, search]);

  const handleRemove = async (productId: string) => {
    await removeFromWishList(productId);
  };

  const handleAddToCart = (product: Product) => {
    if (cartItems.find((i) => i._id === product._id)) {
      toast.info("Already in cart");
      return;
    }
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success("Added to cart!");
  };

  const loading = userLoading || productsLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 rubik">
      <div className="mx-auto px-4 py-5">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Heart size={13} className="text-red-500" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              My Account
            </p>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                My Wishlist
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {wishlistProducts.length} item
                {wishlistProducts.length !== 1 ? "s" : ""} saved
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

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your wishlist..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-teal-500/60 transition-all"
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

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 space-y-4"
          >
            {search ? (
              <>
                <Search
                  size={48}
                  className="mx-auto text-gray-200 dark:text-gray-700"
                />
                <p className="text-base font-bold text-gray-700 dark:text-gray-300">
                  No results for &ldquo;{search}&rdquo;
                </p>
                <button
                  onClick={() => setSearch("")}
                  className="text-sm font-bold text-teal-500 hover:underline"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <PackageOpen
                  size={48}
                  className="mx-auto text-gray-200 dark:text-gray-700"
                />
                <p className="text-base font-bold text-gray-700 dark:text-gray-300">
                  Your wishlist is empty
                </p>
                <p className="text-sm text-gray-400">
                  Save items you love to find them here later.
                </p>
                <Link
                  href="/shopping"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-teal-500 hover:bg-teal-600 text-white transition-all mt-2"
                >
                  <ShoppingBag size={14} /> Browse Products
                </Link>
              </>
            )}
          </motion.div>
        ) : (
          <>
            {search && (
              <p className="text-xs text-gray-500 mb-4">
                Showing{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  {filtered.length}
                </span>{" "}
                result{filtered.length !== 1 ? "s" : ""} for{" "}
                <span className="text-teal-500">&ldquo;{search}&rdquo;</span>
              </p>
            )}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => {
                  const disc =
                    product.price > product.discountPrice
                      ? Math.round(
                          ((product.price - product.discountPrice) /
                            product.price) *
                            100,
                        )
                      : 0;
                  const isRemoving = loadingId === product._id;
                  const inCart = !!cartItems.find((i) => i._id === product._id);

                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                    >
                      {/* Image */}
                      <div className="relative aspect-square bg-gray-50 dark:bg-gray-700 overflow-hidden">
                        <Link href={`/products/${product._id}`}>
                          <Image
                            src={product.images[0] || ""}
                            alt={product.title}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Discount badge */}
                        {disc > 0 && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -{disc}%
                          </span>
                        )}

                        {/* Remove button */}
                        <button
                          onClick={() => handleRemove(product._id)}
                          disabled={isRemoving}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-red-400 hover:text-red-500 hover:border-red-300 transition-all shadow-sm disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
                        >
                          {isRemoving ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                        </button>

                        {/* Out of stock */}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4 space-y-3">
                        {product.brand && (
                          <p className="text-[10px] font-bold uppercase tracking-widest text-teal-500">
                            {product.brand}
                          </p>
                        )}
                        <Link href={`/products/${product._id}`}>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors leading-snug">
                            {product.title}
                          </h3>
                        </Link>

                        {/* Price */}
                        <div className="flex items-end gap-2">
                          <span className="text-base font-extrabold text-gray-900 dark:text-white">
                            ৳{product.discountPrice.toLocaleString()}
                          </span>
                          {disc > 0 && (
                            <span className="text-xs text-gray-400 line-through mb-0.5">
                              ৳{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0 || inCart}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                              product.stock === 0
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                                : inCart
                                  ? "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30"
                                  : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100"
                            }`}
                          >
                            <ShoppingBag size={12} />
                            {inCart ? "In Cart" : "Add to Cart"}
                          </button>
                          <button
                            onClick={() => handleRemove(product._id)}
                            disabled={isRemoving}
                            className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-center text-red-400 hover:text-red-500 hover:border-red-300 transition-all disabled:cursor-not-allowed"
                          >
                            {isRemoving ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Heart size={13} className="fill-red-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Clear all */}
            {wishlistProducts.length > 1 && !search && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    wishlistProducts.forEach((p) => removeFromWishList(p._id));
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 hover:bg-red-100 transition-all"
                >
                  <Trash2 size={14} /> Clear Wishlist
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserWishlistPage;

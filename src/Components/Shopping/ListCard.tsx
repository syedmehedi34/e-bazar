"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Package, ShoppingBag, Loader2 } from "lucide-react";
import Stars from "./Stars";
import Highlight from "./Highlight";
import ColorDots from "./ColorDots";
import { Product } from "./types";
import { FALLBACK_IMAGE, calcDiscountPct, effectivePrice } from "./constants";

interface ListCardProps {
  product: Product;
  qSearch: string;
  wished: boolean;
  wishlistLoadingId: string | null;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

function ListCard({
  product: p,
  qSearch,
  wished,
  wishlistLoadingId,
  onToggleWishlist,
  onAddToCart,
}: ListCardProps) {
  const disc = calcDiscountPct(p.price, p.discountPrice);
  const price = effectivePrice(p.price, p.discountPrice);
  const oos = p.stock === 0;
  const wishLoading = wishlistLoadingId === p._id;

  return (
    <div className="group flex items-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-250">
      <Link
        href={`/products/${p._id}`}
        className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 bg-zinc-50 dark:bg-zinc-800 overflow-hidden"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={p.images[0] || FALLBACK_IMAGE}
          alt={p.title}
          fill
          className={`object-contain p-3 transition-transform duration-400 ${!oos ? "group-hover:scale-105" : "opacity-40"}`}
        />
        {disc > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            −{disc}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 items-center gap-4 px-4 py-3.5 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-zinc-400 dark:text-zinc-500">
              {p.category}
            </p>
            {p.freeShipping && (
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full">
                FREE SHIP
              </span>
            )}
          </div>

          {p.brand && (
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mb-0.5">
              {p.brand}
            </p>
          )}

          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1 mb-1.5">
            <Link
              href={`/products/${p._id}`}
              className="hover:underline underline-offset-2"
            >
              <Highlight text={p.title} q={qSearch} />
            </Link>
          </h3>

          <div className="flex items-center gap-3 flex-wrap">
            {p.averageRating > 0 && (
              <div className="flex items-center gap-1.5">
                <Stars rating={p.averageRating} size={10} />
                <span className="text-[10px] text-zinc-400 font-medium">
                  {p.averageRating.toFixed(1)}
                  {p.reviews?.length > 0 && (
                    <span className="text-zinc-300 dark:text-zinc-600">
                      {" "}
                      ({p.reviews.length})
                    </span>
                  )}
                </span>
              </div>
            )}
            {oos ? (
              <span className="text-[10px] font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                Sold Out
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Package size={9} strokeWidth={2.5} />
                {p.stock} in stock
              </span>
            )}
            {p.totalSold > 0 && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 tabular-nums">
                {p.totalSold.toLocaleString()} sold
              </span>
            )}
          </div>

          <div className="mt-1.5">
            <ColorDots colors={p.colors} max={8} />
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">
              ৳{price.toLocaleString()}
            </p>
            {disc > 0 && (
              <p className="text-xs text-zinc-400 line-through mt-0.5">
                ৳{p.price.toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <button
              onClick={() => onToggleWishlist(p._id)}
              disabled={wishLoading}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed ${
                wished
                  ? "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:border-red-300 hover:text-red-400"
              }`}
            >
              {wishLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Heart size={13} className={wished ? "fill-red-500" : ""} />
              )}
            </button>

            {/* Add to cart */}
            <button
              onClick={() => onAddToCart(p)}
              disabled={oos}
              aria-label="Add to cart"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                oos
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed"
                  : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100"
              }`}
            >
              <ShoppingBag size={12} strokeWidth={2.5} /> Add
            </button>

            {/* View */}
            <Link
              href={`/products/${p._id}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all duration-200"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ListCard);

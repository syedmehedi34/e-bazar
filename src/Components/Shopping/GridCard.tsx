"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Zap } from "lucide-react";
import Stars from "./Stars";
import Highlight from "./Highlight";
import ColorDots from "./ColorDots";
import { Product } from "./types";
import { FALLBACK_IMAGE, calcDiscountPct, effectivePrice } from "./constants";

interface GridCardProps {
  product: Product;
  qSearch: string;
  wished: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

function GridCard({
  product: p,
  qSearch,
  wished,
  onToggleWishlist,
  onAddToCart,
}: GridCardProps) {
  const disc = calcDiscountPct(p.price, p.discountPrice);
  const price = effectivePrice(p.price, p.discountPrice);
  const oos = p.stock === 0;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-300">
      {/* ── Image area ── */}
      <div
        className="relative bg-zinc-50 dark:bg-zinc-800 overflow-hidden"
        style={{ aspectRatio: "1/1" }}
      >
        <Image
          src={p.images[0] || FALLBACK_IMAGE}
          alt={p.title}
          fill
          className={`object-contain p-4 transition-transform duration-500 ${
            !oos ? "group-hover:scale-[1.07]" : "opacity-40"
          }`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {disc > 0 && (
            <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-sm shadow-red-500/30">
              <Zap size={8} strokeWidth={3} />−{disc}%
            </span>
          )}
          {p.stock > 0 && p.stock <= 5 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {p.stock} left
            </span>
          )}
        </div>

        {/* Sold-out overlay */}
        {oos && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-zinc-900/60 backdrop-blur-[1px]">
            <span className="text-xs font-bold text-zinc-500 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={() => onToggleWishlist(p._id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 ${
            wished
              ? "bg-red-500 shadow-red-500/30"
              : "bg-white/90 dark:bg-zinc-900/90"
          }`}
        >
          <Heart
            size={13}
            className={wished ? "fill-white text-white" : "text-zinc-400"}
          />
        </button>

        {/* Quick View — slides up inside image area only, no overlap with card body */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out">
          <Link
            href={`/products/${p._id}`}
            className="flex items-center justify-center py-2.5 bg-zinc-900/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-zinc-900 text-xs font-bold tracking-wide hover:bg-zinc-900 dark:hover:bg-white transition-colors"
          >
            Quick View →
          </Link>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category + free shipping */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-zinc-400 dark:text-zinc-500">
            {p.category}
          </p>
          {p.freeShipping && (
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full tracking-wide">
              FREE SHIP
            </span>
          )}
        </div>

        {/* Brand + title */}
        {p.brand && (
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium -mt-1">
            {p.brand}
          </p>
        )}
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-snug">
          <Highlight text={p.title} q={qSearch} />
        </h3>

        {/* Rating + sold */}
        <div className="flex items-center justify-between">
          {p.averageRating > 0 ? (
            <div className="flex items-center gap-1.5">
              <Stars rating={p.averageRating} size={10} />
              <span className="text-[10px] text-zinc-400 font-medium tabular-nums">
                {p.averageRating.toFixed(1)}
                {p.reviews?.length > 0 && (
                  <span className="text-zinc-300 dark:text-zinc-600">
                    {" "}
                    ({p.reviews.length})
                  </span>
                )}
              </span>
            </div>
          ) : (
            <span />
          )}
          {p.totalSold > 0 && (
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 tabular-nums">
              {p.totalSold.toLocaleString()} sold
            </span>
          )}
        </div>

        {/* Color swatches */}
        <ColorDots colors={p.colors} max={6} />

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-zinc-50 dark:border-zinc-800/80">
          <div>
            <span className="text-[15px] font-black text-zinc-900 dark:text-white tracking-tight">
              ৳{price.toLocaleString()}
            </span>
            {disc > 0 && (
              <span className="block text-[10px] text-zinc-400 line-through leading-none mt-0.5">
                ৳{p.price.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(p)}
            disabled={oos}
            aria-label="Add to cart"
            className={`flex items-center gap-1.5 pl-3 pr-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
              oos
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed"
                : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 shadow-sm hover:shadow-md"
            }`}
          >
            <ShoppingBag size={12} strokeWidth={2.5} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(GridCard);

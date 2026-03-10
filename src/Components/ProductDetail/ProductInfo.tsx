import {
  ShoppingCart,
  Heart,
  Share2,
  Check,
  Tag,
  Truck,
  Award,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Flame,
  Palette,
  Ruler,
  ThumbsUp,
} from "lucide-react";
import { IProduct } from "./types";
import StarRating from "./StarRating";
import ColorDot from "./ColorDot";
import StatusBadge from "./StatusBadge";

interface Props {
  p: IProduct;
  // computed
  discount: number;
  savings: number;
  avgRating: number;
  reviewCount: number;
  positivePercent: number;
  // states
  selectedColor: string | null;
  selectedSize: string | null;
  quantity: number;
  wishlisted: boolean;
  copied: boolean;
  // handlers
  onSelectColor: (c: string) => void;
  onSelectSize: (s: string) => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onShare: () => void;
}

const ProductInfo = ({
  p,
  discount,
  savings,
  avgRating,
  reviewCount,
  positivePercent,
  selectedColor,
  selectedSize,
  quantity,
  wishlisted,
  copied,
  onSelectColor,
  onSelectSize,
  onIncrease,
  onDecrease,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onShare,
}: Props) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Brand + Status */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest uppercase text-gray-400 dark:text-gray-500">
            {p.brand}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400 dark:text-gray-600">
            {p.category}
          </span>
        </div>
        <StatusBadge status={p.status} stock={p.stock} />
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-snug">
        {p.title}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
          <StarRating rating={avgRating} size={12} />
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
            {avgRating.toFixed(1)}
          </span>
        </div>
        <span className="text-xs text-gray-400">({reviewCount} reviews)</span>
        {positivePercent > 0 && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ThumbsUp size={10} /> {positivePercent}% positive
          </span>
        )}
      </div>

      {/* Price */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div className="flex items-end gap-3 flex-wrap">
          <span className="text-3xl font-black text-gray-900 dark:text-white">
            ৳{p.discountPrice.toLocaleString()}
          </span>
          {discount > 0 && (
            <>
              <span className="text-base text-gray-300 dark:text-gray-600 line-through mb-0.5">
                ৳{p.price.toLocaleString()}
              </span>
              <span className="mb-0.5 px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-lg">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {discount > 0 && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Check size={12} /> Save ৳{savings.toLocaleString()}
            </p>
          )}
          {p.freeShipping && (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
              <Truck size={12} /> Free shipping
            </p>
          )}
        </div>
      </div>

      {/* Color selector */}
      {p?.colors?.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2.5 flex items-center gap-1.5 uppercase tracking-wide">
            <Palette size={12} className="text-gray-400" /> Color
            {selectedColor && (
              <span className="font-normal normal-case tracking-normal text-gray-400 capitalize">
                — {selectedColor}
              </span>
            )}
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {p.colors.map((color) => (
              <ColorDot
                key={color}
                color={color}
                selected={selectedColor === color}
                onClick={() => onSelectColor(color)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size selector */}
      {p.sizes?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1.5 uppercase tracking-wide">
              <Ruler size={12} className="text-gray-400" /> Size
              {selectedSize && (
                <span className="font-normal normal-case tracking-normal text-gray-400">
                  — {selectedSize}
                </span>
              )}
            </p>
            <button className="text-xs text-blue-500 hover:text-blue-600 transition-colors">
              Size Guide →
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {p.sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSelectSize(size)}
                className={`min-w-[44px] h-10 px-3 rounded-xl text-sm font-bold transition-all ${
                  selectedSize === size
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 scale-105 shadow-md"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2.5 uppercase tracking-wide">
          Quantity
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={onDecrease}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-30"
            >
              <Minus size={13} />
            </button>
            <span className="w-10 text-center text-sm font-bold text-gray-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={onIncrease}
              disabled={quantity >= p.stock}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-30"
            >
              <Plus size={13} />
            </button>
          </div>
          <div className="text-xs space-y-0.5">
            <p className="text-gray-400">{p.stock} available</p>
            {p.totalSold > 0 && (
              <p className="font-semibold text-orange-500 flex items-center gap-1">
                <Flame size={9} /> {p.totalSold}+ sold
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-2.5">
        <button
          onClick={onAddToCart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-all shadow-lg shadow-gray-900/15 hover:shadow-xl active:scale-[0.98]"
        >
          <ShoppingCart size={16} /> Add to Cart
        </button>
        <button
          onClick={onToggleWishlist}
          className={`w-12 rounded-xl border-2 flex items-center justify-center transition-all active:scale-95 ${
            wishlisted
              ? "bg-red-500 border-red-500 shadow-md shadow-red-500/20"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-red-300"
          }`}
        >
          <Heart
            size={16}
            className={wishlisted ? "fill-white text-white" : "text-gray-400"}
          />
        </button>
        <button
          onClick={onShare}
          className="w-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center hover:border-gray-400 transition-all active:scale-95"
        >
          {copied ? (
            <Check size={16} className="text-emerald-500" />
          ) : (
            <Share2 size={16} className="text-gray-400" />
          )}
        </button>
      </div>

      {/* Buy Now */}
      <button
        onClick={onBuyNow}
        className="w-full py-3 rounded-xl border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all active:scale-[0.98]"
      >
        Buy Now — ৳{(p.discountPrice * quantity).toLocaleString()}
      </button>

      {/* Trust badges */}
      <div className="grid grid-cols-4 gap-2">
        {[
          {
            icon: <Truck size={14} />,
            label: p.freeShipping ? "Free Delivery" : "Fast Delivery",
            sub: p.freeShipping ? "No min." : "2-5 days",
            color: "text-blue-500",
          },
          {
            icon: <RotateCcw size={14} />,
            label: "Easy Returns",
            sub: "7 days",
            color: "text-emerald-500",
          },
          {
            icon: <Shield size={14} />,
            label: "Secure Pay",
            sub: "100% safe",
            color: "text-purple-500",
          },
          {
            icon: <Award size={14} />,
            label: "Warranty",
            sub: p.warranty || "Included",
            color: "text-amber-500",
          },
        ].map((b) => (
          <div
            key={b.label}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center"
          >
            <span className={b.color}>{b.icon}</span>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-tight">
              {b.label}
            </p>
            <p className="text-xs text-gray-400">{b.sub}</p>
          </div>
        ))}
      </div>

      {/* Tags */}
      {p.tags?.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <Tag size={11} className="text-gray-300 dark:text-gray-700" />
          {p.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 rounded-lg capitalize hover:border-gray-400 cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;

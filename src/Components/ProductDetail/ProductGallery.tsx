import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Truck,
  Flame,
  BadgeCheck,
  MapPin,
  ThumbsUp,
} from "lucide-react";
import { IProduct } from "./types";

interface Props {
  p: IProduct;
  activeImage: number;
  wishlisted: boolean;
  discount: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectImage: (i: number) => void;
  onToggleWishlist: () => void;
}

const ProductGallery = ({
  p,
  activeImage,
  wishlisted,
  discount,
  onPrev,
  onNext,
  onSelectImage,
  onToggleWishlist,
}: Props) => {
  return (
    <div className="space-y-3 lg:sticky lg:top-6 lg:self-start">
      {/* Main image */}
      <div className="relative w-full aspect-[4/4.2] rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm group">
        {p.images[activeImage] && (
          <Image
            src={p.images[activeImage]}
            alt={p.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md shadow-red-500/20">
              -{discount}%
            </span>
          )}
          {p.featured && (
            <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Flame size={9} /> Hot
            </span>
          )}
          {p.freeShipping && (
            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Truck size={9} /> Free
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={onToggleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-xl backdrop-blur-md flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 ${
            wishlisted ? "bg-red-500" : "bg-white/80 dark:bg-gray-900/80"
          }`}
        >
          <Heart
            size={16}
            className={wishlisted ? "fill-white text-white" : "text-gray-500"}
          />
        </button>

        {/* Arrow nav */}
        {p.images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <ChevronLeft
                size={16}
                className="text-gray-700 dark:text-gray-200"
              />
            </button>
            <button
              onClick={onNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <ChevronRight
                size={16}
                className="text-gray-700 dark:text-gray-200"
              />
            </button>
          </>
        )}

        {/* Counter */}
        {p.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
            {activeImage + 1}/{p.images.length}
          </div>
        )}

        {/* Dot nav */}
        {p.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {p.images.map((_, i) => (
              <button
                key={i}
                onClick={() => onSelectImage(i)}
                className={`rounded-full transition-all ${i === activeImage ? "w-4 h-1 bg-white" : "w-1 h-1 bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {p.images.length > 1 && (
        <div className="flex gap-2">
          {p.images.map((img, i) => (
            <button
              key={i}
              onClick={() => onSelectImage(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                i === activeImage
                  ? "ring-2 ring-gray-900 dark:ring-white shadow scale-105"
                  : "opacity-50 hover:opacity-80 hover:scale-105"
              }`}
            >
              <Image
                src={img}
                alt={`view ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Meta strip */}
      <div className="grid grid-cols-3 gap-2">
        {[
          ...(p.sku
            ? [{ icon: <BadgeCheck size={12} />, label: "SKU", value: p.sku }]
            : []),
          ...(p.totalSold > 0
            ? [
                {
                  icon: <ThumbsUp size={12} />,
                  label: "Sold",
                  value: `${p.totalSold}+`,
                },
              ]
            : []),
          ...(p.countryOfOrigin
            ? [
                {
                  icon: <MapPin size={12} />,
                  label: "Origin",
                  value: p.countryOfOrigin,
                },
              ]
            : []),
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1.5 p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
          >
            <span className="text-gray-400 shrink-0">{item.icon}</span>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;

"use client";

import { addToCart } from "@/redux/feature/addToCart/addToCart";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ShoppingCart, Zap, Truck } from "lucide-react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  title: string;
  images: string[];
  price: number;
  discountPrice?: number;
  rating?: number;
  averageRating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  freeShipping?: boolean;
  featured?: boolean;
  colors?: string[];
  totalSold?: number;
}

interface ProductsCardProps {
  product: Product;
}

const ProductsCard: React.FC<ProductsCardProps> = ({ product }) => {
  const {
    _id,
    title,
    images,
    price,
    discountPrice,
    averageRating,
    stock,
    brand,
    freeShipping,
    featured,
  } = product;

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.value);

  const handleAddToCart = () => {
    const exist = cartItems.find((item) => item._id === _id);
    if (exist) {
      toast.info("Already in cart — quantity updated!");
    } else {
      dispatch(addToCart({ ...product, quantity: 1 }));
      toast.success("Added to cart!");
    }
  };

  const displayPrice = discountPrice ?? price;
  const discount = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : null;
  const rating = averageRating ?? 0;
  const filledStars = Math.min(5, Math.max(0, Math.round(rating)));
  const outOfStock = stock === 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex flex-col rounded-2xl overflow-hidden
                 bg-white dark:bg-gray-800
                 border border-gray-100 dark:border-gray-700/50
                 shadow-sm hover:shadow-xl dark:hover:shadow-black/40
                 transition-shadow duration-300 rubik"
    >
      {/* ── Image ── */}
      <Link
        href={`/checkout/${_id}`}
        className="relative block overflow-hidden bg-gray-50 dark:bg-gray-700/40"
      >
        <div className="h-52 flex items-center justify-center p-4">
          <Image
            src={
              images[0] ||
              "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"
            }
            width={200}
            height={200}
            alt={title}
            priority
            className="w-full h-full object-contain
                       transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {discount && (
            <span
              className="text-[10px] font-extrabold bg-red-500 text-white
                             px-2 py-0.5 rounded-full leading-tight"
            >
              -{discount}%
            </span>
          )}
          {featured && (
            <span
              className="text-[10px] font-extrabold bg-teal-500 text-white
                             px-2 py-0.5 rounded-full leading-tight"
            >
              Featured
            </span>
          )}
        </div>

        {/* Free shipping badge */}
        {freeShipping && (
          <div
            className="absolute top-2.5 right-2.5 flex items-center gap-1
                          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600
                          px-1.5 py-0.5 rounded-full shadow-sm"
          >
            <Truck size={9} className="text-teal-500" />
            <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400">
              Free
            </span>
          </div>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div
            className="absolute inset-0 bg-white/70 dark:bg-black/60
                          flex items-center justify-center"
          >
            <span
              className="text-xs font-bold text-gray-400 dark:text-gray-500
                             uppercase tracking-wider"
            >
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 p-3.5 gap-2">
        {/* Brand */}
        {brand && (
          <span
            className="text-[10px] font-bold uppercase tracking-widest
                           text-teal-500 dark:text-teal-400"
          >
            {brand}
          </span>
        )}

        {/* Title */}
        <h2
          className="text-sm font-semibold text-gray-800 dark:text-gray-100
                       line-clamp-2 leading-snug"
        >
          {title}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) =>
              i < filledStars ? (
                <FaStar key={i} size={10} className="text-amber-400" />
              ) : (
                <FaRegStar
                  key={i}
                  size={10}
                  className="text-gray-200 dark:text-gray-600"
                />
              ),
            )}
          </div>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-extrabold text-gray-900 dark:text-white">
            ৳{displayPrice.toLocaleString()}
          </span>
          {discountPrice && (
            <span className="text-xs text-gray-400 line-through">
              ৳{price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock warning */}
        {!outOfStock && stock != null && stock <= 10 && (
          <p className="text-[11px] font-semibold text-orange-500">
            Only {stock} left!
          </p>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex-1 flex items-center justify-center gap-1.5
                       py-2 rounded-xl text-xs font-bold
                       bg-gray-100 dark:bg-gray-700
                       hover:bg-gray-200 dark:hover:bg-gray-600
                       text-gray-700 dark:text-gray-200
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            <ShoppingCart size={12} />
            Cart
          </button>
          <Link
            href={`/checkout/${_id}`}
            className="flex-1 flex items-center justify-center gap-1.5
                       py-2 rounded-xl text-xs font-bold
                       bg-teal-500 hover:bg-teal-600
                       text-white shadow-sm shadow-teal-500/20
                       transition-all duration-200"
          >
            <Zap size={12} />
            Buy Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsCard;

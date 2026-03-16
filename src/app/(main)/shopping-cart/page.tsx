"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import {
  decrementQuantity,
  incrementQuantity,
  removeAllFromCart,
  removeFromCart,
} from "@/redux/feature/addToCart/addToCart";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Tag,
  ArrowRight,
  Package,
  ChevronRight,
  X,
} from "lucide-react";

interface CartItem {
  _id: string;
  title: string;
  brand: string;
  price: number;
  discountPrice: number;
  quantity: number;
  images: string[];
}

const ShoppingCart = () => {
  const cartItems = useSelector(
    (state: RootState) => state.cart.value as CartItem[],
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = cartItems.reduce((acc, c) => acc + c.price * c.quantity, 0);
  const discounted = cartItems.reduce(
    (acc, c) => acc + c.discountPrice * c.quantity,
    0,
  );
  const savings = subtotal - discounted;
  const shipping = discounted > 0 ? 100 : 0;
  const total = discounted + shipping;
  const discPct = subtotal > 0 ? Math.round((savings / subtotal) * 100) : 0;

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    dispatch(removeAllFromCart());
    toast.success("Cart cleared");
  };

  const handleApplyCoupon = () => {
    if (!coupon.trim()) return;
    setCouponApplied(true);
    toast.success("Coupon applied!");
  };

  // ── Empty state ────────────────────────────────────────────────
  if (cartItems.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-24 h-24 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
            <ShoppingBag
              size={40}
              className="text-gray-300 dark:text-gray-600"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-gray-400">
              Looks like you haven&apos;t added anything yet.
            </p>
          </div>
          <Link
            href="/shopping"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:bg-gray-700 dark:hover:bg-gray-100 transition-all shadow-sm"
          >
            Browse Products <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Home
              </Link>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Cart
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Shopping Cart
              <span className="ml-2 text-base font-normal text-gray-400">
                ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
              </span>
            </h1>
          </div>
          <button
            onClick={handleClearCart}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <Trash2 size={13} /> Clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* ── Cart items ── */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((cart) => {
              const itemDisc = Math.round(
                ((cart.price - cart.discountPrice) / cart.price) * 100,
              );
              return (
                <div
                  key={cart._id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex gap-4 hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${cart._id}`}
                    className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 shrink-0 ring-1 ring-gray-100 dark:ring-gray-700"
                  >
                    <Image
                      src={cart.images?.[0] || cart.images?.[1] || ""}
                      fill
                      alt={cart.title}
                      className="object-contain p-1.5"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-teal-500 mb-0.5">
                          {cart.brand}
                        </p>
                        <Link href={`/products/${cart._id}`}>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors leading-snug">
                            {cart.title}
                          </h3>
                        </Link>
                      </div>
                      <button
                        onClick={() => handleRemove(cart._id)}
                        className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-gray-900 dark:text-white">
                          ৳
                          {(
                            cart.discountPrice * cart.quantity
                          ).toLocaleString()}
                        </span>
                        {itemDisc > 0 && (
                          <>
                            <span className="text-xs text-gray-400 line-through">
                              ৳{(cart.price * cart.quantity).toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded-full">
                              -{itemDisc}%
                            </span>
                          </>
                        )}
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-0 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <button
                          onClick={() => dispatch(decrementQuantity(cart._id))}
                          disabled={cart.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus size={12} strokeWidth={2.5} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">
                          {cart.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(incrementQuantity(cart._id))}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                    {/* Per unit price */}
                    {cart.quantity > 1 && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        ৳{cart.discountPrice.toLocaleString()} each
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Continue shopping */}
            <Link
              href="/shopping"
              className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mt-2 px-1"
            >
              <Package size={14} /> Continue Shopping
            </Link>
          </div>

          {/* ── Order summary ── */}
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* Coupon */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-teal-500" />
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Coupon Code
                </p>
              </div>
              {couponApplied ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">
                      {coupon.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-teal-500">Applied!</span>
                  </div>
                  <button
                    onClick={() => {
                      setCouponApplied(false);
                      setCoupon("");
                    }}
                    className="text-teal-400 hover:text-teal-600 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-all"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal ({cartItems.length} items)
                  </span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount ({discPct}%)</span>
                    <span className="font-semibold text-red-500">
                      -৳{savings.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    ৳{shipping.toLocaleString()}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 text-center">
                      🎉 You&apos;re saving ৳{savings.toLocaleString()} on this
                      order!
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-xl font-black text-gray-900 dark:text-white">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout?mode=cart")}
                className="w-full mt-5 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-all shadow-lg shadow-gray-900/10 active:scale-[0.98]"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-3">
                Secure checkout · SSL encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

"use client";

import { use } from "react";
import BackButton from "@/Components/Button/BackButton";
import { useProductById } from "@/hook/useProductById";
import { IProduct } from "./types";
import { useProductDetail } from "./useProductDetail";
import { Package } from "lucide-react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";

const ProductDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { product, productLoading, productError } = useProductById(id);

  const {
    activeImage,
    selectedSize,
    selectedColor,
    quantity,
    wishlisted,
    wishlistLoadingId,
    activeTab,
    copied,
    reviewCount,
    avgRating,
    discount,
    savings,
    positivePercent,
    ratingBreakdown,
    prevImage,
    nextImage,
    selectImage,
    selectColor,
    selectSize,
    increaseQty,
    decreaseQty,
    toggleWishlist,
    handleAddToCart,
    handleBuyNow,
    handleShare,
    handleTabChange,
  } = useProductDetail(product as IProduct | null);

  if (productLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
          <p className="text-xs tracking-widest uppercase text-gray-400">
            Loading
          </p>
        </div>
      </div>
    );

  if (productError || !product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center space-y-2">
          <Package
            size={36}
            className="text-gray-200 dark:text-gray-800 mx-auto"
          />
          <p className="text-sm text-gray-400">Product not found</p>
        </div>
      </div>
    );

  const p = product as IProduct;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <BackButton />
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600">
            {["Home", p.category, p.subCategory].map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors">
                  {c}
                </span>
                <span>/</span>
              </span>
            ))}
            <span className="text-gray-600 dark:text-gray-300 font-medium max-w-[160px] truncate">
              {p.title}
            </span>
          </nav>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-8 xl:gap-12">
          <ProductGallery
            p={p}
            activeImage={activeImage}
            wishlisted={wishlisted}
            discount={discount}
            onPrev={prevImage}
            onNext={nextImage}
            onSelectImage={selectImage}
            onToggleWishlist={toggleWishlist}
          />
          <ProductInfo
            p={p}
            discount={discount}
            savings={savings}
            avgRating={avgRating}
            reviewCount={reviewCount}
            positivePercent={positivePercent}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            quantity={quantity}
            wishlisted={wishlisted}
            wishlistLoadingId={wishlistLoadingId}
            copied={copied}
            onSelectColor={selectColor}
            onSelectSize={selectSize}
            onIncrease={increaseQty}
            onDecrease={decreaseQty}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onShare={handleShare}
          />
        </div>

        <ProductTabs
          p={p}
          activeTab={activeTab}
          avgRating={avgRating}
          reviewCount={reviewCount}
          positivePercent={positivePercent}
          ratingBreakdown={ratingBreakdown}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;

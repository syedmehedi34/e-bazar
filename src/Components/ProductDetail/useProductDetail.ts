import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { addToCart, CartItem } from "@/redux/feature/addToCart/addToCart";
import { setBuyNowItem, BuyNowItem } from "@/redux/feature/buyNow/buyNow";
import { RootState } from "@/redux/store";
import { IProduct, TabType } from "./types";

export const useProductDetail = (product: IProduct | null) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((s: RootState) => s.cart.value);

  // ── UI States ──────────────────────────────────────────
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [copied, setCopied] = useState(false);

  // ── Derived / computed values ─────────────────────────
  const reviewCount = product?.reviews?.length ?? 0;
  const avgRating = product?.averageRating ?? 0;
  const discount = product
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;
  const savings = product ? product.price - product.discountPrice : 0;
  const positivePercent =
    reviewCount > 0
      ? Math.round(
          (product!.reviews.filter((r) => r.rating >= 4).length / reviewCount) *
            100,
        )
      : 0;
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count:
      product?.reviews?.filter((r) => Math.round(r.rating) === star).length ??
      0,
    pct:
      reviewCount > 0
        ? ((product?.reviews?.filter((r) => Math.round(r.rating) === star)
            .length ?? 0) /
            reviewCount) *
          100
        : 0,
  }));

  // ── Image Gallery Handlers ────────────────────────────
  const prevImage = () => {
    if (!product) return;
    setActiveImage((i) => (i === 0 ? product.images.length - 1 : i - 1));
  };

  const nextImage = () => {
    if (!product) return;
    setActiveImage((i) => (i === product.images.length - 1 ? 0 : i + 1));
  };

  const selectImage = (index: number) => setActiveImage(index);

  // ── Product Option Handlers ───────────────────────────
  const selectColor = (color: string) => setSelectedColor(color);
  const selectSize = (size: string) => setSelectedSize(size);

  const increaseQty = () => {
    if (!product) return;
    setQuantity((q) => Math.min(product.stock, q + 1));
  };

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));

  // ── Action Handlers ───────────────────────────────────
  const toggleWishlist = () => {
    setWishlisted((prev) => !prev);
    // TODO: call wishlist API
  };

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    if (cartItems.find((i) => i._id === product._id)) {
      toast.info("Already in cart");
      return;
    }

    const cartItem: CartItem = {
      _id: product._id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      discountPrice: product.discountPrice,
      images: product.images,
      quantity,
    };

    dispatch(addToCart(cartItem));
    toast.success("Added to cart!");
  }, [product, cartItems, quantity, dispatch]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;

    const buyNowItem: BuyNowItem = {
      productId: product._id,
      title: product.title,
      image: product.images[0],
      brand: product.brand,
      selectedSize,
      selectedColor,
      quantity,
      unitPrice: product.discountPrice,
      subtotal: product.discountPrice * quantity,
    };

    // ── 1. Redux-এ set করো (same-session navigation এর জন্য)
    dispatch(setBuyNowItem(buyNowItem));

    // ── 2. sessionStorage-এ backup রাখো (refresh হলেও টিকবে)
    sessionStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));

    // ── 3. Checkout page-এ পাঠাও, mode=buynow দিয়ে
    router.push("/checkout?mode=buynow");
  }, [product, selectedSize, selectedColor, quantity, dispatch, router]);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (tab: TabType) => setActiveTab(tab);

  return {
    // states
    activeImage,
    selectedSize,
    selectedColor,
    quantity,
    wishlisted,
    activeTab,
    copied,

    // computed
    reviewCount,
    avgRating,
    discount,
    savings,
    positivePercent,
    ratingBreakdown,

    // handlers
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
  };
};

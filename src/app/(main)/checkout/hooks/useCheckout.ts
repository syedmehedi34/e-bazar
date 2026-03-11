"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "@/redux/store";
import { clearBuyNowItem, BuyNowItem } from "@/redux/feature/buyNow/buyNow";
import { removeAllFromCart } from "@/redux/feature/addToCart/addToCart";
import { divisions, getDistricts, getUpazilas } from "@/data/bd-geo";

import {
  OrderItem,
  DeliveryAddress,
  PaymentMethod,
  OrderPayload,
} from "../types";
import {
  SHIPPING_INSIDE_DHAKA,
  SHIPPING_OUTSIDE_DHAKA,
  fmt,
} from "../constants";

export function useCheckout(mode: string) {
  const router = useRouter();
  const dispatch = useDispatch();

  const reduxBuyNow = useSelector((s: RootState) => s.buyNow.item);
  const reduxCart = useSelector((s: RootState) => s.cart.value);

  // ── Order Items ──────────────────────────────
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (mode === "buynow") {
      const item: BuyNowItem | null =
        reduxBuyNow ??
        JSON.parse(sessionStorage.getItem("buyNowItem") ?? "null");
      if (!item) {
        toast.error("No item found.");
        router.replace("/shopping");
        return;
      }
      setOrderItems([item]);
    } else {
      if (reduxCart.length === 0) {
        toast.error("Cart is empty.");
        router.replace("/shopping-cart");
        return;
      }
      setOrderItems(
        reduxCart.map((c) => ({
          productId: c._id,
          title: c.title,
          image: c.images[0],
          brand: c.brand,
          quantity: c.quantity,
          unitPrice: c.discountPrice ?? c.price,
          subtotal: (c.discountPrice ?? c.price) * c.quantity,
        })),
      );
    }
  }, [mode, reduxBuyNow, reduxCart, router]);

  // ── Address ──────────────────────────────────
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: "",
    phone: "",
    altPhone: "",
    division: "",
    district: "",
    upazila: "",
    address: "",
    addressType: "home",
  });

  const setField = useCallback(
    (field: keyof DeliveryAddress) => (value: string) =>
      setAddress((prev) => ({ ...prev, [field]: value })),
    [],
  );

  useEffect(() => {
    setAddress((p) => ({ ...p, district: "", upazila: "" }));
  }, [address.division]);
  useEffect(() => {
    setAddress((p) => ({ ...p, upazila: "" }));
  }, [address.district]);

  // Geo data
  const divisionNames = divisions.map((d) => d.name);
  const districtNames = address.division
    ? getDistricts(address.division).map((d) => d.name)
    : [];
  const upazilaNames = address.district
    ? getUpazilas(address.district).map((u) => u.name)
    : [];

  // ── Payment ──────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  // ── Coupon ───────────────────────────────────
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = orderItems.reduce((s, i) => s + i.subtotal, 0);
  const shipping =
    address.division === "Dhaka"
      ? SHIPPING_INSIDE_DHAKA
      : SHIPPING_OUTSIDE_DHAKA;
  const total = subtotal + shipping - couponDiscount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    if (couponCode.trim().toUpperCase() === "SAVE10") {
      const disc = Math.round(subtotal * 0.1);
      setCouponDiscount(disc);
      setCouponApplied(true);
      toast.success(`Coupon applied! You save ${fmt(disc)}`);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponCode("");
  };

  // ── Note & Submit ─────────────────────────────
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!address.fullName.trim()) {
      toast.error("Enter your full name");
      return false;
    }
    if (!/^01[3-9]\d{8}$/.test(address.phone)) {
      toast.error("Enter valid BD phone: 01XXXXXXXXX");
      return false;
    }
    if (!address.division) {
      toast.error("Select a division");
      return false;
    }
    if (!address.district) {
      toast.error("Select a district");
      return false;
    }
    if (!address.upazila) {
      toast.error("Select an upazila / thana");
      return false;
    }
    if (!address.address.trim()) {
      toast.error("Enter your full address");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const payload = {
      items: orderItems,
      deliveryAddress: address,
      paymentMethod,
      pricing: {
        subtotal,
        shippingCharge: shipping,
        couponCode: couponApplied ? couponCode : null,
        couponDiscount,
        total,
      },
      note: note.trim() || null,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");
      const { orderId, redirect } = await res.json();

      // ── Cleanup Redux + sessionStorage ──
      if (mode === "buynow") {
        dispatch(clearBuyNowItem());
        sessionStorage.removeItem("buyNowItem");
      } else {
        dispatch(removeAllFromCart());
      }

      // ── SSLCommerz → gateway এ পাঠাও ──
      // ── COD → directly success page   ──
      if (redirect) {
        window.location.href = redirect;
      } else {
        router.replace(`/order-success?id=${orderId}`);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // data
    orderItems,
    address,
    paymentMethod,
    couponCode,
    couponApplied,
    couponDiscount,
    note,
    submitting,
    // geo
    divisionNames,
    districtNames,
    upazilaNames,
    // prices
    subtotal,
    shipping,
    total,
    // setters
    setField,
    setPaymentMethod,
    setCouponCode,
    setNote,
    setAddress,
    // handlers
    handleApplyCoupon,
    removeCoupon,
    handleSubmit,
  };
}

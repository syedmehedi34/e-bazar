// models/Coupon.ts
import mongoose, { Schema, Document } from "mongoose";

// ── Sub-types ──────────────────────────────────────────────────────
export interface IUsageRecord {
  userId: string; // User._id
  orderId: string; // Order.orderId  e.g. "EB-20260311-XXXXX"
  usedAt: Date;
}

export interface ICoupon extends Document {
  // ── Identity ───────────────────────────────────────────────────
  code: string; // "SAVE20" — always uppercase, unique

  // ── Discount ───────────────────────────────────────────────────
  type: "percentage" | "fixed_amount" | "free_shipping" | "buy_x_get_y";
  value: number; // 20 → 20% or ৳20 depending on type
  maxDiscountAmount: number | null; // cap for percentage e.g. max ৳500 off; null = no cap

  // ── buy_x_get_y (only relevant when type === "buy_x_get_y") ────
  buyQuantity: number | null; // buy X
  getQuantity: number | null; // get Y free

  // ── Conditions ─────────────────────────────────────────────────
  minOrderAmount: number; // minimum cart subtotal to unlock coupon

  // ── Scope ──────────────────────────────────────────────────────
  applicableTo: "all" | "specific_products" | "specific_categories";
  productIds: string[]; // Product._id strings
  categories: string[]; // product.category strings e.g. ["Electronics"]

  // ── Validity ───────────────────────────────────────────────────
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;

  // ── Usage tracking ─────────────────────────────────────────────
  usageLimit: number | null; // total uses allowed; null = unlimited
  perUserLimit: number; // max uses per user
  usedCount: number; // auto-incremented on every use
  usageRecords: IUsageRecord[]; // full history — needed for perUserLimit check

  // ── Meta ───────────────────────────────────────────────────────
  createdBy: string | null; // User._id of admin who created this
  createdAt: Date;
  updatedAt: Date;
}

// ── Sub-schemas ────────────────────────────────────────────────────
const UsageRecordSchema = new Schema<IUsageRecord>(
  {
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    usedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

// ── Main schema ────────────────────────────────────────────────────
const CouponSchema = new Schema<ICoupon>(
  {
    // ── Identity ─────────────────────────────────────────────────
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // ── Discount ─────────────────────────────────────────────────
    type: {
      type: String,
      enum: ["percentage", "fixed_amount", "free_shipping", "buy_x_get_y"],
      required: true,
    },
    value: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number, default: null }, // null = no cap

    // ── buy_x_get_y ───────────────────────────────────────────────
    buyQuantity: { type: Number, default: null },
    getQuantity: { type: Number, default: null },

    // ── Conditions ────────────────────────────────────────────────
    minOrderAmount: { type: Number, default: 0 },

    // ── Scope ─────────────────────────────────────────────────────
    applicableTo: {
      type: String,
      enum: ["all", "specific_products", "specific_categories"],
      default: "all",
    },
    productIds: { type: [String], default: [] },
    categories: { type: [String], default: [] },

    // ── Validity ──────────────────────────────────────────────────
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true },

    // ── Usage tracking ────────────────────────────────────────────
    usageLimit: { type: Number, default: null }, // null = unlimited
    perUserLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    usageRecords: { type: [UsageRecordSchema], default: [] },

    // ── Meta ──────────────────────────────────────────────────────
    createdBy: { type: String, default: null },
  },
  { timestamps: true },
);

// ── Indexes ────────────────────────────────────────────────────────
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, endDate: 1 });
CouponSchema.index({ "usageRecords.userId": 1 }); // fast per-user lookup

// ── Instance method: validate if a user can use this coupon ───────
// Call this at checkout before applying the discount
CouponSchema.methods.canUserUse = function (
  userId: string,
  cartSubtotal: number,
): { allowed: boolean; reason?: string } {
  const now = new Date();

  if (!this.isActive) return { allowed: false, reason: "Coupon is not active" };

  if (this.startDate && now < this.startDate)
    return { allowed: false, reason: "Coupon is not valid yet" };

  if (this.endDate && now > this.endDate)
    return { allowed: false, reason: "Coupon has expired" };

  if (this.usageLimit !== null && this.usedCount >= this.usageLimit)
    return { allowed: false, reason: "Coupon usage limit has been reached" };

  if (cartSubtotal < this.minOrderAmount)
    return {
      allowed: false,
      reason: `Minimum order amount is ৳${this.minOrderAmount}`,
    };

  const userUseCount = this.usageRecords.filter(
    (r: IUsageRecord) => r.userId === userId,
  ).length;

  if (userUseCount >= this.perUserLimit)
    return { allowed: false, reason: "You have already used this coupon" };

  return { allowed: true };
};

// ── Instance method: calculate discount amount ─────────────────────
CouponSchema.methods.calcDiscount = function (cartSubtotal: number): number {
  switch (this.type) {
    case "percentage": {
      const raw = (cartSubtotal * this.value) / 100;
      return this.maxDiscountAmount !== null
        ? Math.min(raw, this.maxDiscountAmount)
        : raw;
    }
    case "fixed_amount":
      return Math.min(this.value, cartSubtotal); // never discount more than total
    case "free_shipping":
      return 0; // shipping waived separately — not a cart subtotal discount
    case "buy_x_get_y":
      return 0; // handled at item level, not cart level
    default:
      return 0;
  }
};

export default mongoose.models.Coupon ||
  mongoose.model<ICoupon>("Coupon", CouponSchema);

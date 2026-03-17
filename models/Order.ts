import mongoose, { Schema, Document } from "mongoose";

// ── Sub-types ──────────────────────────────────────────────────────
export interface IReturnDetails {
  requestedAt: Date;
  reason: string;
  description?: string;
  status: "requested" | "approved" | "rejected" | "picked_up" | "refunded";
  resolvedAt?: Date;
  refundAmount?: number;
  refundMethod?: string;
  adminNote?: string;
}

export interface IDeliveryUpdate {
  status: string;
  message: string;
  location?: string;
  timestamp: Date;
}

export interface IOrder extends Document {
  orderId: string;
  userId?: string;

  items: {
    productId: string;
    title: string;
    brand?: string;
    image: string;
    selectedSize?: string | null;
    selectedColor?: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];

  deliveryAddress: {
    fullName: string;
    phone: string;
    altPhone?: string;
    division: string;
    district: string;
    upazila: string;
    address: string;
    addressType: "home" | "office" | "other";
  };

  paymentMethod: "cod" | "sslcommerz" | "stripe";
  paymentStatus: "cod_pending" | "pending" | "paid" | "failed" | "refunded";

  orderStatus:
    | "pending"
    | "processing"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled_by_customer"
    | "cancelled_by_admin"
    | "returned"
    | "failed";

  // ── Delivery timeline ──────────────────────────────────────────
  deliveryUpdates?: IDeliveryUpdate[];

  // ── Return ────────────────────────────────────────────────────
  returnDetails?: IReturnDetails;

  pricing: {
    subtotal: number;
    shippingCharge: number;
    couponCode?: string | null;
    couponDiscount: number;
    total: number;
  };

  transactionId?: string;
  gatewayData?: object;
  note?: string;
}

// ── Sub-schemas ────────────────────────────────────────────────────
const ReturnDetailsSchema = new Schema<IReturnDetails>(
  {
    requestedAt: { type: Date, default: Date.now },
    reason: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "picked_up", "refunded"],
      default: "requested",
    },
    resolvedAt: { type: Date },
    refundAmount: { type: Number },
    refundMethod: { type: String },
    adminNote: { type: String, trim: true },
  },
  { _id: false },
);

const DeliveryUpdateSchema = new Schema<IDeliveryUpdate>(
  {
    status: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

// ── Main Schema ────────────────────────────────────────────────────
const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, unique: true },
    userId: { type: String, default: null },

    items: [
      {
        productId: String,
        title: String,
        brand: String,
        image: String,
        selectedSize: String,
        selectedColor: String,
        quantity: Number,
        unitPrice: Number,
        subtotal: Number,
      },
    ],

    deliveryAddress: {
      fullName: String,
      phone: String,
      altPhone: String,
      division: String,
      district: String,
      upazila: String,
      address: String,
      addressType: String,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "sslcommerz", "stripe"],
    },

    paymentStatus: {
      type: String,
      enum: ["cod_pending", "pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled_by_customer",
        "cancelled_by_admin",
        "returned",
        "failed",
      ],
      default: "pending",
    },

    // Chronological delivery timeline — admin pushes updates here
    deliveryUpdates: {
      type: [DeliveryUpdateSchema],
      default: [],
      required: false,
    },

    // Only populated when user requests a return
    returnDetails: {
      type: ReturnDetailsSchema,
      default: undefined,
      required: false,
    },

    pricing: {
      subtotal: Number,
      shippingCharge: Number,
      couponCode: String,
      couponDiscount: Number,
      total: Number,
    },

    transactionId: String,
    gatewayData: Schema.Types.Mixed,
    note: String,
  },
  { timestamps: true },
);

// ── Indexes ────────────────────────────────────────────────────────
OrderSchema.index({ userId: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ "deliveryAddress.phone": 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);

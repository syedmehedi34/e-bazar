// models/Order.ts
import mongoose, { Schema, Document } from "mongoose";

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
  paymentStatus: "cod_pending" | "pending" | "paid" | "failed";
  orderStatus:
    | "processing"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";
  pricing: {
    subtotal: number;
    shippingCharge: number;
    couponCode?: string | null;
    couponDiscount: number;
    total: number;
  };
  transactionId?: string;
  gatewayData?: object; // ← SSLCommerz ও Stripe এর raw response
  note?: string;
}

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
    paymentMethod: { type: String, enum: ["cod", "sslcommerz", "stripe"] },
    paymentStatus: { type: String, default: "pending" },
    orderStatus: { type: String, default: "processing" },
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

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);

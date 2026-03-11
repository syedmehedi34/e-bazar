export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  brand?: string;
  selectedSize?: string | null;
  selectedColor?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  altPhone: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  addressType: "home" | "office" | "other";
}

export type PaymentMethod = "cod" | "sslcommerz" | "stripe" | "paypal";

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  logo: string;
  desc: string;
  badge?: string;
}

export interface OrderPayload {
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  pricing: {
    subtotal: number;
    shippingCharge: number;
    couponCode: string | null;
    couponDiscount: number;
    total: number;
  };
  note: string | null;
  orderMode: string;
  createdAt: string;
}

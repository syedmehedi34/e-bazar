export interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    deliveryAddress?: string;
  };
  product: {
    id?: string;
    name: string;
    brand?: string;
    category?: string;
    sizes?: string[];
    quantity?: number;
    totalPrice: number;
    currency?: string;
    image: string;
  };
  payment: {
    method: string;
    paymentStatus: string;
    orderStatus: string;
    verifiedByAdmin?: boolean;
    transactionId?: string;
  };
  delivery: {
    date: string;
    status: string;
    charge?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

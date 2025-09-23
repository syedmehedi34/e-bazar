// orderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductDetails {
  totalPrice: number;
  quantity: number;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productBrand: string;
  productCategory: string;
  productSizes: string | string[];
  productColors: string | string[];
  productStock: number;
  productRating: number;
  productCurrency: string;
  productDescription: string;
  paymentMethod: string;
}

interface OrderState {
  orderDetails: ProductDetails | null;
}

const initialState: OrderState = {
  orderDetails: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderDetails: (state, action: PayloadAction<ProductDetails>) => {
      state.orderDetails = action.payload;
    },
  },
});

export const { setOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;

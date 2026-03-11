"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BuyNowItem {
  productId: string;
  title: string;
  image: string;
  brand?: string;
  selectedSize?: string | null;
  selectedColor?: string | null;
  quantity: number;
  unitPrice: number; // discountPrice
  subtotal: number; // unitPrice * quantity
}

interface BuyNowState {
  item: BuyNowItem | null;
}

const initialState: BuyNowState = {
  item: null,
};

export const buyNowSlice = createSlice({
  name: "buyNow",
  initialState,
  reducers: {
    setBuyNowItem: (state, action: PayloadAction<BuyNowItem>) => {
      state.item = action.payload;
    },
    clearBuyNowItem: (state) => {
      state.item = null;
    },
  },
});

export const { setBuyNowItem, clearBuyNowItem } = buyNowSlice.actions;
export default buyNowSlice.reducer;

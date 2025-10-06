'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  _id: string;
  title: string;
  brand?: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  images: string[];
}

export interface addToCartState {
  value: CartItem[];
}

const initialState: addToCartState = {
  value: []
}

export const addToCartSlice = createSlice({
  name: 'addToCart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const exist = state.value.find(cart => cart._id === action.payload._id);
      if (exist) {
        exist.quantity += 1;
      } else {
        state.value.push({ ...action.payload, quantity: 1 });
      }
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const exist = state.value.find(cart => cart._id === action.payload);
      if (exist) {
        exist.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const exist = state.value.find(cart => cart._id === action.payload);
      if (exist && exist.quantity > 1) {
        exist.quantity -= 1;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter(cart => cart._id !== action.payload);
    },
    removeAllFromCart: (state) => {
      state.value = [];
    }
  }
})

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  removeAllFromCart
} = addToCartSlice.actions;

export default addToCartSlice.reducer;

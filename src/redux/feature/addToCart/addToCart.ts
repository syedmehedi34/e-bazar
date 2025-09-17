'use client'
import { createSlice } from '@reduxjs/toolkit'

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
  value: CartItem[]
}

const loadFromLocalStorage = () : CartItem[] =>
  JSON.parse(globalThis?.localStorage?.getItem('shopping-cart') || '[]')

const savedLocalStorage = (payload: CartItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('shopping-cart', JSON.stringify(payload));
}

const initialState: addToCartState = {
  value: loadFromLocalStorage()
}
export const addToCartSlice = createSlice({
  name: 'addToCart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const exist = state.value.find(cart => cart._id === action.payload._id)
      if (exist) {
        exist.quantity += 1
      } else {
        state.value.push({ ...action.payload, quantity: 1 })
      }
      savedLocalStorage(state.value)
    },
    incrementQuantity: (state, action) => {
      const exist = state.value.find(cart => cart._id === action.payload)
      if (exist) {
        exist.quantity += 1
        savedLocalStorage(state.value)
        state.value
      }
    },

    decrementQuantity: (state, action) => {
      const exist = state.value.find(cart => cart._id === action.payload)
      if (exist && exist.quantity > 1) {
        exist.quantity -= 1
        savedLocalStorage(state.value)
      }
    },
    removeFromCart: (state, action) => {
      state.value = state.value.filter(cart => cart._id !== action.payload);
      savedLocalStorage(state.value);
    },
    removeAllFromCart :(state)=>{
      state.value= [];
      localStorage.removeItem('shopping-cart'); 
    }
  }
})
export const { addToCart,incrementQuantity, decrementQuantity, removeFromCart,removeAllFromCart } = addToCartSlice.actions
export default addToCartSlice.reducer

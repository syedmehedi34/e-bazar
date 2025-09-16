'use client'
import { createSlice } from '@reduxjs/toolkit'

export interface addToCartState {
  value: any[]
}

const loadFromLocalStorage = () =>
  JSON.parse(globalThis?.localStorage?.getItem('shopping-cart') || '[]')

const savedLocalStorage = (payload: any) => {
  if (typeof window === 'undefined') return
  const carts = JSON.parse(localStorage.getItem('shopping-cart') || '[]')

  const existCart = carts.find((cart: any) => cart._id === payload._id)
  if (!existCart) {
    localStorage.setItem('shopping-cart', JSON.stringify(payload))
  }
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
    }
  }
})
export const { addToCart,incrementQuantity, decrementQuantity, removeFromCart } = addToCartSlice.actions
export default addToCartSlice.reducer

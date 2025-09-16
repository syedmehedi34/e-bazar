'use client'
import { createSlice } from '@reduxjs/toolkit'

export interface addToCartState {
  value: any[]
}

const loadFromLocalStorage = () =>JSON.parse(globalThis?.localStorage?.getItem('shopping-cart') || '[]')

const savedLocalStorage = (payload: any) => {
  if (typeof window === 'undefined') return
  const carts = JSON.parse(localStorage.getItem('shopping-cart') || '[]')

  const existCart = carts.find((cart: any) => cart._id === payload._id)
  if (!existCart) {
    const updatedCarts = [...carts, payload]
    localStorage.setItem('shopping-cart', JSON.stringify(updatedCarts))
    
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
      const exist = state.value.find(cart => cart._id === action.payload._id);
      if (!exist) {
        state.value.push(action.payload); 
        savedLocalStorage(action.payload); 
    }
  }
}})
export const { addToCart } = addToCartSlice.actions
export default addToCartSlice.reducer

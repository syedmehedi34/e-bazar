import { configureStore } from '@reduxjs/toolkit'
import todoSlice from './feature/todoSlice/todoSlice'
import { addToCartSlice } from './feature/addToCart/addToCart'
import orderSlice from './feature/orderSummarySlice/orderSummarySlice'
 const store = () => {
  return configureStore({
    reducer: {
      todo:todoSlice,
      cart: addToCartSlice.reducer,
      orderSummary: orderSlice
    }
  })
}


// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export default store
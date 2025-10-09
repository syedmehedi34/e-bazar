import { configureStore } from '@reduxjs/toolkit'
import todoSlice from './feature/todoSlice/todoSlice'
import addToCartReducer from './feature/addToCart/addToCart'
import orderSlice from './feature/orderSummarySlice/orderSummarySlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// persist config
const persistConfig = {
  key: 'cart',
  storage,
}

// persisted reducer
const persistedCartReducer = persistReducer(persistConfig, addToCartReducer)

const store = configureStore({
  reducer: {
    todo: todoSlice,
    cart: persistedCartReducer,
    orderSummary: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

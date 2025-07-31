import { configureStore } from '@reduxjs/toolkit'
import todoSlice from './feature/todoSlice/todoSlice'

 const reduxStore = () => {
  return configureStore({
    reducer: {
      todo:todoSlice
    }
  })
}


// Infer the type of makeStore
export type AppStore = ReturnType<typeof reduxStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export default reduxStore
'use client'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from '@/redux/store'

interface Props {
  children: ReactNode
}

const ReduxProvider = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default ReduxProvider
// 'use client'
// import React, { ReactNode } from 'react'
// import { Provider } from 'react-redux'
// import reduxStore from '../../redux/store'
// type prpos = {
//     children: ReactNode
// }
// const provider = ({ children }: prpos) => {
//     return (
//         <Provider store={reduxStore()}>
//             {children}
//         </Provider>
//     )
// }

// export default provider
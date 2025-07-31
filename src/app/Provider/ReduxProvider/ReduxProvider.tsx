'use client'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import reduxStore from '../../../redux/store'
type prpos ={
    children:ReactNode
}
const provider = ({children}:prpos) => {
  return (
    <Provider store={reduxStore()}>
        {children}
    </Provider>
  )
}

export default provider
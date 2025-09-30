"use client"

import OrderContainer from '@/Components/Dashboard/Orders/OrderContainer/OrderContainer'
import Pagination from '@/Components/Pagination/Pagination'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [PageArray, setPageArray] = useState([]);

    const getOrders = useCallback(async()=>{
        const res = await axios.get(`http://localhost:5000/admin/order`);
        if(res.status === 200){
            setOrders(res?.data.order);
            setPageArray(res?.data?.pageArray)
        }
    },[])

    useEffect(()=>{
        getOrders()
    },[])
  return (
    <div className='dark:text-white'>
        <div>
            <OrderContainer orders={orders} getOrders={getOrders}/>

           <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageArray={PageArray}/>
         
        </div>
    </div>
  )
}

export default AdminOrdersPage
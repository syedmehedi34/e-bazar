"use client"

import OrderContainer from '@/Components/Dashboard/Orders/OrderContainer/OrderContainer'
import Pagination from '@/Components/Pagination/Pagination'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [PageArray, setPageArray] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('latest')

    const getOrders = useCallback(async()=>{
        const res = await axios.get(`https://e-bazaar-server-three.vercel.app/admin/order?search=${search}&sort=${sort}&page=${currentPage}`, {withCredentials:true});
        if(res.status === 200){
            setOrders(res?.data.order);
            setPageArray(res?.data?.pageArray)
        }
    },[search,sort,currentPage])

    useEffect(()=>{
        getOrders()
    },[getOrders])

   
  return (
    <div className='dark:text-white'>
        <div>
            <OrderContainer
             orders={orders} 
             getOrders={getOrders}
             setSearch={setSearch}
             setSort={setSort}
            
            />

           <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageArray={PageArray}/>
         
        </div>
    </div>
  )
}

export default AdminOrdersPage
import React from 'react'
import { FaSearch } from 'react-icons/fa';
type OrderProps ={
      setSearch: React.Dispatch<React.SetStateAction<string>>;
      setSort: React.Dispatch<React.SetStateAction<string>>;
}
const OrderFilter:React.FC<OrderProps> = ({setSearch,setSort}) => {
  return (
     <div className="flex flex-col justify-between sm:flex-row gap-4 md:items-center  mb-4 bg-white dark:bg-gray-800 dark:text-white p-4">
                        {/* Search Box */}
                        <div className="flex items-center md:w-1/2 ">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search by, name,status,price,email,id"
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="input pl-10 dark:bg-gray-600 "
                                />
                                <FaSearch className="absolute left-3 top-2.5 text-gray-300 w-5 h-5" />
                            </div>
                        </div>
    
                        {/* Filter Dropdown */}
                        <div>
                            <select
                                onChange={(e) => setSort(e.target.value)}
                                className="select select-bordered w-full max-w-xs dark:bg-gray-600">
                                <option value="latest">Latest Orders</option>
                                <option value="high-low">High Price Orders</option>
                                <option value="low-high">Low Price Orders</option>
                                <option value="paid">Paid Orders</option>
                                <option value="pending">Pending orders</option>
                                <option value="failed">Failed Orders</option>
                                <option value="refunded">Refunded Orders</option>
                            </select>
                        </div>
                    </div>
  )
}

export default OrderFilter
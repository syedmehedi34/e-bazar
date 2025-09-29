"use client"
import ProductsTable from '@/Components/Dashboard/ProductsTablea/ProductsTablea';
import Pagination from '@/Components/Pagination/Pagination';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageArray, setPageArray] = useState([]);
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')

    const getProductsData = useCallback(async () => {
        const res = await axios.get(`http://localhost:5000/admin/products/list?page=${currentPage}&sort=${sort}&search=${search}`);
        const data = res?.data;
        console.log(data)
        setProducts(data?.products);
        setPageArray(data?.pageArray)
    }, [currentPage,sort,search])

    useEffect(() => {
        getProductsData()
    }, [getProductsData])

    return (
        <div>
            <div>
                <div className="flex flex-col justify-between sm:flex-row gap-4 md:items-center  mb-4 bg-white dark:bg-gray-800 dark:text-white p-4">
                    {/* Search Box */}
                    <div className="flex items-center md:w-1/2 ">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={(e)=>setSearch(e.target.value)}
                                className="input pl-10 dark:bg-gray-600 "
                            />
                            <FaSearch className="absolute left-3 top-2.5 text-gray-300 w-5 h-5" />
                        </div>
                    </div>

                    {/* Filter Dropdown */}
                    <div>
                        <select
                        onChange={(e)=>setSort(e.target.value)}
                        className="select select-bordered w-full max-w-xs dark:bg-gray-600">
                            <option value="latest">Latest Products</option>
                            <option value="high-low">High Price Products</option>
                            <option value="low-high">Low Price Products</option>
                            <option value="out_of_stock">Out of Stock</option>
                            <option value="in_stock">In Stock</option>
                        </select>
                    </div>
                </div>

                <div className='bg-white dark:bg-gray-800 dark:text-white p-4'>
                    <ProductsTable products={products} />
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageArray={pageArray} />
                </div>
            </div>
        </div>
    )
}

export default ProductsList
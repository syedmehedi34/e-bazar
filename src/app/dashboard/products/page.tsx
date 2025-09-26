"use client"
import ProductsTable from '@/Components/Dashboard/ProductsTablea/ProductsTablea';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
const ProductsList = () => {
    const [products, setProducts] = useState([]);

    const getProductsData = useCallback(async () => {
        const res = await axios.get(`http://localhost:5000/admin/products/list`);
        const data = res?.data;
        setProducts(data)
    }, [])

    useEffect(() => {
        getProductsData()
    }, [])

    return (
        <div>
            <div>
                <div className="flex flex-col justify-between sm:flex-row gap-4 md:items-center  mb-4 bg-white p-4">
                    {/* Search Box */}
                    <div className="flex items-center md:w-1/2 ">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="input pl-10 "
                            />
                            <FaSearch className="absolute left-3 top-2.5 text-gray-300 w-5 h-5" />
                        </div>
                    </div>

                    {/* Filter Dropdown */}
                    <div>
                        <select className="select select-bordered w-full max-w-xs">
                            <option value="latest_products">Latest Products</option>
                            <option value="high_price">High Price Products</option>
                            <option value="low_price">Low Price Products</option>
                            <option value="out_of_stock">Out of Stock</option>
                            <option value="in_stock">In Stock</option>
                        </select>
                    </div>
                </div>

                <div className='bg-white p-4'>
                    <ProductsTable products={products} />
                </div>
            </div>
        </div>
    )
}

export default ProductsList
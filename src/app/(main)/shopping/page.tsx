"use client"
import { Category } from '@/Components/Shopping/Category';
import ShoppingCard from '@/Components/Shopping/ShoppingCard';

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import Sorting from '@/Components/Shopping/Sorting';
import Pricerange from '@/Components/Shopping/Pricerange';
import { getCategory } from '@/hook/Category/CategoryFetch';
import axios from 'axios';
import Pagination from '@/Components/Pagination/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
const Shopping = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get('search') || '';
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const [sort, setSort] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const pageNumber = Math.ceil(count / 15) || 1
    const pageArray = [...Array(pageNumber).keys().map((i) => i + 1)];
    const [total, setTotal] = useState(0)


  
    

 const fetchData = useCallback(async () => {
  try {
    const categoryData = await getCategory();
    setCategory(categoryData);

    const params = new URLSearchParams();
    if (sort) params.set('sort', sort);
    if (selectedCategory) params.set('category', selectedCategory);
    if (minPrice) params.set('minPrice', minPrice.toString());
    if (maxPrice) params.set('maxPrice', maxPrice.toString());
    if (currentPage) params.set('page', currentPage.toString());
    params.set('limit', '15');
    if (search) params.set('search', search);

    const res = await axios.get(`http://localhost:5000/shopping?${params.toString()}`);
    setProducts(res?.data?.product);
    setCount(res?.data?.total);
    setTotal(res?.data?.totalProducts);
  } catch (error) {
    console.error(error);
  }
}, [sort, selectedCategory, minPrice, maxPrice, currentPage, search]); 


    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleReset = () => {
        setSort('');
        setSelectedCategory('');
        setMinPrice(0);
        setMaxPrice(0);
        setCurrentPage(1);
        const params = new URLSearchParams(searchParams.toString());

        params.delete('search'); 
        router.push(`/shopping?${params.toString()}`);

    };



    return (
        <div className='min-h-screen'>
            <div className='container-custom'>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 py-6 px-4">
                    {/* Left side links */}
                    <div className="flex gap-1 text-sm">
                        <Link href="/" className="text-gray-700 transition-colors underline-offset-2 underline">
                            Home
                        </Link>
                        <p className='text-gray-400'>/</p>
                        <Link href="/shopping" className="text-gray-400 transition-colors underline-offset-2 underline">
                            Shopping
                        </Link>
                    </div>

                    {/* Right side filter + result */}
                    <Sorting setSort={setSort} total={total} />
                </div>

                <div className='grid lg:grid-cols-5 gap-5 my-5'>
                    <div className='lg:col-span-1'>
                        <Category products={category} setSelectedCategory={setSelectedCategory} />
                        <Pricerange setMinPrice={setMinPrice} setMaxPrice={setMaxPrice} />

                        <button onClick={handleReset} className='btn btn-block mt-4'>Reset Filter</button>

                    </div>
                    <div className='lg:col-span-4 '>
                        <div >
                            {
                                <ShoppingCard products={products} />
                            }
                        </div>

                        {/* Pagination */}
                        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageArray={pageArray} />


                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shopping
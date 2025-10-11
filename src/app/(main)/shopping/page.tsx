"use client"
import { Category } from '@/Components/Shopping/Category';
import ShoppingCard from '@/Components/Shopping/ShoppingCard';

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import Sorting from '@/Components/Shopping/Sorting';
import Pricerange from '@/Components/Shopping/Pricerange';
import axios from 'axios';
import Pagination from '@/Components/Pagination/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '@/Components/Loader/Loader';
const Shopping = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get('search') || '';
    const [loading, setLoading] = useState(false)
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
            setLoading(true)



            const params = new URLSearchParams();
            if (sort) params.set('sort', sort);
            if (selectedCategory) params.set('category', selectedCategory);
            if (minPrice) params.set('minPrice', minPrice.toString());
            if (maxPrice) params.set('maxPrice', maxPrice.toString());
            if (currentPage) params.set('page', currentPage.toString());
            params.set('limit', '12');
            if (search) params.set('search', search);

            const res = await axios.get(`http://localhost:5000/shopping?${params.toString()}`, {
                withCredentials:true
            });

            setProducts(res?.data?.product);
            setCount(res?.data?.total);
            setTotal(res?.data?.totalProducts);
            setCategory(res?.data?.allProducts)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
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
        <div className='min-h-screen relative dark:text-white'>
            <nav className='bg-cover w-full h-[200px]' style={{ backgroundImage: `url("https://preview.colorlib.com/theme/cozastore/images/bg-01.jpg.webp")` }}>
                <h2 className='flex justify-center items-center h-full text-2xl font-bold text-white tracking-wide'>Shopping</h2>
            </nav>
            <div className='container-custom'>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 py-6 ">
                    {/* Left side links */}
                    <div className="flex gap-1 text-sm">
                        <Link href="/" className="text-gray-700 dark:text-gray-200 transition-colors underline-offset-2 underline">
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

                        <button onClick={handleReset} className='btn btn-block dark:bg-gray-800 dark:text-white dark:border-gray-600 mt-4'>Reset Filter</button>

                    </div>
                    <div className='lg:col-span-4 min-h-screen '>
                        {
                            loading ? (
                                <Loader />
                            ) : (
                                products.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-72 text-center">

                                        <h2 className="text-xl font-semibold text-gray-700">
                                            No Products Found
                                        </h2>
                                        <p className="text-gray-500 mt-1">
                                            Try changing filters or search again.
                                        </p>
                                    </div>
                                ) : (
                                    <div >
                                        {
                                            <ShoppingCard products={products} />
                                        }
                                        {/* Pagination */}
                                        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageArray={pageArray} />
                                    </div>
                                )
                            )
                        }





                    </div>
                </div>
            </div>
        </div >
    )
}

export default Shopping
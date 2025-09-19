import { Category } from '@/Components/Shopping/Category';
import ShoppingCard from '@/Components/Shopping/ShoppingCard';

import Link from 'next/link'
import React from 'react'
import Sorting from '@/Components/Shopping/Sorting';
import Pricerange from '@/Components/Shopping/Pricerange';

interface SearchParams {
    sort?:string;
    minPrice?:string;
    maxPrice?:string;
    category?:string

}

const Shopping = async ({searchParams}:{searchParams : SearchParams}) => {
     // wait for params
    const params = await searchParams;

    const query = new URLSearchParams(params as any).toString();
  
    const res = await fetch(`http://localhost:5000/shopping?${query}`);
    const products = await res.json();



    return (
        <div className='min-h-screen'>
            <div className='w-11/12 mx-auto'>
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
                    <Sorting searchParams={searchParams} />
                </div>

                <div className='grid lg:grid-cols-5 gap-5 my-5'>
                    <div className='lg:col-span-1'>
                        <Category products={products} searchParams={searchParams}   />
                        <Pricerange searchParams={searchParams}/>
                    </div>
                    <div className='lg:col-span-4 '>
                        <div >
                            {
                                <ShoppingCard products={products}  />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shopping
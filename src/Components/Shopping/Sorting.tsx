"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface SearchProps{
    searchParams: any;
}
const Sorting = ({searchParams}:SearchProps) => {
    const [sort, setSort] = useState(searchParams.sort || 'latest');
    const router = useRouter()

    useEffect(()=>{
        const params = new URLSearchParams();
        if(sort){
            params.set('sort', sort);
        }

        router.push(`/shopping?${params.toString()}`)

    },[sort])
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-5 w-full md:w-auto">
            <p className="flex gap-1 text-sm">
                Showing <span className="font-medium">0</span> Result
            </p>

            <select
                className="w-full sm:w-[200px] md:w-[250px] lg:w-[300px] select "
                defaultValue="latest"
                onChange={(e)=>setSort(e.target.value)}
            >
                <option value="latest" className="bg-gray-200 text-black hover:bg-gray-400">Latest</option>
                <option value="older">Older</option>
                <option value="low-high">Low to High</option>
                <option value="high-low">High to Low</option>
            </select>
        </div>
    )
}

export default Sorting
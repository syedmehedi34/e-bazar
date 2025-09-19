"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
interface SearchProps {
    searchParams: any;
}

const Pricerange = ({ searchParams }: SearchProps) => {
    const [minPrice, setMinPrice] = useState(searchParams.minPrice || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || "");
    const router = useRouter();
    const handleChange = () => {
        const params = new URLSearchParams();

        if (minPrice) params.set("minPrice", minPrice.toString());
        if (maxPrice) params.set("maxPrice", maxPrice.toString());
        router.push(`/shopping?${params.toString()}`);
    };

    useEffect(() => {
        handleChange();
    }, [minPrice, maxPrice]);


    return (
        <div>
            <p className='text-lg font-bold mb-4'>
                Price Range
            </p>
            <div className='flex lg:flex-col gap-4 w-full'>
                <input
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    type="number" placeholder='Min Price..' className='input w-full' />
                <input
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    type="number" className='input w-full ' placeholder='Max Price..' />
            </div>

        </div>
    )
}

export default Pricerange
"use client"

import React, { useState } from 'react'
import { MdOutlineArrowDropDown, MdOutlineArrowRight } from "react-icons/md";


type Product = {
    category: string;
    subCategory: string
};


interface CategoryProps {
    products: Product[];
    setSelectedCategory: (category: string) => void;
    
}

export const Category: React.FC<CategoryProps> = ({ products,setSelectedCategory }) => {
    
    const [openCategory, setOpenCategory] = useState<string | null>(null);
   
    
  

    const categories = products?.reduce((acc: Record<string, Set<string>>, product) => {
        if (!acc[product.category]) {
            acc[product.category] = new Set<string>();
        }

        acc[product.category].add(product.subCategory);
        return acc;
    }, {});

    const handleSubCategoryClick = (sub: string) => {
        
            setSelectedCategory(sub)
    }
  
    return (
        <div>
            <ul className='rubik'>
                <p className='text-lg font-bold mb-4'>Category</p>
                {
                    Object.keys(categories).map((category) => (
                        <li key={category}>
                            <button
                                className='flex items-center justify-between w-full mb-4 btn dark:bg-gray-800 dark:border-none dark:text-white'
                                onClick={() => setOpenCategory(openCategory === category ? null : category)}>
                                {category}
                                <MdOutlineArrowDropDown />
                            </button>
                            {
                                openCategory === category && (
                                    <ul className='ml-4'>
                                        {Array.from(categories[category]).map((sub) => (
                                            <li
                                                onClick={() => handleSubCategoryClick(sub)}
                                                className='flex w-full justify-between items-center btn btn-sm btn-outline mb-2 border-gray-300 dark:hover:bg-gray-800 dark:text-white dark:border-gray-600' key={sub}>{sub} <MdOutlineArrowRight />
                                            </li>
                                        ))}
                                    </ul>
                                )
                            }
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

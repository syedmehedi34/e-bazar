'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BsFillCartCheckFill } from 'react-icons/bs'

interface Products {
    title: string,
    price: number,
    discountPrice: number,
    rating: number,
    stock: number,
    images: string[]
    category: string,
    _id?:string
}

type ProductsProps = {
    products: Products[]
}
const ShoppingCard: React.FC<ProductsProps> = ({ products }) => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 '>
            {
                products.map((product) => (
                    <div key={product._id} className="  rounded-lg shadow  hover:shadow-md text-sm   rubik cursor-pointer  transition-all duration-300  p-2 dark:bg-gray-800 dark:text-white ">
                        {/* Fixed card width (same size) */}
                        <Link href={`checkout/${product._id}`} className=" sm:h-45 h-[300px] overflow-hidden flex items-center justify-center mx-auto">
                            <Image
                                src={product.images?.[0] || "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"}
                                width={100}
                                height={100}
                                alt={product.title}
                                priority
                                className=" w-full h-full object-contain rounded-md mx-auto rounded-box "
                            />
                        </Link>
                        <div className="">
                            <h2 className="mt-2 font-medium line-clamp-1 ">{product.title}</h2>

                            <div className="flex justify-between items-center">
                                <p className="text-xl my-2 font-bold">৳ {product.price}</p>
                                <p className="text-red-500">{product.rating} </p>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                {product.stock && <p>{product.stock} stock</p>}

                                <button
                                    
                                    className="text-[12px] p-2 bg-gray-800 rounded-full cursor-pointer hover:bg-red-800 ">
                                    <BsFillCartCheckFill size={14} color="white" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ShoppingCard
'use client'
import { addToCart } from '@/redux/feature/addToCart/addToCart'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BsFillCartCheckFill } from 'react-icons/bs'
import { FaStar } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

interface Products {
    title: string,
    price: number,
    discountPrice: number,
    rating: number,
    stock: number,
    images: string[]
    category: string,
    _id: string
}



type ProductsProps = {
    products: Products[]

}
const ShoppingCard: React.FC<ProductsProps> = ({ products }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.value);
    const handledTwoCartItem = (product: Products) => {
        const exist = cartItems.find((item) => item._id === product._id);
        if (exist) {
            toast.info("This item is already in your cart! quantity update");
        } else {
            dispatch(addToCart({ ...product, quantity: 1 }));
            toast.success("Item added to cart!");
        }
    };

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 '>
            {
                products.map((product) => (
                    <div key={product._id} className="  rounded-lg shadow  hover:shadow-md text-sm   rubik cursor-pointer  transition-all duration-300   dark:bg-gray-800 dark:text-white ">
                        {/* Fixed card width (same size) */}
                       
                        <div className="relative">
                            <Link href={`checkout/${product._id}`} className=" sm:h-45 h-[300px] overflow-hidden flex items-center justify-center mx-auto bg-white ">
                                <Image
                                    src={product.images[0] || "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"}
                                    width={100}
                                    height={100}
                                    alt={product.title}
                                    priority
                                    className=" w-full h-full object-contain rounded-md mx-auto "
                                />


                            </Link>
                            <button
                                onClick={() => handledTwoCartItem(product)}
                                className=" absolute bottom-2 left-2 text-[12px] p-2 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-600 ">
                                <BsFillCartCheckFill size={14} color="white" />
                            </button>
                        </div>
                        <div className="px-2 mb-2">
                            <h2 className="mt-2 font-medium line-clamp-1 ">{product.title}</h2>

                            <div className="flex justify-between items-center">
                                <p className="text-xl my-2 font-bold">৳ {product.price}</p>
                                <p className="font-bold flex items-center gap-1 text-gray-700 dark:text-gray-100">
                                    {[...Array(Math.round(product.rating))].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                    <span className="text-gray-700 dark:text-gray-300 ml-2">{product.rating}</span>
                                </p>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                {product.stock && <p>{product.stock} stock</p>}

                            
                                <Link href={`checkout/${product._id}`} className="px-3 py-1 bg-gray-600 rounded-sm cursor-pointer text-xs text-white">Buy Now</Link>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ShoppingCard
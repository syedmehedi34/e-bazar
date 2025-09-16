"use client"

import { addToCart } from "@/redux/feature/addToCart/addToCart";
import Image from "next/image";
import React from "react";
import { BsFillCartCheckFill } from "react-icons/bs";
import { useDispatch } from "react-redux";

interface Product {
    id: string;
    title: string;
    images: string[];
    price: number;
    discountPrice?: number;
    rating?: number;
    stock?:number;
   
}

interface ProductsCardProps {
    product: Product;
}

const ProductsCard: React.FC<ProductsCardProps> = ({ product }) => {
    const { title, images, price, discountPrice, rating, stock} = product;
    const dispatch = useDispatch()

    return (
        <div className="  rounded-lg shadow-sm text-sm   rubik cursor-pointer hover:shadow-gray-800 transition-all duration-300  p-2">
            {/* Fixed card width (same size) */}
            <div className=" sm:h-45 h-[300px] overflow-hidden flex items-center justify-center mx-auto">
                <Image
                    src={images[0] || "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"}
                    width={100}
                    height={100}
                    alt={title}
                    priority
                    className=" w-full h-full object-contain rounded-md mx-auto "
                />
            </div>
            <div className="">
                <h2 className="mt-2 font-medium line-clamp-1 ">{title}</h2>
                
                <div className="flex justify-between items-center">
                    <p className="text-xl my-2 font-bold">৳ {price}</p>
                    <p className="text-red-500">{rating} </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                    {stock && <p>{stock} stock</p>}
                    
                    <button 
                    onClick={()=>dispatch(addToCart(product))}
                    className="text-[12px] p-2 bg-gray-800 rounded-full cursor-pointer hover:bg-red-800 ">
                        <BsFillCartCheckFill size={14} color="white"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductsCard;

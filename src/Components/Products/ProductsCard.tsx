import Image from "next/image";
import React from "react";
import { BsFillCartCheckFill } from "react-icons/bs";
import { MdOutlineStar } from "react-icons/md";
interface Product {
    id: string;
    title: string;
    images: string[];
    price: number;
    discountPrice?: number;
    rating?: number;
    stock?:number
}

interface ProductsCardProps {
    product: Product;
}

const ProductsCard: React.FC<ProductsCardProps> = ({ product }) => {
    const { title, images, price, discountPrice, rating, stock } = product;

    return (
        <div className=" rounded-lg shadow-md text-sm  shadow-white rubik cursor-pointer hover:shadow-red-600 transition-all duration-300 w-50 p-2">
            {/* Fixed card width (same size) */}
            <div className="w-45 sm:h-45 h-[300px] overflow-hidden flex items-center justify-center">
                <Image
                    src={images[0] || "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg"}
                    width={100}
                    height={100}
                    alt={title}
                    className=" w-45 h-full object-cover rounded-md "
                />
            </div>
            <div className="">
                <h2 className="mt-2 font-medium line-clamp-1 ">{title}</h2>
                <div className="flex justify-between items-center">
                    <p className="text-xl my-2 font-bold">৳ {price}</p>
                    {rating && <p className="text-red-500 flex justify-center">{rating}<MdOutlineStar /> </p>}
                </div>
                <div className="flex items-center justify-between gap-4">
                    {stock && <p>{stock} stock</p>}
                    
                    <button className="text-[12px] p-2 bg-red-600 rounded-full cursor-pointer hover:bg-red-800 ">
                        <BsFillCartCheckFill size={14}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductsCard;

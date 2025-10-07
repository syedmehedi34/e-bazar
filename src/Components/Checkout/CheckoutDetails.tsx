"use client"

import React, { useState } from 'react'
import { MdOutlineStar } from 'react-icons/md';
import Button from '../Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toast } from 'react-toastify';
import { addToCart } from '@/redux/feature/addToCart/addToCart';
import { useRouter } from 'next/navigation';
import { setOrderDetails } from '@/redux/feature/orderSummarySlice/orderSummarySlice';

interface Products {
    _id: string;
    title: string;
    price: number;
    category: string;
    currency: string;
    quantity: number;
    brand: string;
    rating: number;
    stock: number;
    sizes: string[];
    colors: string[];
    discountPrice: number;
    images: string[];
    description: string;

}
interface ProductDetails {
  totalPrice: number
  quantity: number
  productId: string
  productName: string
  productPrice: number
  productImage: string
  productBrand: string
  productCategory: string
  productSizes: string | string[] 
  productColors: string | string[] 
  productStock: number
  productRating: number
  productCurrency: string
  productDescription: string
paymentMethod: string;
}

type CheckoutDetailsProps = {
    products: Products
    selectedImage: string
}
const CheckoutDetails: React.FC<CheckoutDetailsProps> = ({ products, selectedImage }) => {
    const [quantity, setQuantity] = useState(1)
  
    const [selectedSize, setSelectedSize] = useState<string[]>([]);
    const [selectedColor, setSelectedColor] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()
    const [totalPrice, setTotalPrice] = useState(products.price);
    const [totaldiscountPrice, setTotalDiscountPrice] = useState(products.discountPrice);
    
    const router = useRouter()
    const cartItems = useSelector((state: RootState) => state.cart.value);
   
    const handledTwoCartItem = (product: Products) => {
        const exist = cartItems.find((item) => item._id === product._id);
        if (exist) {
            dispatch(addToCart({ ...exist, quantity: exist.quantity + quantity }));
            toast.info("Quantity updated in cart!");
        } else {
            dispatch(addToCart({ ...product, quantity }));
            toast.success("Item added to cart!");
        }
    };


    const handleIncrement = () => {
        if (quantity < (products.stock || 0)) {
            setQuantity(quantity + 1)
            setTotalPrice(products.price * (quantity + 1))
            setTotalDiscountPrice(products.discountPrice * (quantity + 1))
        }
    }
    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
            setTotalPrice(products.price * (quantity - 1))
            setTotalDiscountPrice(products.discountPrice * (quantity - 1))
        }
    }

    const handleBillingInfo = () => {
       
        const productsDetails = {
            totalPrice,
            quantity,
            productId: products._id,
            productName: products.title,
            productPrice: products.discountPrice,
            productImage: selectedImage || '/placeholder.png',
            productBrand: products.brand,
            productCategory: products.category,
            productSizes: selectedSize,
            productColors: selectedColor,
            productStock: products.stock,
            productRating: products.rating,
            productCurrency: products.currency,
            productDescription: products.description,

        }
        handleOpenModal()
        dispatch(setOrderDetails(productsDetails as ProductDetails))
        router.push('/orderSummary', )

    }

    const handleOpenModal = () => {
        setIsOpen(!isOpen);
    }


    return (
        <div className='rubik dark:text-white '>

            <h2 className='text-3xl font-semibold mb-4 max-md:text-center'>{products?.title}</h2>
            <p className='mb-2 flex items-center'>{[...Array(Math.floor(Number(products?.rating) || 0)).keys()].map((i) => (
                <span key={i} className=''><MdOutlineStar size={20} /></span>
            ))}
                <span className='ml-4 text-sm'>40-50 review</span>

            </p>
            {/* Price */}
            <div
                className='text-xl font-bold mb-2 flex items-center gap-4'>
                <p className=''> ৳ {totaldiscountPrice}</p>
                <p className='text-sm line-through text-gray-600 dark:text-gray-400'> ৳ {totalPrice}</p>
            </div>

            <p className='mb-2'><strong>Brand:</strong> {products?.brand}</p>

            <p className='mb-2'><strong>Stock:</strong> {products?.stock}</p>
            {/* Sizes */}
            <div className='mb-4  flex flex-col gap-2'>
                <p className='font-medium'> Sizes</p>
                <p className='flex gap-4 items-center'>
                    {products?.sizes && products.sizes.length > 0 ? (
                        products.sizes.map((s) => (
                            <span
                                onClick={() => setSelectedSize((prev)=>
                                    prev.includes(s) ?
                                     prev.filter(item => item !== s)
                                    : 
                                    [...prev, s]
                                )}
                                key={s}
                                className={`py-2 px-3 ${selectedSize.includes(s)? "bg-black text-white" : ""} h-10 flex justify-center items-center shadow shadow-gray-400 rounded-box hover:cursor-pointer`}
                            >
                                {s}
                            </span>
                        ))
                    ) : (
                        <span className='px-4 h-10 font-bold flex justify-center items-center shadow shadow-gray-400 rounded-box text-gray-500'>
                            No Sizes Available
                        </span>
                    )}
                </p>
            </div>
            {/* colors */}
            <div className='mb-4 flex flex-col gap-2'>
                <p className='font-medium'> Colors</p>
                <p className='flex gap-4 items-center'>
                    {products?.colors && products.colors.length > 0 ? (
                        products.colors.map((c) => (
                            <span
                                key={c}
                                onClick={() => setSelectedColor([c])}
                                className={`p-2 flex justify-center items-center shadow shadow-gray-400 rounded-box *:hover:cursor-pointer ${selectedColor.includes(c) ? "bg-black text-white" : ""}`}
                            >
                                {c}
                            </span>
                        ))
                    ) : (
                        <span className='px-4 h-10 font-bold flex justify-center items-center shadow shadow-gray-400 rounded-box text-gray-500'>
                            Select Color
                        </span>
                    )}
                </p>
            </div>

            {/* quantity */}
            <div>
                <p className='font-medium my-2'>Quantity</p>
                <div className='flex  my-2 gap-4  '>

                    <div className='flex items-center border gap-2  border-gray-300 dark:border-gray-600 '>
                        <button
                            onClick={handleDecrement}
                            className='btn dark:bg-gray-700 dark:border-gray-600 dark:text-white  btn-square'>-</button>
                        <p className='px-4 font-bold'>{quantity}</p>
                        <button
                            onClick={handleIncrement}
                            className='btn btn-square dark:bg-gray-700 dark:border-gray-600 dark:text-white'>+</button>
                    </div>

                </div>
            </div>

            <div className='flex gap-4 mt-6'>
                <Button action={() => handledTwoCartItem(products)} text={'Add to Cart'} />
                <Button text={'Buy Now'} action={handleBillingInfo} />
            </div>
           
        </div>
    )
}

export default CheckoutDetails
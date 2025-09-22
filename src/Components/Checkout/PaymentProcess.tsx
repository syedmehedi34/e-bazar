"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { useDeliveryDate } from '@/hook/useDeliveryDate/useDeliveryDate'
import Button from '../Button/Button'
import PaymentMethod from './PaymentMethod'
"@/"
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
}
interface PaymentProcessProps {
    onClose: () => void;
    products: ProductDetails
}

const PaymentProcess: React.FC<PaymentProcessProps> = ({ onClose, products }) => {
    const [isOpen, setIsOpen] = useState(false)
    const deliveryDate = useDeliveryDate(2)

    const handleClose = () => {
        
        setIsOpen(!isOpen);
        
    }
    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black/60 z-[100] flex flex-col justify-center items-center '>
            <div className='bg-white p-4 rounded-lg shadow-lg  lg:w-6/12 md:w-8/12  w-11/12 relative'>
                <button>
                    <span onClick={onClose} className='btn btn-sm btn-circle absolute top-1 right-2'><IoClose size={24} /></span>
                </button>
                <div>

                    <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                    <form>
                        <div className='grid sm:grid-cols-2 sm:gap-4'>
                            <div className='card-body p-0 mt-4'>
                                <label className='' htmlFor="">Enter your Name:</label>
                                <input type="text" className='input input-bordered w-full' />
                            </div>
                            <div className='card-body p-0 mt-4'>
                                <label className='' htmlFor="">Enter your Phone Number:</label>
                                <input type="number" className='input input-bordered w-full' />
                            </div>
                        </div>
                        <div className='grid sm:grid-cols-2 sm:gap-4'>
                            <div className='card-body p-0 mt-4'>
                                <label className='' htmlFor="">Enter your Address ():</label>
                                <input type="text" className='input input-bordered w-full' placeholder="123 Main St, City" />
                            </div>
                            <div className='card-body p-0 mt-4'>
                                <label className='' htmlFor="">Enter your Delivery Address:</label>
                                <input type="number" className='input input-bordered w-full' placeholder="Apartment, Street, City" />
                            </div>
                        </div>
                    </form>
                    {/* products table */}
                    <div className="p-4 shadow rounded-lg  bg-white my-4">


                        <div className="sm:flex items-start gap-4">
                            {/* Product Image */}
                            <Image
                                src={products.productImage}
                                width={80}
                                height={80}
                                alt={products.productName}
                                className="rounded-md border"
                            />

                            {/* Product Details */}
                            <div className="flex flex-col gap-1">
                                <p className="font-semibold text-lg">{products.productName}</p>
                                <p className="text-gray-600 text-sm">Quantity: {products.quantity}</p>
                                <p className="text-gray-600 text-sm">Delivery Charge: ৳ 100</p>
                                <p className="text-gray-800 font-bold">
                                    Total: ৳ {products.productPrice * products.quantity + 100}
                                </p>
                                <p>
                                    Estimated Delivery Date: <span className="font-semibold">{deliveryDate}</span>
                                </p>
                            </div>
                        </div>
                    </div>


                </div>
                <div className='flex justify-end mt-4'>
                    <Button text='Next' action={handleClose} />
                </div>
                
            </div>
        </div>


    )
}

export default PaymentProcess
"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import { useDeliveryDate } from '@/hook/useDeliveryDate/useDeliveryDate'
import { FaRegCreditCard } from "react-icons/fa";
import { MdOutlineLocalAtm } from "react-icons/md";
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import Button from '@/Components/Button/Button'
import { toast } from 'react-toastify'
import BackButton from '@/Components/Button/BackButton/BackButton'
import Payment from '@/Components/Payment/CardPayment/Payment'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from 'axios';
import { useRouter } from 'next/navigation';
const PaymentProcess = () => {
    const deliveryDate = useDeliveryDate(2)
    const products = useSelector((state: RootState) => state.orderSummary.orderDetails);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        note: '',
        address: '',
        deliveryAddress: '',
        paymentMethod: paymentMethod 
    });

    const [isOpen, setIsOpen] = useState(false)
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");
    const deliveryData = useDeliveryDate()
    const router = useRouter()
    const generateTransactionId = () => {
        const prefix = "pay-e-bazaar";
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${randomNumber}-${randomChars}`;
    }

    const handlePayment = async () => {
        if (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.deliveryAddress) {
            toast.error("Please fill all the fields", { position: "top-center" })
            return;
        }

        if (!paymentMethod) {
            toast.error("Please select a payment method", { position: "top-center" })
            return;
        }

        if (paymentMethod === 'card') {
            setIsOpen(!isOpen)
        }

        if (paymentMethod === 'cash') {

            const orderDetails = {
                customer: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    deliveryAddress: formData.deliveryAddress,
                    note: formData.note || "",
                },
                product: {
                    id: products?.productId,
                    name: products?.productName,
                    brand: products?.productBrand,
                    category: products?.productCategory,
                    sizes: Array.isArray(products?.productSizes) ? products?.productSizes : [products?.productSizes],
                    colors: Array.isArray(products?.productColors) ? products?.productColors : [products?.productColors],
                    quantity: products?.quantity,
                    totalPrice: products?.totalPrice,
                    currency: products?.productCurrency,
                    image: products?.productImage,
                    description: products?.productDescription,
                },
                payment: {
                    method: formData.paymentMethod || 'Cash On Delivery',
                    orderStatus: "pending",
                    paymentStatus: 'pending',
                    verifiedByAdmin: false,
                    transactionId: generateTransactionId(),
                    amount: products?.totalPrice,
                    currency: products?.productCurrency,
                },
                delivery: {
                    date: deliveryData,
                    status: "pending",
                    charge: 100,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const res = await axios.post('http://localhost:5000/order', { orderDetails })
            console.log(res)
            if (res.status === 200) {
                toast.success('Your Order Place Successfully!')
                router.push('/shopping')
            }


        }
    }


    return (
        <div className='min-h-screen bg-gray-200 py-8 rubik'>
            <div className='container-custom mx-auto'>
                <div className='mb-6'>
                    <BackButton />
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Billing Form */}
                    <div className='col-span-2 bg-white rounded-lg shadow p-6 relative'>
                        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                        <form className='grid grid-cols-1  lg:grid-cols-2 gap-4  '>
                            <div>
                                <label htmlFor="name" className='font-medium'>Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter Your Name.."
                                    className='input input-bordered w-full'

                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className='font-medium'>Phone Number</label>
                                <input
                                    type="text"
                                    id="phone"
                                    placeholder="+8801XXXXXXXXX"
                                    className='input input-bordered w-full'
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className='font-medium'>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="example@mail.com"
                                    className='input input-bordered w-full'
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="address" className='font-medium'>Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    placeholder="123 Main St, City"
                                    className='input input-bordered w-full'
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="deliveryAddress" className='font-medium'>Delivery Address</label>
                                <input
                                    type="text"
                                    id="deliveryAddress"
                                    placeholder="Apartment, Street, City"
                                    className='input input-bordered w-full'
                                    value={formData.deliveryAddress}
                                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="note" className='font-medium'>Note / Message</label>
                                <input
                                    type="text"
                                    id="note"
                                    placeholder="Any special instructions?"
                                    className='input input-bordered w-full'
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>
                        </form>
                        {/* payment metod */}
                        <div>
                            <h3 className="text-lg font-semibold mt-6 mb-4">
                                Select Payment Method
                            </h3>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {/* Card Payment */}
                                <label className="flex items-center gap-2 cursor-pointer  border border-gray-300 p-3 rounded-lg shadow-sm hover:shadow-md transition">
                                    <input
                                        onChange={() => setPaymentMethod("card")}
                                        type="radio"
                                        name="payment"
                                        className="radio"
                                    />
                                    <FaRegCreditCard className="text-blue-600 text-xl" />
                                    <span className="text-gray-700 font-medium">
                                        Credit / Debit Card
                                    </span>
                                </label>

                                {/* Cash Payment */}
                                <label className="flex items-center gap-2 cursor-pointer border border-gray-300 p-3 rounded-lg shadow-sm hover:shadow-md transition">
                                    <input
                                        onChange={() => setPaymentMethod("cash")}
                                        type="radio"
                                        name="payment"
                                        className="radio"
                                    />
                                    <MdOutlineLocalAtm className="text-green-600 text-xl" />
                                    <span className="text-gray-700 font-medium">
                                        Cash on Delivery
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className='mt-10'>
                            <Button text='Get Payment Proceess' action={handlePayment} />
                        </div>
                    </div>

                    {/* Product Summary */}
                    <div className="col-span-1 bg-white rounded-lg shadow p-6 ">
                        <h3 className="text-xl font-semibold ">Product Details</h3>
                        {
                            !products ? (<p>No product details available.</p>
                            ) : (
                                <div className='flex flex-col  sm:items-start gap-4'>
                                    <figure className='flex justify-center items-center w-full my-4'>
                                        <Image
                                            src={products.productImage}
                                            width={100}
                                            height={100}
                                            alt={products.productName}
                                            className='rounded-md border  flex justify-center items-center shadow'
                                        />
                                    </figure>
                                    <div className='flex flex-col gap-2'>
                                        <p className='font-semibold text-lg'>{products.productName}</p>
                                        <p className='text-gray-600'>Brand: {products.productBrand}</p>
                                        <p className='text-gray-600'>Category: {products.productCategory}</p>
                                        <p className='text-gray-600 '>Sizes: {products.productSizes}</p>
                                        <p className='text-gray-600'>Quantity: {products.quantity}</p>
                                        <p className='text-gray-600'>Delivery Charge: <strong>৳ 100</strong></p>
                                        <p className='text-gray-800 font-bold'>Total: ৳ {products.totalPrice}</p>
                                        <p>Estimated Delivery Date: <span className='font-semibold'>{deliveryDate}</span></p>
                                    </div>
                                </div>
                            )
                        }

                    </div>

                </div>

                {isOpen && products && formData &&
                    <Elements stripe={stripePromise}>
                        <Payment
                            onClose={() => setIsOpen(!isOpen)}
                            formData={formData}
                            products={products}
                        />
                    </Elements>
                }

            </div>
        </div>
    )
}

export default PaymentProcess

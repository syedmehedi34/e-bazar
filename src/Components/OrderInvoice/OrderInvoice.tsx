"use Client"
import React from 'react'
import Logo from '../Logo/Logo';
import { Order } from "@/lib/orders";
import Image from 'next/image';
import { LuPrinter } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

type OrderInvoiceProps = {
    order: Order
}
const OrderInvoice: React.FC<OrderInvoiceProps> = ({ order }) => {
    return (
        <div className='fixed inset-0 bg-black/70 flex justify-center items-center z-100'>
            <div className='bg-white md:w-[595px] w-full  md:h-[642px] h-full p-5 relative overflow-hidden'>
                <p className='absolute inset-0 flex justify-center items-center text-[8vw] font-bold italic  '>E-Bazaar</p>
                <div className='absolute inset-0 bg-white/90 p-5'>
                    <div className='flex justify-between gap-4 border-b-2 pb-2 border-dotted'>
                        <div className='flex-2'>
                            <h1 className='font-bold text-3xl  '>INVOICE</h1>
                            <div className='mt-4'>
                                <p>
                                    <strong>Biling Number:</strong>
                                    <span>{Math.floor(Math.random() * 10000)}</span>

                                </p>
                                <p>
                                    <strong>Date:</strong>
                                    <span>{new Date().toLocaleDateString()} </span>
                                </p>
                            </div>
                        </div>
                        <div className='flex-1'>
                            <aside className="flex flex-col items-start space-y-1">
                                <Logo logoColor={'black'} />
                                <p className="text-sm">
                                    E-Bazaar Industries Ltd.
                                    <br />
                                    Providing reliable tech since 2000
                                </p>
                                <p>
                                    Dhaka, Bangladesh
                                </p>
                            </aside>
                        </div>
                    </div>

                    <div className='border-b-2 pb-2 border-dotted'>
                        <h2 className="font-semibold text-lg dark:text-white">
                            Customer Information
                        </h2>
                        <table className="w-full text-left border-collapse border border-gray-300 dark:border-gray-700 mt-2 text-[12px]">
                            <tbody>
                                <tr className="border-b border-gray-300 dark:border-gray-700">
                                    <td className="py-1 px-3 font-medium dark:text-gray-300">
                                        Name
                                    </td>
                                    <td className="py-1 px-3 dark:text-gray-200">
                                        {order.customer.name}
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-300 dark:border-gray-700">
                                    <td className="py-1 px-3 font-medium dark:text-gray-300">
                                        Email
                                    </td>
                                    <td className="py-1 px-3 dark:text-gray-200">
                                        {order.customer.email}
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-300 dark:border-gray-700">
                                    <td className="py-1 px-3 font-medium dark:text-gray-300">
                                        Phone
                                    </td>
                                    <td className="py-2 px-3 dark:text-gray-200">
                                        {order.customer.phone || "N/A"}
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-300 dark:border-gray-700">
                                    <td className="py-1 px-3 font-medium dark:text-gray-300">
                                        Address
                                    </td>
                                    <td className="py-1 px-3 dark:text-gray-200">
                                        {order.customer.address || "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-1 px-3 font-medium dark:text-gray-300">
                                        Delivery Address
                                    </td>
                                    <td className="py-1 px-3 dark:text-gray-200">
                                        {order.customer.deliveryAddress || "N/A"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6">
                        <h2 className="font-semibold text-lg dark:text-white">
                            Products
                        </h2>
                        <table className="w-full text-left border-collapse border border-gray-300 dark:border-gray-700 mt-2 text-[14px]">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="py-2 px-3 border border-gray-300 dark:border-gray-700">Image</th>
                                    <th className="py-2 px-3 border border-gray-300 dark:border-gray-700">Title</th>
                                    <th className="py-2 px-3 border border-gray-300 dark:border-gray-700">Quantity</th>

                                    <th className="py-2 px-3 border border-gray-300 dark:border-gray-700">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-300 dark:border-gray-700">
                                    <td className="py-2 px-3">
                                        <Image
                                            width={100}
                                            height={100}
                                            src={order.product.image}
                                            alt={order.product.name}
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                    </td>
                                    <td className="py-1 px-3 dark:text-gray-200">{order.product.name}</td>
                                    <td className="py-1 px-3 dark:text-gray-200">{order.product.quantity || 1}</td>

                                    <td className="py-2 px-3 dark:text-gray-200">{order.product.totalPrice}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Total Price */}
                    <div className="mt-4 flex justify-end">
                        <div className="text-right dark:text-white">
                            <p className="font-semibold text-sm">Total Price: {order.product.totalPrice} {order.product.currency || "BDT"}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-start">
                        <div className="text-center">
                            <p className="dark:text-gray-300">Signature</p>
                            <p className="font-semibold dark:text-white">
                                Md Shamiul Islam
                            </p>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default OrderInvoice
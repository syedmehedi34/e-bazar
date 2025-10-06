"use client"
import React, { useRef } from 'react'
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { MdPrint } from "react-icons/md";
import BackButton from '@/Components/Button/BackButton/BackButton';
import { useReactToPrint } from "react-to-print";

const OrderInvoice = () => {
    const searchParams = useSearchParams();
    const orderData = searchParams.get("order");
    const order = orderData ? JSON.parse(decodeURIComponent(orderData)) : null;
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <div className='container-custom my-10'>
            <BackButton />
            <div ref={contentRef} className='flex justify-center items-center '>

                <div className='bg-white dark:bg-gray-800 dark:text-white md:w-[595px] w-full  md:h-[642px] h-full p-5 relative overflow-hidden border-2 border-dotted mb-10'>
                    <div>
                        <p className='absolute inset-0 flex justify-center dark:text-white items-center text-[8vw] font-bold italic  '>E-Bazaar</p>
                        <div className='absolute inset-0 bg-white/90 dark:bg-gray-800/90 p-5'>
                            <div className='flex justify-between gap-4 border-b-2 pb-2 border-dotted'>
                                <div className='flex-2'>
                                    <h1 className='font-bold text-3xl  '>INVOICE</h1>
                                    <div className='mt-4'>
                                        <p>
                                            <strong>Biling Number:</strong>
                                            <span className='text-sm font-light'> {Math.floor(Math.random() * 10000)}</span>

                                        </p>
                                        <p>
                                            <strong>Date:</strong>
                                            <span className='text-sm font-light'> {new Date().toLocaleDateString()} </span>
                                        </p>
                                    </div>
                                </div>
                                <div className='flex-1'>
                                    <aside className="flex flex-col items-start space-y-1">

                                        <p className="text-sm ">
                                            E-Bazaar Industries Ltd.
                                            <br />
                                            Providing reliable tech since 2000
                                        </p>
                                        <p className='text-sm'>
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

            </div>
            <div className='flex justify-end'>
                <button onClick={reactToPrintFn} className='btn btn-sm' title='Print'><MdPrint size={20} /></button>
            </div>
        </div>
    )
}

export default OrderInvoice
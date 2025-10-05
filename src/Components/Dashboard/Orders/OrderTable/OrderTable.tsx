"use client"
import Image from 'next/image';
import React from 'react'
interface IOrder {
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
        deliveryAddress: string;
        note?: string;
    };
    product: {
        id: string,
        name: string;
        quantity: number;
        image?: string;

    };
    payment: {
        method: string;
        paymentStatus: string;
        amount: number;

    };
    delivery: {
        date: string;

    };

}

type OrderProps = {
    orders: IOrder[];
    handleStatusChange: (orderId: string, status: string) => void
}
const OrderTable: React.FC<OrderProps> = ({ orders, handleStatusChange }) => {
    console.log(orders)
    return (
        <div>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow">
                <h1 className='p-4 font-bold rubik text-sm'>
                    Latest Order
                </h1>
                <table className="table  w-full">
                    {/* head */}
                    <thead className=" text-sm">
                        <tr>
                            <th className='dark:text-white'>Image</th>
                            <th className='dark:text-white'>Title</th>
                            <th className='dark:text-white'>Customer Name</th>
                            <th className='dark:text-white'>Customer Email</th>
                            <th className='dark:text-white'>Quantity</th>
                            <th className='dark:text-white'>Payment Method</th>
                            <th className='dark:text-white'>Payment Status</th>
                            <th className='dark:text-white'>Total Amount</th>
                            <th className='dark:text-white'>Delivery Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.length > 0 ? (
                            orders?.map((order, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td>
                                        {order.product.image ? (
                                            <Image
                                                width={100}
                                                height={100}
                                                src={order.product.image}
                                                alt={order.product.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-gray-400">No Image</span>
                                        )}
                                    </td>
                                    <td className="font-semibold">{order.product.name}</td>
                                    <td>{order?.customer?.name}</td>
                                    <td>{order?.customer?.email}</td>
                                    <td>{order?.product?.quantity}</td>
                                    <td>{order?.payment?.method}</td>
                                    <td

                                    >
                                        <select

                                            onChange={(e) => handleStatusChange(order.product.id!, e.target.value)}
                                            className={`bg-transparent border-none font-bold `}
                                        >
                                            <option value={order.payment.paymentStatus ?? 'pending'}>
                                                {order.payment.paymentStatus?.charAt(0).toUpperCase() + order.payment.paymentStatus.slice(1)}
                                            </option>
                                            {["pending", "paid", "failed", "refunded"]
                                                .filter(status => status !== order.payment.paymentStatus?.toLowerCase())
                                                .map(status => (
                                                    <option key={status} value={status}
                                                    >
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </td>

                                    <td>
                                        ৳ {order?.payment.amount}
                                    </td>
                                    <td>{new Date(order?.delivery.date).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center py-6 text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderTable
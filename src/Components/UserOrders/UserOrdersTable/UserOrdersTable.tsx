"use client";

import React from "react";
import { FaTrashAlt, FaFileInvoice } from "react-icons/fa";

interface Order {
    _id: string;
    customer: {
        name: string;
        email: string;
    };
    product: {
        name: string;
        quantity: number;
        totalPrice: number;
        currency: string;
        image: string;
    };
    payment: {
        method: string;
        paymentStatus: string;
        orderStatus: string;
    };
    delivery: {
        date: string;
        status: string;
    };
    createdAt: string;
}

interface UserOrdersTableProps {
    orders: Order[];
    // onDelete: (id: string) => void;
    // onInvoice: (id: string) => void;
}

const UserOrdersTable: React.FC<UserOrdersTableProps> = ({
    orders,
    // onDelete,
    // onInvoice,
}) => {
    return (
        <div className="overflow-x-auto   p-4 transition-colors duration-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                My Orders
            </h2>

            <table className="table  w-full shadow dark:bg-gray-800">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Delivery</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {orders?.length > 0 ? (
                        orders.map((order, index) => (
                            <tr
                                key={order._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <td className="text-gray-800 dark:text-gray-100">{index + 1}</td>

                                {/* ✅ Product Image + Name */}
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img
                                                    src={order.product.image}
                                                    alt={order.product.name}
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800 dark:text-gray-100">
                                                {order.product.name}
                                            </div>
                                            <div className="text-sm opacity-70">
                                                Qty: {order.product.quantity}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* ✅ Payment Info */}
                                <td className="text-gray-800 dark:text-gray-100">
                                    <div className="flex flex-col">
                                        <span className="capitalize">{order.payment.method}</span>
                                        <span
                                            className={`badge mt-1 ${order.payment.paymentStatus === "paid"
                                                ? "badge-success text-white"
                                                : "badge-warning"
                                                }`}
                                        >
                                            {order.payment.paymentStatus}
                                        </span>
                                    </div>
                                </td>

                                {/* ✅ Order Status */}
                                <td>
                                    <span
                                        className={`badge ${order.payment.orderStatus === "canceled"
                                            ? "badge-error"
                                            : order.payment.paymentStatus === "paid"
                                                ? new Date(order.delivery.date) <= new Date()
                                                    ? "badge-success text-white"
                                                    : "badge-warning"
                                                : "badge-warning"
                                            }`}
                                    >
                                        {order.payment.orderStatus === "canceled"
                                            ? "Canceled"
                                            : order.payment.paymentStatus === "paid"
                                                ? new Date(order.delivery.date) <= new Date()
                                                    ? "Delivered"
                                                    : "Pending"
                                                : order.payment.paymentStatus}
                                    </span>
                                </td>


                                {/* ✅ Delivery Status */}
                                <td>
                                    <span
                                        className={`badge ${order.payment.orderStatus === "canceled"
                                                ? "badge-error text-white"
                                                : order.payment.paymentStatus === "paid"
                                                    ? new Date(order.delivery.date) <= new Date()
                                                        ? "badge-success text-white"
                                                        : "badge-warning "
                                                    : "badge-info text-white"
                                            }`}
                                    >
                                        {order.payment.orderStatus === "canceled"
                                            ? "Canceled"
                                            : order.payment.paymentStatus === "paid"
                                                ? new Date(order.delivery.date) <= new Date()
                                                    ? "Delivered"
                                                    : "Pending"
                                                : order.payment.paymentStatus}
                                    </span>
                                </td>


                                {/* ✅ Total */}
                                <td className="text-gray-800 dark:text-gray-100">
                                    {order.product.totalPrice} {order.product.currency}
                                </td>

                                {/* ✅ Date */}
                                <td className="text-gray-800 dark:text-gray-100">
                                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                                </td>

                                {/* ✅ Actions */}
                                <td className="flex items-center gap-2">
                                    <button
                                        // onClick={() => onInvoice(order._id)}
                                        className="btn btn-sm btn-info text-white flex items-center gap-1"
                                    >
                                        <FaFileInvoice />
                                        Invoice
                                    </button>
                                    <button
                                        // onClick={() => onDelete(order._id)}
                                        className="btn btn-sm btn-error text-white flex items-center gap-1"
                                    >
                                        <FaTrashAlt />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={8}
                                className="text-center py-6 text-gray-600 dark:text-gray-300"
                            >
                                No orders found 😔
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserOrdersTable;

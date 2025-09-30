"use client"
import React from 'react'
import OrderTable from '../OrderTable/OrderTable';
import { toast } from 'react-toastify';
import axios from 'axios';
import Swal from 'sweetalert2';

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
        id:string,
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



type OrderContainerProps = {
    orders: IOrder[]
    getOrders: () => void;
}


const OrderContainer: React.FC<OrderContainerProps> = ({ orders, getOrders }) => {

    const handleStatusChange = async (orderId: string, status: string) => {
        try {
            console.log(orderId,status )
            const res = await axios.patch(
                `http://localhost:5000/admin/orders/payment-status`,
                {  status, orderId }
            );

            console.log("responsive",res)

            if (res?.data) {
                toast.success("Payment status updated successfully!");
                getOrders();
            }
        } catch (error) {
            toast.error("Failed to update payment status");
            console.error(error);
        }
    };

    return (
        <div>
            <OrderTable orders={orders} handleStatusChange={handleStatusChange} />
        </div>
    )
}

export default OrderContainer
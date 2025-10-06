"use client"

import OrderTable from '../OrderTable/OrderTable';
import { toast } from 'react-toastify';
import axios from 'axios';
import OrderFilter from '../OrderFilter/OrderFilter';

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
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setSort: React.Dispatch<React.SetStateAction<string>>;
}


const OrderContainer: React.FC<OrderContainerProps> = ({ orders, getOrders ,setSearch,setSort}) => {

    const handleStatusChange = async (orderId: string, status: string) => {
        try {
          
            const res = await axios.patch(
                `http://localhost:5000/admin/orders/payment-status`,
                {  status, orderId }
            );

          

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
            <OrderFilter setSearch={setSearch} setSort={setSort}/>
            <OrderTable orders={orders} handleStatusChange={handleStatusChange} />
        </div>
    )
}

export default OrderContainer
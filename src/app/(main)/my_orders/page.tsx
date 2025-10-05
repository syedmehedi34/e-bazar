"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import Loader from "../loading";
import { PiExport } from "react-icons/pi";
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import OrderCard from "@/Components/UserOrders/OrderCard/OrderCard";
import UserOrdersTable from "@/Components/UserOrders/UserOrdersTable/UserOrdersTable";
import Pagination from "@/Components/Pagination/Pagination";
interface Summary {
    totalOrders: number;
    totalPaid: number;
    totalPending: number;
    totalCanceled: number;
}
const MyOrdersPage = () => {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageArry, setPageArray] = useState([])
    const [summary, setSummary] = useState<Summary>({
        totalOrders: 0,
        totalPaid: 0,
        totalPending: 0,
        totalCanceled: 0,
    });

    const getOrder = useCallback(async () => {
        if (!session?.user?.email) return;
        try {
            setLoading(true);
            const res = await axios.get(
                `http://localhost:5000/user-orders?email=${session.user.email}&page=${currentPage}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            }
            );
            console.log(res)
            setOrders(res?.data?.orders || []);
            setSummary(res?.data?.summary);
            setPageArray(res?.data?.pageArray)
        } catch (error) {
            console.error("Order fetch failed:", error);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.email, currentPage]);

    useEffect(() => {
        if (status === "authenticated") {
            getOrder();
        }
    }, [status, getOrder]);

    // loading & auth status handling
    if (status === "loading" || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <p className="text-center text-red-500 py-10 min-h-screen flex justify-center items-center">
                Please login to view your orders.
            </p>
        );
    }

    return (
        <div className="min-h-screen p-6 dark:text-white">

            <div className="container-custom">
                <nav className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold mb-2 dark:text-white">Your Orders</h1>
                        <p className="flex items-center gap-2 font-medium p-2 bg-gray-100 rounded-box text-sm 
                        dark:text-white dark:bg-gray-700
                        "> <CiCalendarDate /> {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 font-medium p-2 bg-gray-100  rounded-box text-sm dark:text-white dark:bg-gray-700"> <PiExport /> Export</button>
                        <button className="flex items-center gap-2 font-medium p-2 bg-gray-100 rounded-box text-sm dark:text-white dark:bg-gray-700">More Action <MdOutlineKeyboardArrowDown /> </button>
                        <button className="flex items-center gap-2 font-medium p-2  rounded-box text-sm bg-gray-900  text-white dark:text-white dark:bg-gray-700">Create Order</button>
                    </div>
                </nav>

                {orders.length === 0 ? (
                    <p className="text-gray-500 flex justify-center items-center min-h-screen">No orders found.</p>
                ) : (
                    <div className="flex flex-col gap-10" >
                        <OrderCard orderSummary={summary} />
                        <UserOrdersTable orders={orders} />

                        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageArray={pageArry}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;

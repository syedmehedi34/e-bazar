"use client";

import LatestOrder from "@/Components/Dashboard/LatestOrderList/LatestOrder";
import ProductsChart from "@/Components/Dashboard/ProductsChart/ProductsChart";
import { DashboardCardData, GetSalesAnalytics, LatestOrderList } from "@/lib/dashboardCardData/dashboardCardData";
import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaDollarSign, FaUsers, FaBox } from "react-icons/fa";
import { MdArrowDropUp } from "react-icons/md";

interface DashboardData {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}

interface ProductAnalytics {
  name: string;
  price: number;
  rating: number;
  date: string;
}

const Page: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [products, setProducts] = useState<ProductAnalytics[]>([]);
  const [latestOrder, setLatestOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const [dashboardData, productsData, latestOrder] = await Promise.all([
          DashboardCardData(),
          GetSalesAnalytics(),
          LatestOrderList()
        ]);

        setData(dashboardData);
        setProducts(productsData);
        setLatestOrder(latestOrder)
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-center text-red-500">Failed to load data</p>
      </div>
    );
  }

  const { totalSales, totalOrders, totalUsers, totalProducts } = data;
  

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 rubik">
        {/* Total Sales */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 shadow rounded-lg">
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded">
                <FaDollarSign className="text-3xl text-green-500" />
              </div>
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-300">Total Sales</h3>
                <p className="text-2xl font-bold">${totalSales}</p>
              </div>
            </div>
            <div className="flex mt-4 justify-between items-center text-sm">
              <p></p>
              <p className="flex items-center font-bold text-green-400">
                10% <MdArrowDropUp />
              </p>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 shadow rounded-lg">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded">
              <FaShoppingCart className="text-3xl text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm text-gray-600 dark:text-gray-300">Total Orders</h3>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
          </div>
          <div className="flex mt-4 justify-between items-center text-sm">
            <p></p>
            <p className="flex items-center font-bold text-green-400">
              15% <MdArrowDropUp />
            </p>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 shadow rounded-lg">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded">
              <FaUsers className="text-3xl text-purple-500" />
            </div>
            <div>
              <h3 className="text-sm text-gray-600 dark:text-gray-300">Active Users</h3>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>
          <div className="flex mt-4 justify-between items-center text-sm">
            <p></p>
            <p className="flex items-center font-bold text-green-400">
              10% <MdArrowDropUp />
            </p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 shadow rounded-lg">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-orange-100 rounded">
              <FaBox className="text-3xl text-orange-500" />
            </div>
            <div>
              <h3 className="text-sm text-gray-600 dark:text-gray-300">Total Products</h3>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </div>
          <div className="flex mt-4 justify-between items-center text-sm">
            <p></p>
            <p className="flex items-center font-bold text-green-400">
              70% <MdArrowDropUp />
            </p>
          </div>
        </div>
      </div>

      <div>
        <ProductsChart productsChartData={products} />
        <LatestOrder orderList={latestOrder}/>
      </div>
    </div>
  );
};

export default Page;

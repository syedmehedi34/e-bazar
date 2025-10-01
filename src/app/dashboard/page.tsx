"use client";

import LatestOrder from "@/Components/Dashboard/LatestOrderList/LatestOrder";
import ProductsChart from "@/Components/Dashboard/ProductsChart/ProductsChart";
import ProductsUpdate from "@/Components/Dashboard/ProductsTablea/ProductsUpdate";
import {
  DashboardCardData,
  GetSalesAnalytics,
  LatestOrderList,
} from "@/lib/dashboardCardData/dashboardCardData";
import { TrendingUp } from "lucide-react";
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
    totalPrice: number;
    amount?: number;
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
          LatestOrderList(),
        ]);

        setData(dashboardData);
        setProducts(productsData);
        setLatestOrder(latestOrder);
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

  // Card data as array
  const cards = [
    {
      title: "Total Sales",
      value: `৳ ${totalSales}`,
      icon: <FaDollarSign className="text-3xl text-green-500" />,
      bg: "bg-green-100",
      text: "text-green-400",
      growth: "10%",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <FaShoppingCart className="text-3xl text-blue-500" />,
      bg: "bg-blue-100",
      text: "text-green-400",
      growth: "15%",
    },
    {
      title: "Active Users",
      value: totalUsers,
      icon: <FaUsers className="text-3xl text-purple-500" />,
      bg: "bg-purple-100",
      text: "text-green-400",
      growth: "10%",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: <FaBox className="text-3xl text-orange-500" />,
      bg: "bg-orange-100",
      text: "text-green-400",
      growth: "70%",
    },
  ];

  

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 rubik">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 dark:text-white p-4 shadow rounded-lg"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-center gap-4">
                <div className={`p-2 ${card.bg} rounded`}>{card.icon}</div>
                <div>
                  <h3 className="text-sm text-gray-600 dark:text-gray-300">
                    {card.title}
                  </h3>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              </div>
              <div className="flex mt-4 justify-between items-center text-sm">
                <p></p>
                <p className={`flex items-center font-bold gap-4 ${card.text}`}>
                  {card.growth} <TrendingUp />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <ProductsChart productsChartData={products} />
        <LatestOrder orderList={latestOrder} />
      </div>
    </div>
  );
};

export default Page;

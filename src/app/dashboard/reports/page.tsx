"use client";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FaDollarSign, FaUsers, FaBox, FaShoppingCart } from "react-icons/fa";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import RevenuneChart from "../../../Components/Dashboard/Reports/RevenuneChart/RevenuneChart";
import TopSellingProducts from "@/Components/Dashboard/Reports/TopSellingProducts/TopSellingProducts";

interface RevenueData {
  _id: { day: number; month: number; year: number };
  dailyRevenue: number;
}

interface ITopSellingProduct{
  _id: string;
    title: string;
    image: string;
    category: string;
    totalQuantity: number;
    totalSales: number;
}

interface Report {
  totalRevenue: number;
  TotalPaidOrder: number;
  TotalSalesReport: number;
  TotalPendingOrder: number;
  totalOrders: number;
  revenueData: RevenueData[];
  topSellingProducts: ITopSellingProduct[]
}

const ReportPage: React.FC = () => {
  const [report, setReport] = useState<Report>({
    totalRevenue: 0,
    TotalPaidOrder: 0,
    TotalSalesReport: 0,
    TotalPendingOrder: 0,
    totalOrders: 0,
    revenueData: [],
    topSellingProducts:[]
  });

  const getReport = useCallback(async () => {
    try {
      const res = await axios.get("https://e-bazaar-server-three.vercel.app/admin/report",{withCredentials:true});
      if (res.status === 200) {
        setReport(res.data);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  }, []);

  useEffect(() => {
    getReport();
  }, [getReport]);

  const cards = [
    {
      title: "Total Revenue",
      value: `৳ ${report.totalRevenue}`,
      icon: <FaDollarSign className="text-3xl text-green-500" />,
      bg: "bg-green-100",
      growth: 10, // dynamic growth percentage
    },
    {
      title: "Total Orders",
      value: report.totalOrders,
      icon: <FaShoppingCart className="text-3xl text-blue-500" />,
      bg: "bg-blue-100",
      growth: 5,
    },
    {
      title: "Total Paid Order",
      value: report.TotalPaidOrder,
      icon: <FaUsers className="text-3xl text-purple-500" />,
      bg: "bg-purple-100",
      growth: -2, // negative growth example
    },
    {
      title: "Total Pending Order",
      value: report.TotalPendingOrder,
      icon: <FaUsers className="text-3xl text-purple-500" />,
      bg: "bg-purple-100",
      growth: -2, // negative growth example
    },
    {
      title: "Total Sales",
      value:`৳ ${report.TotalSalesReport}`,
      icon: <FaBox className="text-3xl text-orange-500" />,
      bg: "bg-orange-100",
      growth: 7,
    },
  ];

  return (
    <div className="">
     

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 dark:text-white p-4 shadow rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded ${card.bg}`}>{card.icon}</div>
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-300">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
            <div className="flex mt-4 justify-between items-center text-sm">
              <p className="text-gray-400 rubik ">in the last month</p>
              <p
                className={`flex items-center font-bold ${
                  card.growth >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {Math.abs(card.growth)}%
                {card.growth >= 0 ? <MdArrowDropUp /> : <MdArrowDropDown />}
              </p>
            </div>
          </div>
        ))}
      </div>
        <div>
          <RevenuneChart revenueData={report?.revenueData} />
          <TopSellingProducts topSellingProduct={report?.topSellingProducts}/>
        </div>
    </div>
  );
};

export default ReportPage;

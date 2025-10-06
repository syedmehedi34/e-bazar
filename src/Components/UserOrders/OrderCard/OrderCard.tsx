import React from "react";
import { FaShoppingCart, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { IoCash } from "react-icons/io5";

interface Summary {
  totalOrders: number;
  totalPaid: number;
  totalPending: number;
  totalAmount: number;
}

type orderSummaryProps = {
  orderSummary: Summary;
};

const OrderCard: React.FC<orderSummaryProps> = ({ orderSummary }) => {
  const cards = [
    {
      title: "Total Orders",
      value: orderSummary.totalOrders,
      icon: <FaShoppingCart className="text-3xl text-blue-500" />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Paid Orders",
      value: orderSummary.totalPaid,
      icon: <FaCheckCircle className="text-3xl text-green-500" />,
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Pending Orders",
      value: orderSummary.totalPending,
      icon: <FaHourglassHalf className="text-3xl text-yellow-500" />,
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      title: "Total Amount",
      value: `৳ ${orderSummary.totalAmount}`,
      icon: <IoCash className="text-3xl text-red-500" />,
      bg: "bg-red-100 dark:bg-red-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`card shadow-md ${card.bg} border border-gray-200 dark:border-gray-700 transition hover:shadow-xl`}
        >
          <div className="card-body flex flex-col items-center justify-center text-center p-2">
            <div className="mb-3">{card.icon}</div>
            <h2 className="card-title text-gray-800 dark:text-gray-100 text-lg">{card.title}</h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderCard;

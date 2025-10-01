"use client"
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Bar,
} from "recharts";

interface RevenueData {
    _id: { day: number; month: number; year: number };
    dailyRevenue: number;
}

type RevenueDataProps = {
    revenueData: RevenueData[];
};

const RevenueChart: React.FC<RevenueDataProps> = ({ revenueData }) => {

    const chartData = revenueData.map((item) => ({
        date: `${item._id.day}/${item._id.month}/${item._id.year}`,
        revenue: item.dailyRevenue,
    }));

    return (
        <div className="p-5 bg-white my-5 rounded-lg dark:bg-gray-800 dark:text-white">
            <h2 className="text-lg font-bold mb-4">Revenue Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                  
                    <YAxis
                        scale="log"
                        domain={['auto', 'auto']}
                        label={{
                            value: "revenue ($)",
                            angle: -90,
                            position: "insideLeft",
                            style: { textAnchor: "middle", fontSize: 14, fontWeight: "bold" },
                        }}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={3} />
                    
                 
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueChart;

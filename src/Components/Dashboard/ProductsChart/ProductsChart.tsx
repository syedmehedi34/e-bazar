"use client";

import React from "react";
import {
    ComposedChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Area,
    Bar,
    Line,
    CartesianGrid,
} from "recharts";

interface ProductAnalytics {
    name: string;
    price: number;
    rating?: number;
    date: string;
}

type ProductsChartProps = {
    productsChartData: ProductAnalytics[];
};

const ComposedResponsiveContainer: React.FC<ProductsChartProps> = ({
    productsChartData,
}) => {
    return (
        <div className="w-full h-[450px] px-4 py-10 bg-white dark:bg-gray-800 dark:text-white shadow rounded-lg ">
            <h2 className="text-xl font-bold mb-4">Products Sales Chart</h2>

            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={productsChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#f5f5f5"  />

                    {/* X Axis */}
                    <XAxis
                        dataKey="rating"
                        tick={{ fontSize: 12 }}
                        label={{
                            value: "Rating",
                            position: "insideBottom",
                            offset: -5,
                            style: { fontSize: 14, fontWeight: "bold" },
                        }}
                        angle={-20}
                        textAnchor="end"
                    />

                    {/* Y Axis */}
                 <YAxis
    scale="log"
    domain={['auto', 'auto']}
    label={{
        value: "Price ($)",
        angle: -90,
        position: "insideLeft",
        style: { textAnchor: "middle", fontSize: 14, fontWeight: "bold" },
    }}
    tick={{ fontSize: 12 }}
/>


                    {/* Tooltip */}
                    <Tooltip
                        formatter={(value: number) => [`$${value}`, "Price"]}
                        labelFormatter={(label) => `Product: ${label}`}
                    />

                    <Legend verticalAlign="top" height={36} />

                    {/* Area Chart */}
                    <Area
                        type="monotone"
                        dataKey="price"
                        fill="rgba(74, 222, 128, 0.3)"
                        stroke="#4ade80"
                        strokeWidth={2}
                    />

                    {/* Bar Chart */}
                    <Bar
                        dataKey="price"
                        barSize={30}
                        fill="#60a5fa"
                    />

                    {/* Line Chart */}
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ComposedResponsiveContainer;

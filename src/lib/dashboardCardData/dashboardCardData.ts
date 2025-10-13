import axios from "axios";

const baseURL = "https://e-bazaar-server-three.vercel.app";

export const DashboardCardData = async () => {
  try {
    const res = await axios.get(`${baseURL}/admin/dashboard/card`, {
      withCredentials: true,
    });

    const { totalSales, totalUsers, totalProducts, totalOrders } = res.data;

    return {
      totalSales,
      totalUsers,
      totalProducts,
      totalOrders,
    };
  } catch (error) {
    console.error("DashboardCardData Error:", error);
    throw error;
  }
};

export const GetSalesAnalytics = async () => {
  try {
    const res = await axios.get(`${baseURL}/admin/sales/analytics`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error("GetSalesAnalytics Error:", error);
    throw error;
  }
};

export const LatestOrderList = async () => {
  try {
    const res = await axios.get(`${baseURL}/admin/latest/order`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error("LatestOrderList Error:", error);
    throw error;
  }
};

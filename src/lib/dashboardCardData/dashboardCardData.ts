export const DashboardCardData = async () => {
  const res = await fetch('https://e-bazaar-server-three.vercel.app/admin/dashboard/card', {
    cache: 'no-store',
    credentials: 'include',
  })

  const data = await res.json()

  const { totalSales, totalUsers, totalProducts, totalOrders } = data

  return {
    totalSales,
    totalUsers,
    totalProducts,
    totalOrders
  }
}

export const GetSalesAnalytics = async () => {
  const res = await fetch('https://e-bazaar-server-three.vercel.app/admin/sales/analytics', {
    cache: 'no-store',
    credentials: 'include'
  })

  const data = await res.json()
  return data
  

 
}
export const LatestOrderList = async () => {
  const res = await fetch('https://e-bazaar-server-three.vercel.app/admin/latest/order', {
    cache: 'no-store',
    credentials: 'include',
  })

  const data = await res.json()
  return data
  

 
}

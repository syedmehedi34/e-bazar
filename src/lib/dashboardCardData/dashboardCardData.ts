export const DashboardCardData = async () => {
  const res = await fetch('http://localhost:5000/admin/dashboard/card', {
    cache: 'no-store'
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
  const res = await fetch('http://localhost:5000/admin/sales/analytics', {
    cache: 'no-store'
  })

  const data = await res.json()
  return data
  

 
}
export const LatestOrderList = async () => {
  const res = await fetch('http://localhost:5000/admin/latest/order', {
    cache: 'no-store'
  })

  const data = await res.json()
  return data
  

 
}

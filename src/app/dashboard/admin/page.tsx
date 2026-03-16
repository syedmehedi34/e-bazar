"use client";

import { useMemo } from "react";
import { useFetchOrders } from "@/hook/useFetchOrders";
import { useFetchProduct } from "@/hook/useFetchProduct";
import { useFetchBlog } from "@/hook/useFetchBlog";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  FileText,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Truck,
  Ban,
  MessageSquare,
  AlertTriangle,
  Wallet,
  DollarSign,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  subtotal: number;
  unitPrice: number;
}
interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  pricing: {
    total: number;
    subtotal: number;
    shippingCharge: number;
    couponDiscount: number;
  };
  items: OrderItem[];
}
interface Product {
  _id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  discountPrice: number;
  costPrice: number;
  stock: number;
  totalSold: number;
  status: string;
  averageRating: number;
  images: string[];
}
interface Blog {
  _id: string;
  title: string;
  category: string;
  comments: unknown[];
  createdAt: string;
}

// ── Colors ─────────────────────────────────────────────────────────
const C = {
  teal: "#14b8a6",
  blue: "#3b82f6",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  emerald: "#10b981",
  red: "#ef4444",
  orange: "#f97316",
};
const PIE_COLORS = [C.teal, C.blue, C.violet, C.amber, C.emerald, C.red];

// ── Helpers ────────────────────────────────────────────────────────
const fmt = (n: number) => `৳${n.toLocaleString("en-BD")}`;
const fmtK = (n: number) =>
  n >= 1_000_000
    ? `৳${(n / 1_000_000).toFixed(1)}M`
    : n >= 1000
      ? `৳${(n / 1000).toFixed(1)}k`
      : fmt(n);

const last6Months = () => {
  const out: { key: string; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("en-US", { month: "short", year: "2-digit" }),
    });
  }
  return out;
};

const monthKey = (d: string) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
};
const isThisMonth = (d: string) => {
  const dt = new Date(d);
  const n = new Date();
  return dt.getMonth() === n.getMonth() && dt.getFullYear() === n.getFullYear();
};
const isLastMonth = (d: string) => {
  const dt = new Date(d);
  const n = new Date();
  const lm = n.getMonth() === 0 ? 11 : n.getMonth() - 1;
  const ly = n.getMonth() === 0 ? n.getFullYear() - 1 : n.getFullYear();
  return dt.getMonth() === lm && dt.getFullYear() === ly;
};
const pctGrowth = (curr: number, prev: number) =>
  prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

// ── Sub-components ─────────────────────────────────────────────────
const GrowthBadge = ({ pct }: { pct: number }) => (
  <span
    className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${pct >= 0 ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-500/10 text-red-500"}`}
  >
    {pct >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
    {Math.abs(pct)}%
  </span>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-4">
    {children}
  </h2>
);

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 ${className}`}
  >
    {children}
  </div>
);

const ChartTooltip = ({
  active,
  payload,
  label,
  currency = false,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
  currency?: boolean;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-[11px] font-semibold text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-bold" style={{ color: p.color }}>
          {p.name}: {currency ? fmtK(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { orders, ordersLoading } = useFetchOrders() as {
    orders: Order[];
    ordersLoading: boolean;
  };
  const { products, productsLoading } = useFetchProduct() as {
    products: Product[];
    productsLoading: boolean;
  };
  const { blogs, blogsLoading } = useFetchBlog() as unknown as {
    blogs: Blog[];
    blogsLoading: boolean;
  };

  const loading = ordersLoading || productsLoading || blogsLoading;

  // ── Product cost lookup map ────────────────────────────────────
  const costMap = useMemo(() => {
    const m: Record<string, number> = {};
    products.forEach((p) => {
      m[p._id] = p.costPrice ?? 0;
    });
    return m;
  }, [products]);

  // ── Revenue stats ──────────────────────────────────────────────
  // ── Revenue: count only when paid OR delivered (same rule as profit) ──
  const isConfirmedOrder = (o: Order) =>
    o.paymentStatus === "paid" || o.orderStatus === "delivered";

  const revenue = useMemo(() => {
    const confirmed = orders.filter(isConfirmedOrder);
    const total = confirmed.reduce((s, o) => s + o.pricing.total, 0);
    const thisM = confirmed
      .filter((o) => isThisMonth(o.createdAt))
      .reduce((s, o) => s + o.pricing.total, 0);
    const lastM = confirmed
      .filter((o) => isLastMonth(o.createdAt))
      .reduce((s, o) => s + o.pricing.total, 0);
    return { total, thisM, lastM, growth: pctGrowth(thisM, lastM) };
  }, [orders]);

  // ── Profit calculation ─────────────────────────────────────────
  // Per item: (unitPrice - costPrice) × quantity
  // costPrice comes from products model via costMap
  const profitStats = useMemo(() => {
    let totalProfit = 0;
    let thisMProfit = 0;
    let lastMProfit = 0;

    orders.forEach((o) => {
      // Same rule: paid OR delivered
      if (!isConfirmedOrder(o)) return;
      let orderProfit = 0;
      o.items.forEach((item) => {
        const cost = costMap[item.productId] ?? 0;
        const margin = (item.unitPrice - cost) * item.quantity;
        orderProfit += margin;
      });
      totalProfit += orderProfit;
      if (isThisMonth(o.createdAt)) thisMProfit += orderProfit;
      if (isLastMonth(o.createdAt)) lastMProfit += orderProfit;
    });

    const margin =
      revenue.total > 0 ? Math.round((totalProfit / revenue.total) * 100) : 0;
    return {
      total: totalProfit,
      thisM: thisMProfit,
      lastM: lastMProfit,
      growth: pctGrowth(thisMProfit, lastMProfit),
      margin,
    };
  }, [orders, costMap, revenue.total]);

  // ── Order stats ────────────────────────────────────────────────
  const orderStats = useMemo(() => {
    const thisM = orders.filter((o) => isThisMonth(o.createdAt)).length;
    const lastM = orders.filter((o) => isLastMonth(o.createdAt)).length;

    // Pending payments: stripe/sslcommerz orders that are still pending
    const gatewayPending = orders.filter(
      (o) =>
        o.paymentMethod !== "cod" &&
        o.paymentStatus === "pending" &&
        o.orderStatus !== "cancelled",
    );
    const gatewayPendingAmount = gatewayPending.reduce(
      (s, o) => s + o.pricing.total,
      0,
    );

    // COD pending
    const codPending = orders.filter(
      (o) => o.paymentStatus === "cod_pending" && o.orderStatus !== "cancelled",
    );
    const codPendingAmount = codPending.reduce(
      (s, o) => s + o.pricing.total,
      0,
    );

    return {
      total: orders.length,
      thisM,
      lastM,
      growth: pctGrowth(thisM, lastM),
      processing: orders.filter((o) => o.orderStatus === "processing").length,
      confirmed: orders.filter((o) => o.orderStatus === "confirmed").length,
      shipped: orders.filter((o) => o.orderStatus === "shipped").length,
      delivered: orders.filter((o) => o.orderStatus === "delivered").length,
      cancelled: orders.filter((o) => o.orderStatus === "cancelled").length,
      codPendingAmount,
      codPendingCount: codPending.length,
      gatewayPendingAmount,
      gatewayPendingCount: gatewayPending.length,
    };
  }, [orders]);

  // ── Product stats ──────────────────────────────────────────────
  const productStats = useMemo(() => {
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const catBreakdown = [...new Set(products.map((p) => p.category))].map(
      (cat) => ({
        name: cat,
        value: products.filter((p) => p.category === cat).length,
      }),
    );

    // ── Top selling: calculated from actual orders data (by total quantity sold) ──
    const soldMap: Record<
      string,
      {
        productId: string;
        title: string;
        brand: string;
        qty: number;
        unitPrice: number;
      }
    > = {};
    orders.forEach((o) => {
      if (o.orderStatus === "cancelled") return; // skip cancelled
      o.items.forEach((item) => {
        if (!soldMap[item.productId]) {
          soldMap[item.productId] = {
            productId: item.productId,
            title: item.title,
            brand: "",
            qty: 0,
            unitPrice: item.unitPrice,
          };
        }
        soldMap[item.productId].qty += item.quantity;
      });
    });

    // Enrich with product data (costPrice, discountPrice, images)
    const topSelling = Object.values(soldMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)
      .map((item) => {
        const product = products.find((p) => p._id === item.productId);
        return {
          _id: item.productId,
          title: item.title,
          brand: product?.brand ?? "",
          totalSold: item.qty,
          discountPrice: item.unitPrice,
          costPrice: product?.costPrice ?? 0,
          images: product?.images ?? [],
        };
      });

    return {
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      lowStock,
      outOfStock,
      topSelling,
      catBreakdown,
    };
  }, [products, orders]);

  // ── Blog stats ─────────────────────────────────────────────────
  const blogStats = useMemo(() => {
    const totalComments = blogs.reduce(
      (s, b) => s + (b.comments?.length ?? 0),
      0,
    );
    const mostCommented = [...blogs].sort(
      (a, b) => (b.comments?.length ?? 0) - (a.comments?.length ?? 0),
    )[0];
    return {
      total: blogs.length,
      totalComments,
      mostCommented,
      thisM: blogs.filter((b) => isThisMonth(b.createdAt)).length,
    };
  }, [blogs]);

  // ── Monthly chart data ─────────────────────────────────────────
  const monthlyData = useMemo(
    () =>
      last6Months().map(({ key, label }) => {
        const mo = orders.filter((o) => monthKey(o.createdAt) === key);
        let profit = 0;
        mo.forEach((o) => {
          if (!isConfirmedOrder(o)) return; // same rule: paid OR delivered
          o.items.forEach((item) => {
            profit +=
              (item.unitPrice - (costMap[item.productId] ?? 0)) * item.quantity;
          });
        });
        return {
          label,
          revenue: mo
            .filter(isConfirmedOrder)
            .reduce((s, o) => s + o.pricing.total, 0),
          orders: mo.length,
          profit,
        };
      }),
    [orders, costMap],
  );

  // ── Order status pie ───────────────────────────────────────────
  const statusPie = [
    { name: "Processing", value: orderStats.processing, color: C.amber },
    { name: "Confirmed", value: orderStats.confirmed, color: C.blue },
    { name: "Shipped", value: orderStats.shipped, color: C.violet },
    { name: "Delivered", value: orderStats.delivered, color: C.emerald },
    { name: "Cancelled", value: orderStats.cancelled, color: C.red },
  ].filter((d) => d.value > 0);

  // ── Payment method pie ─────────────────────────────────────────
  const paymentPie = useMemo(
    () =>
      [
        {
          name: "COD",
          value: orders.filter((o) => o.paymentMethod === "cod").length,
          color: C.teal,
        },
        {
          name: "SSLCommerz",
          value: orders.filter((o) => o.paymentMethod === "sslcommerz").length,
          color: C.blue,
        },
        {
          name: "Stripe",
          value: orders.filter((o) => o.paymentMethod === "stripe").length,
          color: C.violet,
        },
      ].filter((d) => d.value > 0),
    [orders],
  );

  // ── Loading skeleton ───────────────────────────────────────────
  if (loading)
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-64 rounded-2xl bg-gray-100 dark:bg-gray-800" />
          <div className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500 mb-1">
          Admin
        </p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString("en-BD", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div>
        <SectionTitle>Overview</SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Revenue",
              value: fmtK(revenue.total),
              sub: `${fmtK(revenue.thisM)} this month`,
              growth: revenue.growth,
              icon: TrendingUp,
              color: "text-teal-600 dark:text-teal-400",
              bg: "bg-teal-50 dark:bg-teal-500/10",
            },
            {
              label: "Total Orders",
              value: orderStats.total,
              sub: `${orderStats.thisM} this month`,
              growth: orderStats.growth,
              icon: ShoppingBag,
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-500/10",
            },
            {
              label: "Net Profit",
              value: fmtK(profitStats.total),
              sub: `${fmtK(profitStats.thisM)} this month`,
              growth: profitStats.growth,
              icon: DollarSign,
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-50 dark:bg-emerald-500/10",
            },
            {
              label: "Products",
              value: productStats.total,
              sub: `${productStats.active} active`,
              icon: Package,
              color: "text-violet-600 dark:text-violet-400",
              bg: "bg-violet-50 dark:bg-violet-500/10",
            },
          ].map(({ label, value, sub, growth: g, icon: Icon, color, bg }) => (
            <Card key={label} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {label}
                </p>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}
                >
                  <Icon size={15} className={color} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-xs text-gray-400">{sub}</p>
                {g !== undefined && <GrowthBadge pct={g} />}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Profit section ── */}
      <div>
        <SectionTitle>Profit Analysis</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profit + Revenue area chart */}
          <Card className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Revenue vs Profit
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Last 6 months (non-cancelled orders)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />{" "}
                  Revenue
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />{" "}
                  Profit
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart
                data={monthlyData}
                margin={{ top: 5, right: 5, bottom: 0, left: -10 }}
              >
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.teal} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={C.teal} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={C.emerald}
                      stopOpacity={0.15}
                    />
                    <stop offset="95%" stopColor={C.emerald} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-gray-100 dark:text-gray-800"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => fmtK(v)}
                />
                <Tooltip content={<ChartTooltip currency />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke={C.teal}
                  strokeWidth={2}
                  fill="url(#revGrad)"
                  dot={{ r: 3, fill: C.teal, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke={C.emerald}
                  strokeWidth={2}
                  fill="url(#profGrad)"
                  dot={{ r: 3, fill: C.emerald, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Profit summary cards */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign size={15} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Total Profit
                  </p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {fmtK(profitStats.total)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Profit Margin
                </span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {profitStats.margin}%
                </span>
              </div>
            </Card>

            {/* Pending payments — Stripe + SSLCommerz */}
            {orderStats.gatewayPendingCount > 0 && (
              <Card className="p-5 border-orange-200 dark:border-orange-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-orange-500" />
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                    Gateway Pending
                  </p>
                </div>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {fmtK(orderStats.gatewayPendingAmount)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {orderStats.gatewayPendingCount} orders — Stripe / SSLCommerz
                </p>
                <p className="text-[10px] text-orange-400 mt-1.5">
                  Payment initiated but not confirmed
                </p>
              </Card>
            )}

            {/* COD pending */}
            {orderStats.codPendingCount > 0 && (
              <Card className="p-5 border-amber-200 dark:border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet size={14} className="text-amber-500" />
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    COD Pending
                  </p>
                </div>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {fmtK(orderStats.codPendingAmount)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {orderStats.codPendingCount} orders — Cash on Delivery
                </p>
                <p className="text-[10px] text-amber-400 mt-1.5">
                  Awaiting delivery & collection
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ── Revenue & Order charts ── */}
      <div>
        <SectionTitle>Revenue & Orders</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Monthly orders bar */}
          <Card className="lg:col-span-2 p-5">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Monthly Orders
            </p>
            <p className="text-xs text-gray-400 mb-5">
              Order volume last 6 months
            </p>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart
                data={monthlyData}
                margin={{ top: 0, right: 5, bottom: 0, left: -20 }}
                barSize={26}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-gray-100 dark:text-gray-800"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="orders"
                  name="Orders"
                  fill={C.blue}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Order status donut */}
          <Card className="p-5">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Order Status
            </p>
            <p className="text-xs text-gray-400 mb-3">All time breakdown</p>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={statusPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={65}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {statusPie.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {statusPie.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="text-xs text-gray-500">{s.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Payment breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            Payment Methods
          </p>
          <p className="text-xs text-gray-400 mb-3">Order distribution</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={paymentPie}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={58}
                dataKey="value"
                strokeWidth={0}
              >
                {paymentPie.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {paymentPie.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: p.color }}
                  />
                  <span className="text-xs text-gray-500">{p.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {p.value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top selling */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Top Selling Products
              </p>
              <p className="text-xs text-gray-400 mt-0.5">By units sold</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-500/10">
              <Star size={12} className="text-violet-500" />
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                {fmtK(profitStats.total)} profit
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {productStats.topSelling.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No sales data yet
              </p>
            ) : (
              productStats.topSelling.map((p, i) => {
                const maxSold = productStats.topSelling[0]?.totalSold || 1;
                const pct = Math.round((p.totalSold / maxSold) * 100);
                // profit = (actual order unitPrice - costPrice from products model) × qty sold from orders
                const itemProfit =
                  (p.discountPrice - (p.costPrice ?? 0)) * p.totalSold;
                return (
                  <div key={p._id} className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-black w-5 shrink-0 ${i === 0 ? "text-teal-500" : "text-gray-300 dark:text-gray-600"}`}
                    >
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-gray-800 dark:text-white truncate pr-2">
                          {p.title}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-emerald-500 font-semibold">
                            {fmtK(itemProfit)}
                          </span>
                          <span className="text-xs font-bold text-gray-500">
                            {p.totalSold} sold
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: PIE_COLORS[i % PIE_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* ── Stock + Category ── */}
      <div>
        <SectionTitle>Product Insights</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Stock alerts */}
          <Card className="p-5">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Stock Alerts
            </p>
            <p className="text-xs text-gray-400 mb-4">Needs attention</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-center">
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {productStats.lowStock.length}
                </p>
                <p className="text-[10px] font-semibold text-amber-500 mt-0.5 uppercase tracking-wider">
                  Low Stock
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-center">
                <p className="text-xl font-bold text-red-500">
                  {productStats.outOfStock}
                </p>
                <p className="text-[10px] font-semibold text-red-400 mt-0.5 uppercase tracking-wider">
                  Out of Stock
                </p>
              </div>
            </div>
            {productStats.lowStock.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Critical
                </p>
                {productStats.lowStock.slice(0, 4).map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate pr-2">
                      {p.title}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${p.stock <= 2 ? "bg-red-100 dark:bg-red-500/10 text-red-500" : "bg-amber-100 dark:bg-amber-500/10 text-amber-600"}`}
                    >
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Category breakdown */}
          <Card className="p-5">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Products by Category
            </p>
            <p className="text-xs text-gray-400 mb-4">Distribution</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={productStats.catBreakdown}
                layout="vertical"
                margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
                barSize={10}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" name="Products" radius={[0, 4, 4, 0]}>
                  {productStats.catBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent orders */}
          <Card className="p-5">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Recent Orders
            </p>
            <p className="text-xs text-gray-400 mb-4">Latest 6</p>
            <div className="space-y-2">
              {orders.slice(0, 6).map((o) => {
                const sc: Record<string, string> = {
                  processing: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
                  confirmed: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
                  shipped: "text-violet-500 bg-violet-50 dark:bg-violet-500/10",
                  delivered:
                    "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
                  cancelled: "text-red-500 bg-red-50 dark:bg-red-500/10",
                };
                const SI: Record<string, React.ElementType> = {
                  processing: Clock,
                  confirmed: CheckCircle2,
                  shipped: Truck,
                  delivered: CheckCircle2,
                  cancelled: Ban,
                };
                const Icon = SI[o.orderStatus] ?? Clock;
                return (
                  <div
                    key={o._id}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${sc[o.orderStatus] ?? ""}`}
                    >
                      <Icon size={11} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 dark:text-white font-mono">
                        {o.orderId}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {o.items[0]?.title}
                        {o.items.length > 1 ? ` +${o.items.length - 1}` : ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        {fmtK(o.pricing.total)}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(o.createdAt).toLocaleDateString("en-BD", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {orders.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No orders yet
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Blog stats ── */}
      <div>
        <SectionTitle>Blog Insights</SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Posts",
              value: blogStats.total,
              color: "text-amber-600 dark:text-amber-400",
              bg: "bg-amber-50 dark:bg-amber-500/10",
              icon: FileText,
            },
            {
              label: "Total Comments",
              value: blogStats.totalComments,
              color: "text-violet-600 dark:text-violet-400",
              bg: "bg-violet-50 dark:bg-violet-500/10",
              icon: MessageSquare,
            },
            {
              label: "Published Month",
              value: blogStats.thisM,
              color: "text-teal-600 dark:text-teal-400",
              bg: "bg-teal-50 dark:bg-teal-500/10",
              icon: TrendingUp,
            },
            {
              label: "Categories",
              value: new Set(blogs.map((b) => b.category)).size,
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-500/10",
              icon: Package,
            },
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <Card key={label} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {label}
                </p>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${bg}`}
                >
                  <Icon size={14} className={color} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </Card>
          ))}
        </div>
        {blogStats.mostCommented && (
          <Card className="mt-4 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
              <Star size={16} className="text-amber-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
                Most Commented Blog
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {blogStats.mostCommented.title}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10">
              <MessageSquare size={12} className="text-amber-500" />
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {blogStats.mostCommented.comments?.length ?? 0}
              </span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

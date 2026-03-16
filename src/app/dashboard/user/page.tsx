"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFetchOrders } from "@/hook/useFetchOrders";
import useUser from "@/hook/useUser";
import {
  ShoppingBag,
  Heart,
  Clock,
  CheckCircle2,
  Truck,
  Ban,
  Package,
  ChevronRight,
  User,
  MapPin,
  Phone,
  CreditCard,
  TrendingUp,
  Star,
  AlertCircle,
} from "lucide-react";

interface OrderItem {
  title: string;
  image: string;
  quantity: number;
  unitPrice: number;
}
interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  pricing: { total: number };
  items: OrderItem[];
}

// ── Helpers ────────────────────────────────────────────────────────
const fmtK = (n: number) =>
  n >= 1000 ? `৳${(n / 1000).toFixed(1)}k` : `৳${n.toLocaleString("en-BD")}`;

const STATUS_CFG: Record<
  string,
  { label: string; cls: string; icon: React.ElementType }
> = {
  processing: {
    label: "Processing",
    icon: Clock,
    cls: "text-amber-500  bg-amber-50  dark:bg-amber-500/10",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    cls: "text-blue-500   bg-blue-50   dark:bg-blue-500/10",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    cls: "text-violet-500 bg-violet-50 dark:bg-violet-500/10",
  },
  delivered: {
    label: "Delivered",
    icon: Package,
    cls: "text-teal-500   bg-teal-50   dark:bg-teal-500/10",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    cls: "text-red-500    bg-red-50    dark:bg-red-500/10",
  },
};

const PAYMENT_CFG: Record<string, { label: string; cls: string }> = {
  cod_pending: {
    label: "COD Pending",
    cls: "text-amber-600  bg-amber-50  dark:bg-amber-500/10",
  },
  pending: {
    label: "Pending",
    cls: "text-gray-500   bg-gray-100  dark:bg-gray-800",
  },
  paid: {
    label: "Paid",
    cls: "text-teal-600   bg-teal-50   dark:bg-teal-500/10",
  },
  failed: {
    label: "Failed",
    cls: "text-red-500    bg-red-50    dark:bg-red-500/10",
  },
};

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

const Badge = ({ cfg }: { cfg: { label: string; cls: string } }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.cls}`}
  >
    {cfg.label}
  </span>
);

// ── Main Page ──────────────────────────────────────────────────────
const UserDashboardHome = () => {
  const { user, isLoading: userLoading } = useUser();
  const { orders, ordersLoading } = useFetchOrders() as {
    orders: Order[];
    ordersLoading: boolean;
  };

  const loading = userLoading || ordersLoading;

  // ── Stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalSpent = orders
      .filter(
        (o) => o.paymentStatus === "paid" || o.orderStatus === "delivered",
      )
      .reduce((s, o) => s + o.pricing.total, 0);
    const active = orders.filter((o) =>
      ["processing", "confirmed", "shipped"].includes(o.orderStatus),
    ).length;
    const delivered = orders.filter(
      (o) => o.orderStatus === "delivered",
    ).length;
    const cancelled = orders.filter(
      (o) => o.orderStatus === "cancelled",
    ).length;
    const wishlistCount = user?.wishList?.length ?? 0;
    return {
      totalSpent,
      active,
      delivered,
      cancelled,
      wishlistCount,
      totalOrders: orders.length,
    };
  }, [orders, user]);

  // ── Order status breakdown ─────────────────────────────────────
  const statusBreakdown = useMemo(
    () =>
      [
        {
          label: "Processing",
          count: orders.filter((o) => o.orderStatus === "processing").length,
          icon: Clock,
          cls: "text-amber-500  bg-amber-50  dark:bg-amber-500/10",
        },
        {
          label: "Confirmed",
          count: orders.filter((o) => o.orderStatus === "confirmed").length,
          icon: CheckCircle2,
          cls: "text-blue-500   bg-blue-50   dark:bg-blue-500/10",
        },
        {
          label: "Shipped",
          count: orders.filter((o) => o.orderStatus === "shipped").length,
          icon: Truck,
          cls: "text-violet-500 bg-violet-50 dark:bg-violet-500/10",
        },
        {
          label: "Delivered",
          count: orders.filter((o) => o.orderStatus === "delivered").length,
          icon: Package,
          cls: "text-teal-500   bg-teal-50   dark:bg-teal-500/10",
        },
      ].filter((s) => s.count > 0),
    [orders],
  );

  // ── Recent orders ──────────────────────────────────────────────
  const recentOrders = orders.slice(0, 4);

  // ── Loading skeleton ───────────────────────────────────────────
  if (loading)
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-28 rounded-2xl bg-gray-100 dark:bg-gray-800" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-gray-100 dark:bg-gray-800"
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
    <div className="p-6 space-y-6">
      {/* ── Welcome banner ── */}
      <Card className="p-5 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-teal-500/20 shrink-0">
              <Image
                src={
                  user?.photo ||
                  "https://img.icons8.com/?size=100&id=21441&format=png&color=000000"
                }
                alt={user?.name ?? "User"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-500 mb-0.5">
                Welcome back
              </p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.name ?? "User"}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            </div>
          </div>
          <Link
            href="/dashboard/user/profile"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-teal-400 hover:text-teal-600 transition-all shrink-0"
          >
            <User size={12} /> Edit Profile
          </Link>
        </div>

        {/* Quick info row */}
        {(user?.mobileNumber || user?.fullAddress) && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex-wrap">
            {user.mobileNumber && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Phone size={11} className="text-teal-500" />
                {user.mobileNumber}
              </span>
            )}
            {user.fullAddress && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin size={11} className="text-teal-500" />
                {user.fullAddress}
              </span>
            )}
          </div>
        )}
      </Card>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-500/10",
            href: "/dashboard/user/orders",
          },
          {
            label: "Total Spent",
            value: fmtK(stats.totalSpent),
            icon: CreditCard,
            color: "text-teal-600 dark:text-teal-400",
            bg: "bg-teal-50 dark:bg-teal-500/10",
            href: "/dashboard/user/orders",
          },
          {
            label: "Active Orders",
            value: stats.active,
            icon: TrendingUp,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-500/10",
            href: "/dashboard/user/orders",
          },
          {
            label: "Wishlist",
            value: stats.wishlistCount,
            icon: Heart,
            color: "text-red-500 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-500/10",
            href: "/dashboard/user/wishlist",
          },
        ].map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href}>
            <Card className="p-5 hover:border-teal-200 dark:hover:border-teal-500/30 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {label}
                </p>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg} group-hover:scale-110 transition-transform`}
                >
                  <Icon size={15} className={color} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* ── Recent Orders + Order Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Recent Orders
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Your latest {recentOrders.length} orders
              </p>
            </div>
            <Link
              href="/dashboard/user/orders"
              className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              View all <ChevronRight size={12} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <ShoppingBag
                size={36}
                className="text-gray-200 dark:text-gray-700"
              />
              <p className="text-sm font-medium text-gray-400">No orders yet</p>
              <Link
                href="/shopping"
                className="text-xs font-bold text-teal-500 hover:underline"
              >
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentOrders.map((o) => {
                const sc = STATUS_CFG[o.orderStatus] ?? STATUS_CFG.processing;
                const pc = PAYMENT_CFG[o.paymentStatus] ?? PAYMENT_CFG.pending;
                const Icon = sc.icon;
                return (
                  <div
                    key={o._id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {/* Product image */}
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-700">
                      {o.items[0]?.image ? (
                        <Image
                          src={o.items[0].image}
                          fill
                          alt=""
                          className="object-cover"
                        />
                      ) : (
                        <Package
                          size={14}
                          className="absolute inset-0 m-auto text-gray-400"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-bold text-gray-900 dark:text-white font-mono">
                          {o.orderId}
                        </p>
                        <Badge cfg={{ label: sc.label, cls: sc.cls }} />
                      </div>
                      <p className="text-[10px] text-gray-400 truncate">
                        {o.items[0]?.title}
                        {o.items.length > 1
                          ? ` +${o.items.length - 1} more`
                          : ""}
                      </p>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        {fmtK(o.pricing.total)}
                      </p>
                      <Badge cfg={pc} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Order status breakdown + quick links */}
        <div className="space-y-4">
          {/* Status breakdown */}
          <Card className="p-5">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Order Status
            </p>
            <p className="text-xs text-gray-400 mb-4">Current breakdown</p>
            {statusBreakdown.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No active orders
              </p>
            ) : (
              <div className="space-y-2.5">
                {statusBreakdown.map(({ label, count, icon: Icon, cls }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${cls}`}
                      >
                        <Icon size={12} />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {label}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-800 dark:text-white">
                      {count}
                    </span>
                  </div>
                ))}
                {stats.cancelled > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-500/10">
                        <Ban size={12} />
                      </div>
                      <span className="text-xs font-medium text-gray-400">
                        Cancelled
                      </span>
                    </div>
                    <span className="text-xs font-bold text-red-500">
                      {stats.cancelled}
                    </span>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Quick links */}
          <Card className="p-5">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              Quick Links
            </p>
            <div className="space-y-1.5">
              {[
                {
                  label: "My Orders",
                  href: "/dashboard/user/orders",
                  icon: ShoppingBag,
                  color: "text-blue-500",
                },
                {
                  label: "Wishlist",
                  href: "/dashboard/user/wishlist",
                  icon: Heart,
                  color: "text-red-400",
                },
                {
                  label: "My Profile",
                  href: "/dashboard/user/profile",
                  icon: User,
                  color: "text-teal-500",
                },
                {
                  label: "Returns",
                  href: "/dashboard/user/returns",
                  icon: Star,
                  color: "text-amber-500",
                },
                {
                  label: "Support",
                  href: "/dashboard/user/support",
                  icon: AlertCircle,
                  color: "text-violet-500",
                },
              ].map(({ label, href, icon: Icon, color }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} className={color} />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {label}
                    </span>
                  </div>
                  <ChevronRight
                    size={12}
                    className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 transition-colors"
                  />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Wishlist teaser — shown if has wishlist items ── */}
      {stats.wishlistCount > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Heart size={14} className="text-red-400 fill-red-400" />
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Wishlist
              </p>
            </div>
            <Link
              href="/dashboard/user/wishlist"
              className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              View all ({stats.wishlistCount}) <ChevronRight size={12} />
            </Link>
          </div>
          <p className="text-xs text-gray-400">
            You have {stats.wishlistCount} item
            {stats.wishlistCount !== 1 ? "s" : ""} saved
          </p>
        </Card>
      )}
    </div>
  );
};

export default UserDashboardHome;

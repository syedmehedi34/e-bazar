"use client";
import useUser from "@/hook/useUser";
import React, { useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShoppingBag,
  CheckCircle,
  Clock,
  ChevronRight,
  Camera,
  Edit3,
  Package,
  TrendingUp,
  Calendar,
  Shield,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────
type TabType = "overview" | "edit" | "security";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

// ── Stat Card ──────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, accent }: StatCardProps) => (
  <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div
      className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 ${accent}`}
    />
    <div
      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${accent} bg-opacity-15 mb-3`}
    >
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
      {label}
    </p>
    {sub && (
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
    )}
  </div>
);

// ── Info Row ──────────────────────────────────────────
const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className="flex items-center gap-4 py-3.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate mt-0.5">
        {value || (
          <span className="text-gray-400 dark:text-gray-500 font-normal italic">
            Not provided
          </span>
        )}
      </p>
    </div>
    <ChevronRight
      size={14}
      className="text-gray-300 dark:text-gray-600 shrink-0"
    />
  </div>
);

// ── Dummy order data ──────────────────────────────────
const recentOrders = [
  {
    id: "#ORD-8821",
    item: "Wireless Headphones",
    date: "Mar 8, 2026",
    status: "Delivered",
    amount: "৳2,450",
  },
  {
    id: "#ORD-8756",
    item: "Running Shoes (Size 42)",
    date: "Mar 5, 2026",
    status: "Processing",
    amount: "৳3,200",
  },
  {
    id: "#ORD-8701",
    item: "Smart Watch Series 3",
    date: "Feb 28, 2026",
    status: "Pending",
    amount: "৳8,900",
  },
  {
    id: "#ORD-8644",
    item: "Leather Wallet",
    date: "Feb 20, 2026",
    status: "Delivered",
    amount: "৳950",
  },
];

const statusStyle: Record<string, string> = {
  Delivered:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Processing:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

// ── Edit Form Field ───────────────────────────────────
interface EditFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  defaultValue?: string;
  icon: React.ReactNode;
}

const EditField = ({
  label,
  type = "text",
  placeholder,
  defaultValue,
  icon,
}: EditFieldProps) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition placeholder-gray-400"
      />
    </div>
  </div>
);

// ── Avatar Component ──────────────────────────────────
interface AvatarProps {
  photo?: string;
  name?: string;
  size?: number;
}

const Avatar = ({ photo, name, size = 96 }: AvatarProps) => {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name ?? "User avatar"}
        width={size}
        height={size}
        className="w-full h-full object-cover rounded-2xl"
        priority
      />
    );
  }
  return (
    <span className="text-3xl font-bold text-white">
      {name?.charAt(0)?.toUpperCase() ?? "U"}
    </span>
  );
};

// ── Main Component ────────────────────────────────────
const Profile = () => {
  const { user, isLoading, error } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-red-400">
          Failed to load profile. Please try again.
        </p>
      </div>
    );
  }

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <User size={15} /> },
    { key: "edit", label: "Edit Profile", icon: <Edit3 size={15} /> },
    { key: "security", label: "Security", icon: <Shield size={15} /> },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* ── Header Card ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-xl">
              <Avatar photo={user?.photo} name={user?.name} size={96} />
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-md hover:scale-110 transition-transform">
              <Camera size={13} className="text-teal-700" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-bold text-white truncate">
                {user?.name ?? "User"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white capitalize border border-white/20">
                {user?.role ?? "user"}
              </span>
            </div>
            <p className="text-teal-200 text-sm truncate">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-teal-200">
                <Calendar size={12} />
                <span>
                  Joined{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Recently"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex sm:flex-col gap-4 sm:gap-2 text-right">
            <div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-xs text-teal-300">Total Orders</p>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block self-center" />
            <div>
              <p className="text-2xl font-bold text-white">৳24.5k</p>
              <p className="text-xs text-teal-300">Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <User size={15} className="text-teal-500" /> Contact Info
              </h3>
              <InfoRow
                icon={<Mail size={15} />}
                label="Email"
                value={user?.email ?? ""}
              />
              <InfoRow
                icon={<Phone size={15} />}
                label="Phone"
                value={user?.mobileNumber ?? ""}
              />
              <InfoRow
                icon={<MapPin size={15} />}
                label="Address"
                value={user?.fullAddress ?? ""}
              />
            </div>

            <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <TrendingUp size={15} className="text-teal-500" /> Order Stats
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <StatCard
                  icon={<ShoppingBag size={16} className="text-blue-600" />}
                  label="Total Orders"
                  value={12}
                  sub="All time"
                  accent="bg-blue-500"
                />
                <StatCard
                  icon={<CheckCircle size={16} className="text-emerald-600" />}
                  label="Completed"
                  value={9}
                  sub="75% success rate"
                  accent="bg-emerald-500"
                />
                <StatCard
                  icon={<Clock size={16} className="text-amber-600" />}
                  label="Pending"
                  value={2}
                  sub="In progress"
                  accent="bg-amber-500"
                />
                <StatCard
                  icon={<Package size={16} className="text-purple-600" />}
                  label="Processing"
                  value={1}
                  sub="Being prepared"
                  accent="bg-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm h-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ShoppingBag size={15} className="text-teal-500" /> Recent
                  Orders
                </h3>
                <button className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                      <Package
                        size={16}
                        className="text-teal-600 dark:text-teal-400"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {order.item}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {order.id} · {order.date}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[order.status]}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {order.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Profile Tab ── */}
      {activeTab === "edit" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Edit3 size={15} className="text-teal-500" /> Personal Information
            </h3>
            <EditField
              label="Full Name"
              placeholder="Your full name"
              defaultValue={user?.name}
              icon={<User size={15} />}
            />
            <EditField
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              defaultValue={user?.email}
              icon={<Mail size={15} />}
            />
            <EditField
              label="Phone Number"
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              defaultValue={user?.mobileNumber}
              icon={<Phone size={15} />}
            />
            <EditField
              label="Full Address"
              placeholder="Your address"
              defaultValue={user?.fullAddress}
              icon={<MapPin size={15} />}
            />
            <button className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shadow-sm">
              Save Changes
            </button>
          </div>

          {/* Photo Upload */}
          <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm flex flex-col items-center justify-center gap-5">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-white/20 border-2 border-dashed border-teal-300 dark:border-teal-700 flex items-center justify-center shadow-md">
              {user?.photo ? (
                <Image
                  src={user.photo}
                  alt={user.name ?? "Profile photo"}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-4xl font-bold text-teal-400">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </span>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Update Profile Photo
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG or GIF · Max 2MB
              </p>
            </div>
            <button className="px-5 py-2 rounded-xl border border-teal-500 text-teal-600 dark:text-teal-400 text-sm font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors">
              Choose Photo
            </button>
          </div>
        </div>
      )}

      {/* ── Security Tab ── */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Lock size={15} className="text-teal-500" /> Change Password
            </h3>
            <EditField
              label="Current Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={15} />}
            />
            <EditField
              label="New Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={15} />}
            />
            <EditField
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={15} />}
            />
            <button className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shadow-sm">
              Update Password
            </button>
          </div>

          <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Shield size={15} className="text-teal-500" /> Account Security
            </h3>
            {[
              {
                label: "Two-Factor Authentication",
                sub: "Add an extra layer of security",
                active: false,
              },
              {
                label: "Login Notifications",
                sub: "Get notified on new logins",
                active: true,
              },
              {
                label: "Active Sessions",
                sub: "Manage your active devices",
                active: null,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                </div>
                {item.active !== null ? (
                  <div
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.active ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.active ? "translate-x-5" : "translate-x-0.5"}`}
                    />
                  </div>
                ) : (
                  <button className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                    Manage
                  </button>
                )}
              </div>
            ))}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <button className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-800/50 text-red-500 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

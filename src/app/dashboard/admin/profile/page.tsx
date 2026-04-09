"use client";
import useUser from "@/hook/useUser";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  Edit3,
  Camera,
  Calendar,
  ChevronRight,
  Loader2,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Settings,
} from "lucide-react";

type TabType = "overview" | "edit" | "security";

// ── Shared styles ───────────────────────────────────────────────────
const inp = `w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
  bg-white dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 text-sm
  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30
  focus:border-teal-500 transition-all`;

const lbl =
  "block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

// ── Info Row ────────────────────────────────────────────────────────
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => (
  <div className="flex items-center gap-4 py-3.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">
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

// ── Field Component ─────────────────────────────────────────────────
const Field = ({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly,
}: {
  label: string;
  icon: React.ReactNode;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) => (
  <div>
    <label className={lbl}>{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`${inp} ${readOnly ? "opacity-60 cursor-not-allowed" : ""}`}
      />
    </div>
  </div>
);

// ── Password Field ──────────────────────────────────────────────────
const PwField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className={lbl}>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock size={15} />
        </span>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "••••••••"}
          className={`${inp} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────────────
const AdminProfilePage = () => {
  const { user, isLoading, error } = useUser();
  const [tab, setTab] = useState<TabType>("overview");

  // Edit form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  // Password form
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  // Photo upload
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Populate edit form when tab opens
  const handleTabChange = (t: TabType) => {
    if (t === "edit" && user) {
      setName(user.name ?? "");
      setPhone(user.mobileNumber ?? "");
      setAddress(user.fullAddress ?? "");
    }
    setTab(t);
  };

  // ── Save profile ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!user?._id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobileNumber: phone,
          fullAddress: address,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!newPw || !curPw) {
      toast.error("All fields are required.");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPw.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setChangingPw(true);
    try {
      const res = await fetch(`/api/users/${user?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: curPw, newPassword: newPw }),
      });
      if (!res.ok) throw new Error();
      toast.success("Password changed successfully!");
      setCurPw("");
      setNewPw("");
      setConfirmPw("");
    } catch {
      toast.error("Failed to change password. Check your current password.");
    } finally {
      setChangingPw(false);
    }
  };

  // ── Photo upload ───────────────────────────────────────────────
  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      await fetch(`/api/users/${user?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: url }),
      });
      toast.success("Photo updated!");
      window.location.reload();
    } catch {
      toast.error("Photo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ── Loading / Error ────────────────────────────────────────────
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading profile…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-red-400">
          Failed to load profile. Please try again.
        </p>
      </div>
    );

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <User size={15} /> },
    { key: "edit", label: "Edit Profile", icon: <Edit3 size={15} /> },
    { key: "security", label: "Security", icon: <Shield size={15} /> },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* ── Header banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 p-6 md:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-xl">
              {user?.photo ? (
                <Image
                  src={user.photo}
                  alt={user.name ?? "Admin"}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
                </span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-md hover:scale-110 transition-transform disabled:opacity-70"
            >
              {uploading ? (
                <Loader2 size={12} className="text-teal-700 animate-spin" />
              ) : (
                <Camera size={13} className="text-teal-700" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handlePhotoUpload(f);
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-bold text-white truncate">
                {user?.name ?? "Admin"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/20 capitalize">
                {user?.role ?? "admin"}
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

          {/* Admin badge */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 border border-white/20 backdrop-blur-sm">
            <Shield size={16} className="text-teal-200" />
            <div>
              <p className="text-xs text-teal-200 font-semibold uppercase tracking-wider">
                Admin Access
              </p>
              <p className="text-[10px] text-teal-300">Full permissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${tab === t.key ? "bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Contact info + Account info */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <User size={14} className="text-teal-500" /> Contact Info
              </h3>
              <InfoRow
                icon={<Mail size={14} />}
                label="Email"
                value={user?.email}
              />
              <InfoRow
                icon={<Phone size={14} />}
                label="Phone"
                value={user?.mobileNumber}
              />
              <InfoRow
                icon={<MapPin size={14} />}
                label="Address"
                value={user?.fullAddress}
              />
            </div>

            <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Settings size={14} className="text-teal-500" /> Account Details
              </h3>
              {[
                {
                  label: "Account Type",
                  value: user?.role?.toUpperCase() ?? "ADMIN",
                  accent: "text-teal-600 dark:text-teal-400",
                },
                {
                  label: "Account ID",
                  value: user?._id?.slice(-8).toUpperCase() ?? "—",
                  accent: "text-gray-600 dark:text-gray-400 font-mono",
                },
                {
                  label: "Status",
                  value: "Active",
                  accent: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  label: "Member Since",
                  value: user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—",
                  accent: "text-gray-600 dark:text-gray-400",
                },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                >
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {label}
                  </span>
                  <span className={`text-xs font-bold ${accent}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Admin permissions overview */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-5 shadow-sm h-full">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-5 flex items-center gap-2">
                <Shield size={14} className="text-teal-500" /> Admin Permissions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    label: "Order Management",
                    sub: "View, edit & manage all orders",
                    granted: true,
                  },
                  {
                    label: "Product Management",
                    sub: "Add, edit & delete products",
                    granted: true,
                  },
                  {
                    label: "User Management",
                    sub: "View & manage customer accounts",
                    granted: true,
                  },
                  {
                    label: "Blog Management",
                    sub: "Create, edit & publish blog posts",
                    granted: true,
                  },
                  {
                    label: "Analytics Access",
                    sub: "View sales & revenue analytics",
                    granted: true,
                  },
                  {
                    label: "Settings Control",
                    sub: "Configure store settings",
                    granted: true,
                  },
                ].map(({ label, sub, granted }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${granted ? "bg-teal-50 dark:bg-teal-500/10" : "bg-red-50 dark:bg-red-500/10"}`}
                    >
                      {granted ? (
                        <CheckCircle2 size={14} className="text-teal-500" />
                      ) : (
                        <AlertTriangle size={14} className="text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin note */}
              <div className="mt-5 p-3.5 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 flex items-start gap-3">
                <Shield size={14} className="text-teal-500 shrink-0 mt-0.5" />
                <p className="text-xs text-teal-700 dark:text-teal-300">
                  As an admin, you have full access to all store management
                  features. Use responsibly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT TAB ── */}
      {tab === "edit" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Edit3 size={14} className="text-teal-500" /> Personal Information
            </h3>
            <Field
              label="Full Name"
              icon={<User size={15} />}
              value={name}
              onChange={setName}
              placeholder="Your full name"
            />
            <Field
              label="Email Address"
              icon={<Mail size={15} />}
              value={user?.email ?? ""}
              readOnly
              placeholder="Email (not editable)"
            />
            <Field
              label="Phone Number"
              icon={<Phone size={15} />}
              value={phone}
              onChange={setPhone}
              placeholder="+880 1XXX-XXXXXX"
            />
            <Field
              label="Full Address"
              icon={<MapPin size={15} />}
              value={address}
              onChange={setAddress}
              placeholder="Your address"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>

          {/* Photo upload */}
          <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm flex flex-col items-center justify-center gap-5">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-teal-300 dark:border-teal-700 flex items-center justify-center shadow-md">
              {user?.photo ? (
                <Image
                  src={user.photo}
                  alt={user.name ?? "Photo"}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-4xl font-bold text-teal-400">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
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
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl border border-teal-500 text-teal-600 dark:text-teal-400 text-sm font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Camera size={13} />
              )}
              {uploading ? "Uploading…" : "Choose Photo"}
            </button>
          </div>
        </div>
      )}

      {/* ── SECURITY TAB ── */}
      {tab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Lock size={14} className="text-teal-500" /> Change Password
            </h3>
            <PwField
              label="Current Password"
              value={curPw}
              onChange={setCurPw}
              placeholder="Current password"
            />
            <PwField
              label="New Password"
              value={newPw}
              onChange={setNewPw}
              placeholder="Min. 6 characters"
            />
            <PwField
              label="Confirm Password"
              value={confirmPw}
              onChange={setConfirmPw}
              placeholder="Repeat new password"
            />
            {newPw && confirmPw && newPw !== confirmPw && (
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <AlertTriangle size={11} /> Passwords do not match
              </p>
            )}
            <button
              onClick={handleChangePassword}
              disabled={changingPw}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              {changingPw ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Lock size={14} />
              )}
              {changingPw ? "Updating…" : "Update Password"}
            </button>
          </div>

          <div className="rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Shield size={14} className="text-teal-500" /> Account Security
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

            {/* Admin warning */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-start gap-2.5">
              <AlertTriangle
                size={13}
                className="text-amber-500 shrink-0 mt-0.5"
              />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Admin accounts are high-value targets. Use a strong, unique
                password and enable 2FA.
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <button className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-800/50 text-red-500 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Revoke All Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfilePage;

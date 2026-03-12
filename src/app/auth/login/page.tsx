"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Logo from "@/Components/Logo";
import { useSearchParams, useRouter } from "next/navigation";
import { ShoppingBag, Star, Shield, Truck, Mail, Lock } from "lucide-react";

const perks = [
  { icon: ShoppingBag, label: "10,000+ curated products" },
  { icon: Star, label: "Exclusive member discounts" },
  { icon: Shield, label: "100% secure payments" },
  { icon: Truck, label: "Express doorstep delivery" },
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleUserLogin = () => {
    setEmail("mehedihasan@email.com");
    setPassword("user@123Login");
  };
  const handleAdminLogin = () => {
    setEmail("admin@email.com");
    setPassword("admin@123Login");
  };

  const handleCredentialsLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast.error("Email and password are required");
      setLoading(false);
      return;
    }
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (!result?.error) {
        toast.success("Login successful!");
        router.push(callbackUrl);
      } else {
        if (result.error === "CredentialsSignin") {
          toast.error(
            "Invalid credentials. Please check your email and password.",
          );
        } else {
          toast.error(result.error || "Invalid credentials!");
        }
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex w-[45%] xl:w-[42%] flex-col justify-between relative overflow-hidden
                      bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-12"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-teal-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-64 h-64 rounded-full bg-teal-600/8 blur-[70px] pointer-events-none" />

        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none">
          <defs>
            <pattern
              id="grid"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Right edge line */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-teal-500/25 to-transparent" />

        {/* Logo */}
        <div className="relative z-10">
          <Logo />
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                             bg-teal-500/12 border border-teal-500/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-teal-400 tracking-widest uppercase">
                Welcome back
              </span>
            </span>

            <h1 className="text-4xl xl:text-[2.75rem] font-extrabold text-white leading-tight">
              Shop smarter,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                live better.
              </span>
            </h1>

            <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
              Sign in to your E-catalog account to track orders, wishlist deals,
              and enjoy exclusive offers.
            </p>
          </div>

          {/* Perks */}
          <div className="space-y-3">
            {perks.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/15
                                flex items-center justify-center shrink-0"
                >
                  <Icon size={14} className="text-teal-400" />
                </div>
                <span className="text-sm text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {[
              { bg: "bg-pink-400", letter: "R" },
              { bg: "bg-sky-400", letter: "T" },
              { bg: "bg-amber-400", letter: "N" },
              { bg: "bg-teal-400", letter: "S" },
            ].map(({ bg, letter }, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full ${bg} border-2 border-gray-900
                                       flex items-center justify-center text-white text-[10px] font-bold`}
              >
                {letter}
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-white">
              50,000+ happy customers
            </p>
            <p className="text-[11px] text-gray-500">
              Join the community today
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div
        className="flex-1 flex items-center justify-center
                      bg-white dark:bg-gray-950
                      px-6 py-12 sm:px-10 lg:px-16"
      >
        <div className="w-full max-w-[400px] space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden mb-2">
            <Logo />
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Sign in
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              New here?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-teal-600 dark:text-teal-400
                               hover:underline transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Quick credential pills */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUserLogin}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold
                               border border-gray-200 dark:border-gray-800
                               bg-gray-50 dark:bg-gray-900
                               text-gray-600 dark:text-gray-400
                               hover:border-teal-500/60 hover:text-teal-600 dark:hover:text-teal-400
                               transition-all duration-200"
            >
              👤 User Demo
            </button>
            <button
              type="button"
              onClick={handleAdminLogin}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold
                               border border-gray-200 dark:border-gray-800
                               bg-gray-50 dark:bg-gray-900
                               text-gray-600 dark:text-gray-400
                               hover:border-teal-500/60 hover:text-teal-600 dark:hover:text-teal-400
                               transition-all duration-200"
            >
              🔑 Admin Demo
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider
                                text-gray-500 dark:text-gray-500"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm
                             bg-gray-50 dark:bg-gray-900
                             border border-gray-200 dark:border-gray-800
                             text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-600
                             focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15
                             transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider
                                text-gray-500 dark:text-gray-500"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm
                             bg-gray-50 dark:bg-gray-900
                             border border-gray-200 dark:border-gray-800
                             text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-600
                             focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15
                             transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                                   text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                                   transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash size={15} />
                  ) : (
                    <FaEye size={15} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white
                               bg-gray-900 hover:bg-gray-700
                               dark:bg-teal-500 dark:hover:bg-teal-400
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200
                               flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span
                className="px-4 bg-white dark:bg-gray-950
                               text-xs text-gray-400 font-medium"
              >
                or continue with
              </span>
            </div>
          </div>

          {/* Google */}
          <button
            onClick={handleLoginWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3
                             py-3 px-4 rounded-xl text-sm font-semibold
                             bg-white dark:bg-gray-900
                             border border-gray-200 dark:border-gray-800
                             text-gray-700 dark:text-gray-200
                             hover:bg-gray-50 dark:hover:bg-gray-800
                             transition-all duration-200 shadow-sm"
          >
            <FcGoogle size={20} />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

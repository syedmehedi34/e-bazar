"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Logo from "@/Components/Logo";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Star,
  Shield,
  Truck,
  User,
  Mail,
  Lock,
} from "lucide-react";

const perks = [
  { icon: ShoppingBag, label: "10,000+ curated products" },
  { icon: Star, label: "Exclusive member discounts" },
  { icon: Shield, label: "100% secure payments" },
  { icon: Truck, label: "Express doorstep delivery" },
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = {
    name: /^[a-zA-Z. ]{2,30}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
  };

  const handleCredentialsLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!validate.name.test(name.trim())) {
      toast.error("Please enter a valid name (2-30 characters)");
      setLoading(false);
      return;
    }
    if (!validate.email.test(email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }
    if (!validate.password.test(password)) {
      toast.error(
        "Password must be at least 8 characters with uppercase, lowercase, and number",
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong!");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.warning("Account created! Please login manually.");
        router.push("/auth/login");
      } else {
        toast.success("Account created successfully!");
        form.reset();
        router.push("/");
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
                Join today — it&apos;s free
              </span>
            </span>

            <h1 className="text-4xl xl:text-[2.75rem] font-extrabold text-white leading-tight">
              Start your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                shopping journey.
              </span>
            </h1>

            <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
              Create your free account and unlock thousands of products,
              exclusive deals, and fast delivery — all in one place.
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
              Create account
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have one?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-teal-600 dark:text-teal-400
                               hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={handleLoginWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3
                       py-3 px-4 rounded-xl text-sm font-semibold
                       bg-white dark:bg-gray-900
                       border border-gray-200 dark:border-gray-800
                       text-gray-700 dark:text-gray-200
                       hover:bg-gray-50 dark:hover:bg-gray-800
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-sm"
          >
            <FcGoogle size={20} />
            Sign up with Google
          </button>

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
                or register with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider
                                text-gray-500 dark:text-gray-500"
              >
                Full name
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
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

            {/* Email */}
            <div className="space-y-1.5">
              <label
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
                  type="email"
                  name="email"
                  placeholder="you@example.com"
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 chars, upper, lower, number"
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
                    <AiFillEyeInvisible size={17} />
                  ) : (
                    <AiFillEye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms note */}
            <p className="text-[11px] text-gray-400 dark:text-gray-600 leading-relaxed">
              By creating an account, you agree to our{" "}
              <span className="text-teal-600 dark:text-teal-500 cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-teal-600 dark:text-teal-500 cursor-pointer hover:underline">
                Privacy Policy
              </span>
              .
            </p>

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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

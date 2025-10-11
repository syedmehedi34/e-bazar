
"use client";
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import Logo from '@/Components/Logo/Logo';
import { useSearchParams,useRouter } from 'next/navigation';
const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const callbackUrl = searchParams.get("callbackUrl") || '/'

    const handleUserLogin = () => {
        setEmail("mduserkhan@gmail.com");
        setPassword("12345678")
    }
    const handleAdminLogin = () => {
        setEmail("admin123@gmail.com");
        setPassword("12345678")
    }

    const handleCredentialsLogin = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!email || !password) {
            toast.error("Email and password are required");
            setLoading(false);
            return;
        }
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.ok && !result.error) {
            toast.success("Login Successfully !")
            setLoading(false);
            router.push(callbackUrl)

        } else {
            toast.error("Invalid credentials!");
            setLoading(false)
        }
    };



    const handleLoginWithGoogle = async () => {
        try {
            await signIn("google", { callbackUrl: "/" });
        } catch (error) {
            console.error("Google login failed:", error);
        }
    };
    return (
        <div className='min-h-screen flex justify-center items-center  '>
            <div className="container-custom ">
               
                <div className="bg-white dark:bg-gray-800 py-10 rounded-2xl shadow-lg w-[500px] max-w-full mx-auto p-6 relative">

                    {/* Header */}
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            <Logo />
                        </h2>
                        <div className='flex items-center gap-4'>
                            <button type='button'
                                onClick={handleUserLogin}
                                className='py-1 px-2 rounded-md text-sm cursor-pointer bg-gray-200'>User Credential</button>
                            <button type='button'
                                onClick={handleAdminLogin}
                                className='py-1 px-2 rounded-md text-sm cursor-pointer bg-gray-200'>Admin Credential</button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleCredentialsLogin} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 bg-transparent"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label className="block text-gray-600 mb-1">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}  // 👈 toggle type
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-500 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-800 bg-transparent"
                                required
                            />
                            {/* Eye Icon */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full bg-gray-800 text-white font-semibold py-2 rounded-lg hover:bg-gray-900 transition cursor-pointer"
                        >
                            {loading ? <span className="loading loading-bars loading-sm"></span> : "Sign in"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-2 text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Google */}
                    <button
                        onClick={handleLoginWithGoogle}
                        className="btn btn-block rounded-md bg-gray-800 border-none text-white hover:bg-gray-800 flex items-center gap-2 justify-center"
                    >
                        <FcGoogle size={24} />
                        Login with Google
                    </button>

                    {/* Footer */}
                    <p className='text-sm text-center mt-4'>
                        <span>Don&apos;t have an account? <Link href={'#'} className='text-red-400 underline'>Create account</Link></span>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default LoginPage
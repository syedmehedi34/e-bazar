
"use client";
import { signIn } from 'next-auth/react';
import React, { useState } from 'react'


import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios, { AxiosError } from 'axios';

import Swal from 'sweetalert2'
import { FcGoogle } from 'react-icons/fc';
import Logo from '@/Components/Logo/Logo';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';



const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const handleCredentialsLogin = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const userInfo = {
            name,
            email,
            password,
            role: ["user"],
        };

        try {
            const res = await axios.post(`https://e-bazaar-server-three.vercel.app/create/user`, userInfo);

            if (res.status === 200 || res.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: res.data.message || "User created successfully!",
                });

                form.reset();
                router.push('/')

            }
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data?.message)
        } finally {
            setLoading(false);
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

        <div className='container-custom '>
            
            <div className="flex justify-center items-center min-h-screen ">
                {/* Modal Box */}

                <div className="bg-white dark:bg-gray-800 dark:text-white text-black py-10  rounded-2xl shadow-lg w-[500px] max-w-full p-6 relative">



                    <h2 className="text-xl font-semibold  mb-4 rubik r">
                        <Logo />
                    </h2>
                    {/* Google */}
                    <button
                        onClick={handleLoginWithGoogle}
                        className="btn btn-block  rounded-md bg-gray-900 border-none text-white hover:bg-gray-800  ">
                        <FcGoogle size={30} />
                        Login with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <span className="mx-2 text-gray-400 dark:text-white">OR</span>
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                    <form onSubmit={handleCredentialsLogin} className="space-y-4">
                        {/* Name */}
                        <div>

                            <input
                                type="text"
                                placeholder="Enter your Name"
                                name='name'
                                className="w-full input dark:bg-gray-600"
                                required
                            />
                        </div>
                        {/* Email */}
                        <div>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                name='email'
                                className="w-full input dark:bg-gray-600"
                                required
                            />
                        </div>

                        <div className="relative">

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                name='password'
                                className="w-full input dark:bg-gray-600"
                                required
                            />
                            {/* Eye icon */}
                            <span
                                className="absolute right-3 top-[10px] cursor-pointer text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </span>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-900 transition cursor-pointer"
                        >
                            {loading ? "Sign Up..." : "Sign Up"}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Register
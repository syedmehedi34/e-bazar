
"use client";
import { signIn } from 'next-auth/react';
import React, { useState } from 'react'
import { FaGooglePlusG } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from 'axios';

import Swal from 'sweetalert2'

interface RegisterProps { onClose: () => void; }
const Register: React.FC<RegisterProps> = ({ onClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


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
    const res = await axios.post(`http://localhost:5000/create/user`, userInfo);

    if (res.status === 200 || res.status === 201) {
      Swal.fire({
        icon: "success",
        title: res.data.message || "User created successfully!",
      });

      form.reset();
      onClose();
    }
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: error.response?.data?.message || error.message || "Something went wrong",
    });
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            {/* Modal Box */}
            <div className="bg-black py-10 border border-gray-600 rounded-2xl shadow-lg w-[500px] max-w-full p-6 relative">
                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 cursor-pointer hover:text-gray-800 transition bg-red-600 p-1 rounded-2xl text-white font-bold"
                    onClick={onClose}
                >
                    <IoClose />
                </button>

                <h2 className="text-xl font-semibold text-gray-100 mb-4 rubik text-center">Register</h2>
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-gray-300 mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your Name"
                            name='name'
                            className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 input bg-transparent"
                            required
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label className="block text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            name='email'
                            className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 input bg-transparent"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-gray-300 mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            name='password'
                            className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 input bg-transparent"
                            required
                        />
                        {/* Eye icon */}
                        <span
                            className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </span>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white font-semibold py-2 rounded-lg hover:bg-gray-900 transition cursor-pointer"
                    >
                        {loading ? "sign in..." : "sign in"}
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
                    className="btn btn-block  rounded-md bg-red-600 border-none text-white hover:bg-red-800  ">
                    <FaGooglePlusG size={30} />
                    Login with Google
                </button>






            </div>
        </div>
    )
}

export default Register
"use client";
import { signIn } from 'next-auth/react';
import Link from 'next/link';


import React, { useState } from 'react'

import { FaGooglePlusG } from 'react-icons/fa6';

import { IoClose } from 'react-icons/io5'


interface LoginPageProps { onClose: () => void; }



const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


 const handleCredentialsLogin = async (e:React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true); 

    if (!email || !password) {
      alert("Email and password are required");
      setLoading(false); 
      return;
    }

    const userData = { email, password };
    console.log("User Data:", userData);

    // Call the login API
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, 
    });
     setLoading(false); 
    if (result?.ok && !result.error) {
      alert("Login successful! 🎉");
      

    } else {
      alert("Invalid credentials!");
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
      <div className="bg-black py-10 border border-gray-600 rounded-2xl shadow-lg w-[400px] max-w-full p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 cursor-pointer hover:text-gray-800 transition bg-red-600 p-1 rounded-2xl text-white font-bold"
          onClick={onClose}
        >
          <IoClose />
        </button>

        <h2 className="text-xl font-semibold text-gray-100 mb-4 rubik text-center">Login</h2>
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 input bg-transparent"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 input bg-transparent"
              required
            />
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

        <p className='text-sm text-center mt-4'>
          <span>Dot't have an account please? <Link href={'#'} className='text-red-400 underline'>create account</Link></span>
        </p>




      </div>
    </div>
  )
}

export default LoginPage

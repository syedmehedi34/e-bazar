"use client"
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';

type CreateUserProps = {
    onGetUserFn: () => void
  
}
const CreateUser: React.FC<CreateUserProps> = ({ onGetUserFn }) => {

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
            const res = await axios.post(`https://e-bazaar-server-three.vercel.app/create/user`, userInfo);

            if (res.status === 200 || res.status === 201) {
                toast.success("User created successfully!")
                onGetUserFn()
                form.reset();

            }
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data?.message || "Something went wrong",)
        } finally {
            setLoading(false);
        }
    };

    


    return (
        <div>
            <div>
                <h2 className="text-2xl font-bold mb-2 dark:text-white">User Created</h2>

                {/* Paragraph */}
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                    This section allows administrators to create new users by providing their name, email, password, and role.
                    Once created, the new user will be added to the system and displayed in the user list.
                </p>
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-gray-800 mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your Name"
                            name='name'
                            className="input w-full dark:bg-gray-600 dark:text-white"
                            required
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label className="block text-gray-800 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            name='email'
                            className="input w-full dark:bg-gray-600 dark:text-white"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-gray-800 mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            name='password'
                            className="input w-full dark:bg-gray-600 dark:text-white"
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
                        className="w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-900 transition cursor-pointer"
                    >
                        {loading ? <span className="loading loading-bars loading-xl"></span> : "Create User"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateUser
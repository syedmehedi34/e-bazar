import Link from 'next/link';
import React from 'react'
import { FaPhoneAlt } from 'react-icons/fa';
import { FaGooglePlusG } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { IoClose } from 'react-icons/io5'


interface LoginPageProps {
  onClose: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
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

        <h2 className="text-xl font-semibold text-gray-100 mb-4 rubik">Login</h2>

        {/* Google */}
        <button className="btn btn-block  rounded-md bg-red-600 border-none text-white hover:bg-red-800  ">
          <FaGooglePlusG size={30}/>
          Login with Google
        </button>
        {/* Phone */}
     



      </div>
    </div>
  )
}

export default LoginPage

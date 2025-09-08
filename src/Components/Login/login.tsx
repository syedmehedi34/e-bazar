import React from 'react'
import { IoClose } from 'react-icons/io5'


const LoginPage = ({onClose}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-lg w-[400px] max-w-full p-6 relative">
        {/* Close Button */}
        <button 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
          onClick={onClose}
        >
          <IoClose/>
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Login</h2>
        
        {/* Form */}
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          Don’t have an account? <a href="#" className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage

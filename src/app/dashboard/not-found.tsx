"use client";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex  flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-9xl font-extrabold text-gray-800 mb-6">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
        Oops! Page not found
      </h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-gray-800 text-white font-semibold rounded hover:bg-purple-700 transition"
      >
        Go Back Home
      </Link>
      <div className="mt-10">
        <Image
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="404 Illustration"
          width={100}
          height={100}
          className="w-80 md:w-96"
        />
      </div>
    </div>
  )
}

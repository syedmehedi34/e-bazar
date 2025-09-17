"use client";

 import { useRouter } from "next/navigation";
export default function NotFound() {
   const router = useRouter();
  return (
    <div className="flex  flex-col items-center justify-center min-h-screen  p-6" 
     style={{ background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #350136 100%)", }}
    
    >
      <h1 className="text-9xl font-extrabold text-gray-100 mb-6">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-300">
        Oops! Page not found
      </h2>
      <p className="text-gray-300 mb-6 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
    <button
      onClick={() => router.back()}
      className="px-6 py-3 bg-gray-600 text-white font-semibold rounded hover:bg-red-700 transition"
    >
      Go Back
    </button>
    
    </div>
  );
}

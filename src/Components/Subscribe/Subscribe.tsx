"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";


const Subscribe = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address!");
      return;
    }

    toast.success("Thank You for Subscribing!");
    setEmail("");
  };

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Image */}


      <div className="container-custom dark:bg-gray-800 bg-gray-100 shadow dark:text-white p-5 relative z-10 flex flex-col items-center justify-center text-center space-y-5 px-4 rubik">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white flex flex-col sm:flex-row items-center gap-2">
          Subscribe and get{" "}
          <span className="text-3xl font-extrabold text-yellow-600">
            20% Off
          </span>
        </h3>

        <p className="text-gray-600 dark:text-white text-sm md:text-base max-w-lg">
          Get an exclusive 20% discount on all products by subscribing to our
          newsletter. Stay updated with the latest offers and trends.
        </p>

        {/* Email Form */}
        <form
          onSubmit={handleSubscribe}
          className="mt-4 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
        >
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
            required
            className="w-full flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm"
          />
          <button type="submit" className="dark:bg-gray-600 py-3 bg-gray-900 text-white rounded-box px-4 cursor-pointer">Join</button>
        </form>
      </div>
    </section>
  );
};

export default Subscribe;

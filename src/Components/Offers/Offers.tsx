import Image from "next/image";
import React from "react";

const Offers = () => {
    return (
        <div className="w-11/12 mx-auto my-12 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 rounded-2xl p-8 shadow-lg shadow-gray-800 relative rubik ">

                {/* Left Content */}
                <div className="space-y-4 relative z-50">
                    <p className="text-sm  font-medium uppercase tracking-wide">
                        Special Offer
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                        Get the Best Deals on <span className="text-gray-800">Headphones</span>
                    </h2>
                    <p className="text-gray-800 text-sm md:text-base">
                        Upgrade your sound experience with our premium headphones.
                        Limited time offer, don’t miss out on this chance to save big.
                    </p>

                    {/* Price Section */}
                    <div className="flex items-center gap-3 relative">
                        <span className="text-lg font-medium text-gray-400 line-through">
                            ৳1500
                        </span>
                        <span className="text-2xl font-bold text-gray-800">
                            ৳999
                        </span>

                        {/* Discount Badge */}

                    </div>

                    <button className="mt-4 px-6 py-2 bg-gray-800 hover:bg-purple-700 text-white text-sm font-medium rounded-full shadow-md transition">
                        Shop Now
                    </button>
                    <p className="absolute   text-gray-100 font-bold top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  sm:text-[20vw] text-[40vw] z-[-1]">
                        35%
                    </p>
                </div>

                {/* Right Image */}
                <div className="flex justify-center relative z-10">
                    <Image
                        src="https://img.freepik.com/free-vector/pink-headphones-purple_98292-4129.jpg?t=st=1757692367~exp=1757695967~hmac=b5ef9949f70510e43633c5381891377037007840850014819750d2af90930ae0&w=1480"
                        width={400}
                        height={300}
                        alt="offers images"
                        priority
                      
                        className="w-full max-w-sm object-contain drop-shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default Offers;

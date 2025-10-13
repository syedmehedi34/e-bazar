
import Image from "next/image";
import React from "react";
import Countdown from "./CountDown";
import Link from "next/link";

const Offers = () => {
    return (
        <div className="container-custom my-16 relative">
            <div className="lg:flex">
                <div className="lg:flex-1 bg-gray-300 flex justify-center items-center">
                    <Image
                        src={"https://i.postimg.cc/G2FT0xCn/fashion-portrait-two-smiling-brunette-women-models-summer-casual-hipster-overcoat-posing-gray-Photor.png"}
                        width={500}
                        height={100}
                        alt="offer images"
                    />
                </div>
                <div className="lg:flex-1 flex justify-center items-center flex-col gap-10 bg-gray-800 text-white  ">
                    <div className="flex flex-col gap-2 items-center relative z-[100] ">
                        <p className="text-white tracking-wider text-center">Discount</p>
                        <h2 className="text-4xl italic tracking-wider font-bold">
                            Summer 2025
                        </h2>
                        <p>
                            SALE <span className="text-xl text-yellow-600 font-bold">50%</span>
                        </p>

                        
                    </div>

                    <div>
                        <Countdown
                            targetDate="2025-11-31T23:59:59Z"
                            className=""
                            onComplete={() => alert("Countdown finished!")}
                        />
                    </div>
                    <div>
                        <Link href={'/shopping' } className="border-b-2 pb-1 font-bold tracking-wider">
                            Shop
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Offers;

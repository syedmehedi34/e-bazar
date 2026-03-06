"use client";

import Image from "next/image";
import React from "react";
import Countdown from "./CountDown";
import Link from "next/link";
import { offer } from "@/lib/offers";

const Offers = () => {
  const offerDetails = offer;
  return (
    <div className="container-custom my-16 relative">
      <div className="lg:flex">
        <div className="lg:flex-1 bg-gray-300 flex justify-center items-center">
          <Image
            src={offerDetails.offerImage}
            width={500}
            height={100}
            alt="offer images"
          />
        </div>
        <div className="lg:flex-1 flex justify-center items-center flex-col gap-10 bg-gray-800 text-white  ">
          <div className="flex flex-col gap-2 items-center relative z-[100] ">
            <p className="text-white tracking-wider text-center">
              {offerDetails.offerType}
            </p>
            <h2 className="text-4xl italic tracking-wider font-bold">
              {offerDetails.offerName}
            </h2>
            <p>
              {offerDetails.offerDetails}{" "}
              <span className="text-xl text-yellow-600 font-bold">
                {offerDetails.offerPercentage}%
              </span>
            </p>
          </div>

          <div>
            <Countdown
              targetDate={offerDetails.offerEndDate}
              className=""
              // onComplete={() => alert("Countdown finished!")}
            />
          </div>
          <div>
            <Link
              href={"/shopping"}
              className="border-b-2 pb-1 font-bold tracking-wider"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;

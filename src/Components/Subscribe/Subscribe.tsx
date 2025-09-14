import Image from "next/image";
import React from "react";
import Button from "../Button/Button";

const Subscribe = () => {
  return (
    <div className="py-16 ">
      <div className="w-11/12 mx-auto">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-10 md:gap-16 shadow-md shadow-purple-600 p-5">
          {/* Left Content */}
          <div className="text-center md:text-left space-y-4 md:space-y-6 max-w-lg">
            <h3 className="text-lg font-medium ">
              Subscribe and get
            </h3>
            <h4 className="text-4xl md:text-5xl font-bold text-purple-600">
              20% Off
            </h4>
            <p className="text-gray-300 text-sm md:text-base">
              Get 20% discount on all products by subscribing to our newsletter.
            </p>

            {/* Email Form */}
            <form className="mt-4">
              <div className="flex items-center flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="mail@site.com"
                  required
                  className=" bg-gray-900  input-bordered w-full sm:w-auto flex-1 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button text={"Join"} type={"submit"}/>
              </div>
            </form>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:justify-end w-full max-w-md relative z-20">
            <div className="w-72 h-72 rounded-full bg-purple-600 absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] z-[-1] blur-lg animate-pulse"></div>
            <Image
              src="https://i.postimg.cc/Z5LkCz7X/portrait-afro-american-couple.png"
              width={300}
              height={300}
              alt="subscribe products images"
              className="w-full h-[300px] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;

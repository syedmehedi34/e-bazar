"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import testimonials from "@/lib/testimonials";

const Testimonial = () => {
  return (
    <div className="py-16">
      <div className="container-custom">
        <h2 className="text-4xl font-bold text-center mb-10 rubik dark:text-white">
          What Our Customers Say
        </h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="card  shadow-md hover:shadow-md p-10 rubik  my-10  hover:scale-105 transition-all duration-300 cursor-pointer dark:text-white dark:bg-gray-800 h-[250px]">
                <div className="flex items-center gap-3 mb-3 ">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={100}
                    height={100}
                    className="w-14 h-14 rounded-tl-[160px] rounded-tr-[150px]  rounded-bl-[150px] border-b-4 border-gray-800 "
                  />
                  <div>
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-white">
                      {t.location}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-white">
                      {t.date}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-800 mb-2 line-clamp-3 dark:text-white">
                  {t.description}
                </p>
                <div className="flex">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-600 dark:text-white">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonial;

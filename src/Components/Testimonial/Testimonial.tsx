"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {  Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
const testimonials = [
  {
    name: "Rahim Uddin",
    date: "2025-02-10",
    rating: 5,
    description:
      "Excellent service! The product quality was beyond my expectations. Delivery was also very fast.",
    location: "Dhaka, Bangladesh",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Anika Sultana",
    date: "2025-01-28",
    rating: 4,
    description:
      "Really happy with the purchase. The packaging was secure and the product looks amazing.",
    location: "Chattogram, Bangladesh",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Shafiq Hasan",
    date: "2025-01-15",
    rating: 5,
    description:
      "Best online shopping experience so far. Customer support was very helpful and responsive.",
    location: "Sylhet, Bangladesh",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
  },
  {
    name: "Mitu Akter",
    date: "2025-01-02",
    rating: 4,
    description:
      "The product was good, but delivery took a bit longer than expected. Overall, satisfied.",
    location: "Khulna, Bangladesh",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Tanvir Alam",
    date: "2024-12-22",
    rating: 5,
    description:
      "Absolutely loved the headphones I bought. Great sound quality at an affordable price.",
    location: "Rajshahi, Bangladesh",
    image: "https://randomuser.me/api/portraits/men/77.jpg",
  },
  {
    name: "Farzana Hossain",
    date: "2024-12-10",
    rating: 5,
    description:
      "This site is trustworthy. I’ve ordered multiple times and every time I was impressed.",
    location: "Barishal, Bangladesh",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "Sabbir Rahman",
    date: "2024-11-30",
    rating: 4,
    description:
      "The smartwatch works perfectly. Just wish the battery life was a bit longer.",
    location: "Rangpur, Bangladesh",
    image: "https://randomuser.me/api/portraits/men/81.jpg",
  },
  {
    name: "Nusrat Jahan",
    date: "2024-11-20",
    rating: 5,
    description:
      "Amazing shopping platform. The discounts are real, and the products are authentic.",
    location: "Comilla, Bangladesh",
    image: "https://randomuser.me/api/portraits/women/25.jpg",
  },
];

const Testimonial = () => {
  return (
    <div className="py-16">
      <div className="container-custom">
        <h2 className="text-4xl font-bold text-center mb-10 rubik dark:text-white">
          What Our Customers Say
        </h2>

        <Swiper
          modules={[ Pagination, Autoplay]}
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
              <div className="card  shadow-md hover:shadow-md  py-5 px-2 rubik h-full my-10 hover:shadow-gray-800 hover:scale-105 transition-all duration-300 cursor-pointer dark:text-white dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-3 ">
                  <Image src={t.image}
                    alt={t.name}
                    width={100}
                    height={100}
                    className="w-14 h-14 rounded-tl-[160px] rounded-tr-[150px]  rounded-bl-[150px] border-b-4 border-gray-800 "
                  />
                  <div>
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-white">{t.location}</p>
                    <p className="text-xs text-gray-600 dark:text-white">{t.date}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-800 mb-2 line-clamp-2 dark:text-white">{t.description}</p>
                <div className="flex">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-gray-800 dark:text-white">
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

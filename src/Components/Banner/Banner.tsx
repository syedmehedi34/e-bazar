'use client'
// BannerSlider.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import {  Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import Button from '../Button/Button';
import { motion } from "framer-motion";

const banners = [
  {
    subtitle: "New Arrival",
    title: "Men's Fashion Collection",
    short_description: "Explore the latest trends in men's fashion. From streetwear to formal styles, we've got it all.",
    button: "Shop Now",
    image: "https://i.postimg.cc/L5hSkmvQ/young-men-laying-hands-shoulders-woman-smiling.png"
  },
  {
    subtitle: "Style Redefined",
    title: "Women's Exclusive Wear",
    short_description: "Upgrade your wardrobe with our elegant and trendy women's fashion collection.",
    button: "Explore Collection",
    image:
      "https://i.postimg.cc/G2FT0xCn/fashion-portrait-two-smiling-brunette-women-models-summer-casual-hipster-overcoat-posing-gray-Photor.png"
  },
  {
    subtitle: "Top Deals",
    title: "Smart Electronics & Gadgets",
    short_description: "Grab the best deals on the latest electronics and gadgets. Limited time offers!",
    button: "Browse Now",
    image: "https://i.postimg.cc/7hCvGmYp/low-angle-daughter-mother-listening-music.png"
  }
];

const Banner = () => {
  return (
    <div className=''>


      <div className=" py-8 relative min-h-[80vh] ">
        <div className="absolute top-0 right-0 h-full w-[60%] bg-gray-200 clip-path   ">
        </div>

        <Swiper
          modules={[Autoplay]}
          effect="fade"
          speed={2000}
          autoplay={{ delay: 4000, }}
          loop

          className="w-full"
        >
          {banners.map((item, index) => (
            <SwiperSlide key={index}>
              <div className=" w-11/12 mx-auto  lg:flex justify-between lg:flex-row-reverse flex-row items-center gap-8 mt-14 ">
                {/* Left Side - Image */}
                <motion.div
                  animate={{ x: [0, 40, 0] }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "loop", }}
                  className="flex justify-center lg:justify-end items-center w-full md:h-[500px] 
                
                ">
                  <Image src={item.image} alt={item.title} width={700} height={500} priority />
                </motion.div>

                {/* Right Side - Content */}
                <div className="space-y-3 rubik max-lg:text-center mt-5">
                  <p className=" font-bold">{item.subtitle}</p>
                  <h2 className="text-2xl md:text-6xl font-bold  tracking-wide">{item.title}</h2>
                  <p className=" text-[16px] leading-6 tracking-wide">{item.short_description}</p>
                  <Button text={item.button} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Banner;

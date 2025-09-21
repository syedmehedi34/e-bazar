'use client'
// BannerSlider.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
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
    <div className="relative flex items-center py-8 h-[80vh] md:h-[100vh] lg:h-[80vh] xl:h-[100vh] border-b-2 border-gray-200">
      {/* Background Shape */}
      <div className="absolute top-0 right-0 h-full w-[70%] lg:w-[60%] bg-gray-200 clip-path" />

      {/* Swiper */}
      <Swiper
        modules={[Autoplay]}
        effect="fade"
        speed={2000}
        autoplay={{ delay: 4000 }}
        loop
        className="w-full"
      >
        {banners.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="container-custom flex flex-col-reverse lg:flex-row-reverse items-center gap-8 mt-10 md:mt-14">
              
              {/* Left Side - Image */}
              <motion.div
                animate={{ x: [0, 40, 0] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
                className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px] flex justify-center lg:justify-end"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority
                  className="object-contain"
                />
              </motion.div>

              {/* Right Side - Content */}
              <div className="space-y-3 rubik text-center lg:text-left">
                <p className="font-bold text-sm sm:text-base">{item.subtitle}</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-wide">
                  {item.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg leading-6 tracking-wide max-w-xl mx-auto lg:mx-0">
                  {item.short_description}
                </p>
                <div className="flex justify-center lg:justify-start">
                  <Button text={item.button} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;

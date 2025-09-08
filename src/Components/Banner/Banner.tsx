'use client'
// BannerSlider.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation,Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import Button from '../Button/Button';

const banners = [
  {
    subtitle: "New Arrival",
    title: "Men's Fashion Collection",
    short_description: "Explore the latest trends in men's fashion. From streetwear to formal styles, we've got it all.",
    button: "Shop Now",
    image: "https://i.postimg.cc/KvMW72Yt/fashionable-man-winter-knitted-clothes-removebg-preview.png"
  },
  {
    subtitle: "Style Redefined",
    title: "Women's Exclusive Wear",
    short_description: "Upgrade your wardrobe with our elegant and trendy women's fashion collection.",
    button: "Explore Collection",
    image: 
    "https://i.postimg.cc/9Mq9gVnj/portrait-young-stylish-girl-model-casual-summer-clothes-brown-hat-with-natural-makeup-isolated-remov.png"
  },
  {
    subtitle: "Top Deals",
    title: "Smart Electronics & Gadgets",
    short_description: "Grab the best deals on the latest electronics and gadgets. Limited time offers!",
    button: "Browse Now",
    image: "https://i.postimg.cc/qqX30qL8/headphone.png"
  }
];

const Banner = () => {
  return (
    <div className=' min-h-screen'>

  
    <div className=" py-8">
      <Swiper
       modules={[Autoplay]}
       effect="fade" 
      speed={2000} 
        autoplay= {{delay:4000, }}
        loop
    
        className="w-full"
      >
        {banners.map((item, index) => (
          <SwiperSlide key={index}>
            <div className=" w-11/12 mx-auto  lg:flex justify-between lg:flex-row-reverse flex-row items-center gap-8 mt-14">
              {/* Left Side - Image */}
              <div className="">
                <Image src={item.image} alt={item.title} width={500} height={500}/>
              </div>

              {/* Right Side - Content */}
              <div className="space-y-3 rubik max-lg:text-center mt-5">
                <p className=" font-bold">{item.subtitle}</p>
                <h2 className="text-2xl md:text-6xl font-bold  tracking-wide">{item.title}</h2>
                <p className=" text-[16px] leading-6 tracking-wide">{item.short_description}</p>
                  <Button text={item.button}/>
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

'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Button from '../Button/Button';


const slides = [
  {
    desktopImg: 'https://i.postimg.cc/qBxrBpzt/hero-1-2.png',
    mobileImg: 'https://i.postimg.cc/zXhfFsB8/hero-1-m.png',
    content: {
      subtitle: 'New Arrival',
      title: "Men's Fashion Collection",
      desc: "Explore the latest trends in men's fashion. From streetwear to formal styles, we've got it all.",
      btnText: 'Shop Now',
      align: 'left',
    },
  },
  {
    desktopImg: 'https://i.postimg.cc/KcQWKWN8/hero2-1.png',
    mobileImg: 'https://i.postimg.cc/7hBtpC62/hero2-2.png',
    content: {
      subtitle: 'Style Redefined',
      title: "Women's Exclusive Wear",
      desc: "Upgrade your wardrobe with our elegant and trendy women's fashion collection.",
      btnText: 'Explore Collection',
      align: 'left',
    },
  },
  {
    desktopImg: 'https://i.postimg.cc/GmmMjCjs/hero3.png',
    mobileImg: 'https://i.postimg.cc/ZnYD7PTm/hero3-m.png',
    content: {
      subtitle: 'Top Deals',
      title: 'Smart Electronics & Gadgets',
      desc: 'Grab the best deals on the latest electronics and gadgets. Limited time offers!',
      btnText: 'Browse Now',
      align: 'left',
    },
  },
];

const Banner = () => {
  return (
    <div className="relative h-[80vh] md:h-[100vh] lg:h-[80vh] xl:h-[100vh] border-b-2 dark:border-gray-600 border-gray-200 bg-white dark:bg-gray-900">
      <div className='absolute inset-0 w-full h-full clip-path  bg-gray-600 dark:bg-gray-700'></div>
      <Swiper
        modules={[Autoplay]}
        effect="fade"
        speed={2000}
        loop
        className="w-full h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-full bg-center bg-cover flex items-center justify-end relative">
              {/* Desktop Image */}
              <div
                className="hidden lg:block absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.desktopImg})` }}
              />
              {/* Mobile Image + Overlay */}
              <div className="block lg:hidden absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.mobileImg})` }}
                />
                <div className="absolute inset-0 bg-black/40" /> {/* overlay */}
              </div>

              {/* Content */}
              <div
                className={`container-custom `}
              >
                <div
                  className={`relative z-10 space-y-4 lg:text-black text-white text-center lg:text-start max-w-2xl ${
                    slide.content.align === 'right' ? 'text-right px-6' : ''
                  }`}
                >
                  <p className="font-bold text-sm sm:text-base dark:text-white">{slide.content.subtitle}</p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-wide dark:text-white">
                    {slide.content.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg leading-6 tracking-wide dark:text-white">
                    {slide.content.desc}
                  </p>
                  <div className={slide.content.align === 'right' ? 'flex justify-end' : ''}>
                    <Button text={slide.content.btnText} />
                  </div>
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

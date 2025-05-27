"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {useTranslations,useLocale} from 'next-intl';

{/* <h1>{t('title')}</h1> */}
const Hero = () => {
    const t = useTranslations("HomePage"); 
 
    const locale = useLocale(); // الحصول على اللغة الحالية
    const isArabic = locale === "ar"; // تحديد ما إذا كانت اللغة العربية
  return (
    <Swiper
      pagination={{ dynamicBullets: true, clickable: true }}
    
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      modules={[Pagination, Navigation, Autoplay]}
      className="mySwiper w-[90%] md:w-[70%] h-[300px] md:h-[400px] rounded-2xl mt-2.5"
    >
      <SwiperSlide>
        <div className="w-full h-full overflow-hidden group relative">
          <img
            className="group-hover:scale-105 transition-transform duration-500 ease-in-out w-full h-full object-cover"
            src="https://miniture.b-cdn.net/wp-content/uploads/2023/10/m11_slide_01.jpg"
            alt=""
          />
          <div className=" absolute top-0">
          <p>{isArabic ?'اهلا':'hello'}</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
      <div className="w-full h-full overflow-hidden group">
          <img
            className="group-hover:scale-105 transition-transform duration-500 ease-in-out w-full h-full object-cover"
            src="https://miniture.b-cdn.net/wp-content/uploads/2023/10/m11_slide_02.jpg"
            alt=""
          />
        </div>
      </SwiperSlide>
      <SwiperSlide>
      <div className="w-full h-full overflow-hidden group">
          <img
            className="group-hover:scale-105 transition-transform duration-500 ease-in-out w-full h-full object-cover"
            src="https://miniture.b-cdn.net/wp-content/uploads/2023/10/m11_slide_03.jpg"
            alt=""
          />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Hero;

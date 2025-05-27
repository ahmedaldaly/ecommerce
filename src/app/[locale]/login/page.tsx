import React from 'react'
import Image from 'next/image'
import { useTranslations,useLocale } from "next-intl";
import Form from './Form';

const page = () => {
    const locale = useLocale(); // الحصول على اللغة الحالية
  const isArabic = locale === "ar"; // تحديد ما إذا كانت اللغة العربية
  return (
    <div className='w-full h-[100vh] flex justify-center items-center'>
       <div className='w-[500px] px-10 h-[550px] shadow-md border-1 border-gray-200'>
       <Image className='mx-auto mt-10' src="/image/logo.png" alt="Login" width={200} height={200} />
       <p className='font-bold text-xl my-5'>{isArabic?"تسجيل الدخول":"Log In"}</p>
       <Form/>
      
         </div>
          
    </div>
  )
}

export default page
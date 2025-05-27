import React from 'react'
import { useTranslations, useLocale } from "next-intl";
import User from '@/components/user/User';

const page = () => {
    const locale = useLocale();
    const isArabic = locale === "ar";
  return (
    <div className=' w-full min-h-[100vh] pt-24 text-center '>
        <h1 className='text-3xl my-5 '>{isArabic?'ادارة المستخدمين':'Users Management'}</h1>
        <User/>
    </div>
  )
}

export default page
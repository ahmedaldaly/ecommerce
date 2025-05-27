import React from 'react'
import { useTranslations, useLocale } from "next-intl";
import AllCategory from '@/components/category/AllCategory';

const page = () => {
    const locale = useLocale();
        const isArabic = locale === "ar";
  return (
    <div className='w-full min-h-[100vh] pt-24 text-center'>
        <h1 className='text-2xl my-5'>{isArabic?'ادارة الفئات':'Category Management'}</h1>
       <AllCategory/>
    </div>
  )
}

export default page
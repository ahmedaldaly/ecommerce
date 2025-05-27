import React from 'react'
import { useTranslations, useLocale } from "next-intl";
import AddCategory from '@/components/category/AddCategory';
const page = () => {
      const locale = useLocale();
            const isArabic = locale === "ar";
  return (
    <div className='w-full min-h-[100vh] pt-24 text-center'>
          <h1 className='text-2xl my-5'>{isArabic?' اضافة فئات':'Add Category'}</h1>
          <AddCategory/>
    </div>
  )
}

export default page
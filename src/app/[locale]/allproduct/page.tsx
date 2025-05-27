import React from 'react'
import { useLocale } from 'next-intl'
import AllProduct from '@/components/products/AllProduct';
const page = () => {
     const locale = useLocale();
            const isArabic = locale === "ar";
  return (
    <div className='w-full min-h-[100vh] pt-24 text-center'>
         <h1 className='text-2xl my-5'>{isArabic?'ادارة المنتجات':'Products Management'}</h1>
         <AllProduct/>
    </div>
  )
}

export default page
import React from 'react'
import { useLocale } from 'next-intl'
import AddProducts from '@/components/products/AddProducts'
const page = () => {
    const locale = useLocale()
    const isArabic = locale ==='ar'
  return (
    <div className='w-full min-h-[100vh] pt-24 text-center'>
         <h1 className='text-2xl my-5'>{isArabic?' اضافة منتحات ':'Add Products'}</h1>
         <AddProducts/>
    </div>
  )
}

export default page
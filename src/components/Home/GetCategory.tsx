'use client'
import React, { useEffect, useState } from 'react'
import BaseUrl from '../BaseUrl'
import axios from 'axios'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Category {
  _id: string;
  name: string;
  image: { url: string };
}

const GetCategory = () => {
  const [category, setCategory] = useState<Category[]>([])

  useEffect(() => {
    axios.get(`${BaseUrl}/api/vi/category`)
      .then((data) => {
        console.log(data.data)
        setCategory(data.data.slice(0, 4)) // عرض فقط أول 4 فئات
      })
  }, [])

  return (
    <div className="flex flex-wrap gap-5 justify-center">
      {category.map((item, index) => (
        <Link key={item._id} href={`/products/${item._id}`}>
          <motion.div
            className="w-[350px] h-28 bg-cover bg-center rounded-2xl shadow-md flex items-center justify-center text-white text-lg font-bold"
            style={{ backgroundImage: `url(${item.image.url})` }}
            initial={{ opacity: 0, y: 20 }}  // يبدأ العنصر شفافًا وقليل الحركة
            whileInView={{ opacity: 1, y: 0 }}   // يصبح العنصر واضحًا ويصل إلى مكانه
            transition={{ delay: index * 0.2, type: 'spring', stiffness: 100 }} // التأخير بين العناصر مع حركة لينة
          >
            <div className="text-4xl font-black">
              {item.name}
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}

export default GetCategory

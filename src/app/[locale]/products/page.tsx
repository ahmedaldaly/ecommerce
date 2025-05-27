'use client'
import BaseUrl from '@/components/BaseUrl'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Product {
  _id: string;
  desc: string;
  title: string;
  category: string;
  price: number;
  sale: number;
  image: { url: string }[];
  review: number;
  src: string;
}

const Page = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [product, setProduct] = useState<Product[]>([]);
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<Product[]>(`${BaseUrl}/api/vi/search`);
        console.log(data);
        setProduct(data);

        // ✅ تعيين الصورة الافتراضية لكل منتج عند تحميل البيانات
        const initialIndexes: Record<string, number> = {};
        data.forEach((item) => {
          initialIndexes[item._id] = 0;
        });
        setImageIndexes(initialIndexes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  const handleMouseEnter = (id: string) => {
    setImageIndexes((prev) => ({ ...prev, [id]: 1 }));
  };

  const handleMouseLeave = (id: string) => {
    setImageIndexes((prev) => ({ ...prev, [id]: 0 }));
  };

  return (
    <div className='min-h-[100vh] w-full flex flex-col items-center pt-24'>
      <h1 className='text-3xl font-bold mb-6'>{isArabic ? "جميع المنتجات" : "All Products"}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-6">
        {product.map((item) => (
          <Link key={item._id} href={`/products/product?id=${item._id}`}>
            <motion.div
              className="border-1 border-gray-300 shadow-md p-4 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
            >
              <motion.img
                onMouseEnter={() => handleMouseEnter(item._id)}
                onMouseLeave={() => handleMouseLeave(item._id)}
                src={item.image[imageIndexes[item._id] || 0]?.url}
                alt={item.title}
                className="w-full h-72 object-cover rounded-md cursor-pointer transition-all duration-300"
                whileHover={{ scale: 1.05 }} // تأثير تكبير الصورة عند التمرير عليها
              />
              <h2 className="text-lg font-semibold mt-2">{item.category}</h2>
              <h2 className="text-lg font-semibold mt-2">{item.title}</h2>
              <p className="text-gray-600">{isArabic ? "السعر" : "Price"}: ${item.price}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Page;

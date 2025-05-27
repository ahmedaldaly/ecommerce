'use client';
import BaseUrl from '@/components/BaseUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IoCloseCircleOutline } from "react-icons/io5";
import { motion } from 'framer-motion'; // استيراد framer-motion

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

const ProductPage = () => {
  const { id } = useParams(); // استخراج الـ id من الرابط
  const locale = useLocale();
  const isArabic = locale === 'ar';
   const [product, setProduct] = useState<Product[]>([]);
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get<Product[]>(`${BaseUrl}/api/vi/search/${id}`);
        console.log(data);
        setProduct(data);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const handleMouseEnter = (id: string) => {
    setImageIndexes((prev) => ({ ...prev, [id]: 1 }));
  };

  const handleMouseLeave = (id: string) => {
    setImageIndexes((prev) => ({ ...prev, [id]: 0 }));
  };

  return (
    <div className='min-h-[100vh] w-full flex flex-col items-center pt-24'>
      <motion.h1
        className='text-3xl font-bold mb-6'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {isArabic ? " تسوق الان" : "Shoping Now"}
      </motion.h1>

      {product.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-6'>
          {product.map((item) => (
            <Link key={item._id} href={`/products/product?id=${item._id}`}>
              <motion.div
                className="border-1 border-gray-300 shadow-md p-4 rounded-lg text-center"
                whileHover={{ scale: 1.05 }} // تأثير تكبير عند التمرير
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  onMouseEnter={() => handleMouseEnter(item._id)}
                  onMouseLeave={() => handleMouseLeave(item._id)}
                  src={item.image[imageIndexes[item._id] || 0]?.url}
                  alt={item.title}
                  className="w-full h-72 object-center object-cover rounded-md cursor-pointer transition-all duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.h2
                  className="text-lg font-semibold mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {item.category}
                </motion.h2>
                <motion.h2
                  className="text-lg font-semibold mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {item.title}
                </motion.h2>
                <motion.p
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {isArabic ? "السعر" : "Price"}: ${item.price}
                </motion.p>
              </motion.div>
            </Link>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-[50vh] w-full'>
          <Link href='/' className='flex flex-col items-center justify-center'>
            <IoCloseCircleOutline className='text-8xl text-gray-500' />
            <p className='text-2xl text-gray-600 mt-4'>{isArabic ? "لا يوجد منتجات" : "There are no products"}</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

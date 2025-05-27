"use client";
import BaseUrl from "@/components/BaseUrl";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CiSearch } from "react-icons/ci";
import { useLocale } from "next-intl";
import Link from "next/link";
import {motion} from 'framer-motion'
type FormData = {
  title: string;
};
type product = {
  title: string;
  _id: string;
  category:string;
  price:number;
  image: { url: string }[];
};

const page = () => {
  
  const [product, setProduct] = useState<product[]>([])
  const locale = useLocale()
  const isArabic = locale ==='ar'
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit((data) => {
   try{
    setProduct([]);
    const res =axios.post(`${BaseUrl}/api/vi/search`,{
      title:data.title
    }).then((data)=>{
      console.log(data.data)
    setProduct(data.data)
    })
   }catch(err){
    console.log('note found')
   }
  });
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({});
  const handleMouseEnter = (id: string) => {
    setImageIndexes((prev) => ({ ...prev, [id]: 1 }));
  };

  const handleMouseLeave = (id: string) => {
    setImageIndexes((prev) => ({ ...prev, [id]: 0 }));
  };
  return  <>
  
  <form className="w-full h-auto mt-24 flex justify-center gap-5 items-center" onSubmit={onSubmit}>
  <input className="w-96 h-12 border-1 border-gray-300 rounded-full px-5" placeholder={isArabic?'ادخل كلمة البحث':'Enter the search term'} {...register("title")} />
  <button className="w-8 h-8 max-sm:hidden rounded-full bg-gray-200  flex justify-center items-center cursor-pointer" type="submit" >
    <CiSearch/>
  </button>
</form>
<div className="w-full min-h-[70vh] flex gap-5 justify-center items-center">
{product.length > 0 ? (
  
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
                className="w-full h-auto object-cover rounded-md cursor-pointer transition-all duration-300"
                whileHover={{ scale: 1.05 }} // تأثير تكبير الصورة عند التمرير عليها
              />
              <h2 className="text-lg font-semibold mt-2">{item.category}</h2>
              <h2 className="text-lg font-semibold mt-2">{item.title}</h2>
              <p className="text-gray-600">{isArabic ? "السعر" : "Price"}: ${item.price}</p>
            </motion.div>
          </Link>
        ))}
      </div>
) : (
  <div>لا توجد منتجات متاحة</div>
)}

</div>

  </>
};

export default page;

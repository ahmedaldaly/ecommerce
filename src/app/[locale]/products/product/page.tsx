'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import BaseUrl from '@/components/BaseUrl';
import { FaStar, FaRegStar } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import cookie from 'js-cookie';

import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion'; // استيراد framer-motion

const Page = () => {
    interface Product {
        _id: string;
        category: string;
        desc: string;
        price: number;
        sale: number;
        review: number;
        title: string;
        image: { url: string }[];
    }

    const searchParams = useSearchParams();
    const [product, setProduct] = useState<Product[]>([]);

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            axios.get(`${BaseUrl}/api/vi/product/${id}`)
                .then((data) => {
                    console.log(data.data);
                    setProduct(data.data);
                });
        }
    }, [searchParams]);

    const add = async (id: string) => {
        const token = cookie.get('token');
        try {
            const product = await id;
            await axios.post(`${BaseUrl}/api/vi/order/add`, {
                product: product
            }, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            toast.success('Added to cart successfully');
        } catch (err) {
            console.log(err);
            toast.error('Failed to add to cart');
        }
    };

    // Slider Refs
    const sliderRef1 = useRef<Slider | null>(null);
    const sliderRef2 = useRef<Slider | null>(null);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-10">
            {product.length > 0 && (
                <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg p-8 max-w-5xl w-full">
                    {/* قسم الصور */}
                    <div className="w-full md:w-1/2 flex flex-col items-center">
                        {/* السلايدر الرئيسي */}
                        <Slider asNavFor={sliderRef2.current!} ref={sliderRef1} className="mb-4 w-full">
                            {product[0]?.image.map((img, index) => (
                                <div key={index} className="flex justify-center">
                                    <motion.img
                                        src={img.url}
                                        alt={`Product ${index}`}
                                        className="w-full h-[400px] object-cover rounded-lg"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            ))}
                        </Slider>

                        {/* السلايدر المصغر */}
                        <Slider
                            asNavFor={sliderRef1.current!}
                            ref={sliderRef2}
                            slidesToShow={3}
                            swipeToSlide={true}
                            focusOnSelect={true}
                            className="flex justify-center w-full"
                        >
                            {product[0]?.image.map((img, index) => (
                                <div key={index} className="px-2">
                                    <img
                                        src={img.url}
                                        alt={`Thumbnail ${index}`}
                                        className="w-20 h-20 object-cover cursor-pointer border border-gray-300 rounded-md hover:scale-105 transition"
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>

                    {/* قسم تفاصيل المنتج */}
                    <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                        {/* عنوان المنتج والسعر */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h1 className="text-3xl font-bold">{product[0].title}</h1>
                            <p className="text-xl text-gray-700 font-semibold mt-2">${product[0].price}</p>

                            {/* تقييم المنتج */}
                            <div className="flex items-center mt-2 space-x-1 text-yellow-500">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    index < product[0].review ? <FaStar key={index} /> : <FaRegStar key={index} />
                                ))}
                            </div>
                        </motion.div>

                        {/* وصف المنتج */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-gray-600 text-sm leading-relaxed mt-4"
                        >
                            {product[0].desc}
                        </motion.p>

                        {/* زر الإضافة إلى السلة */}
                        <motion.button
                            onClick={() => add(product[0]._id)}
                            className="w-full cursor-pointer h-12 bg-black text-white font-semibold text-lg rounded-md hover:bg-gray-900 transition"
                            whileHover={{ scale: 1.05 }} // تأثير عند التمرير على الزر
                        >
                            Add to Cart
                        </motion.button>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Page;

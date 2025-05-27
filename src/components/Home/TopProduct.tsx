'use client'
import React, { useState, useEffect } from 'react'
import BaseUrl from '../BaseUrl'
import { IoIosArrowForward } from "react-icons/io";
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Product {
    _id: string;
    title: string;
    image: { url: string }[];
}

const TopProduct = () => {
    const [data, setData] = useState<Product[]>([]) // لحفظ المنتجات
    const [loading, setLoading] = useState(true) // لمعرفة إذا كانت البيانات تُحمَّل

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${BaseUrl}/api/vi/search/67e73e03f936f0e8465f2546`)
                const result = await res.json()
                setData(result.slice(0, 4)) // عرض فقط أول 4 منتجات
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) return <div className="w-[350px] h-[350px] blur-md bg-gray-200 rounded-2xl mx-auto border-1 border-gray-300 shadow-md">جارِ التحميل...</div>

    return (
        <div className='flex justify-center gap-5 my-5 flex-wrap'>
            {data.length > 0 ? (
                data.map((item) => <ProductCard key={item._id} item={item} />)
            ) : (
                <p className="">لا توجد منتجات متاحة.</p>
            )}
        </div>
    )
}

const ProductCard = ({ item }: { item: Product }) => {
    const [imageIndex, setImageIndex] = useState(0)

    return (
        <motion.div
            className='w-[350px] h-[380px] max-sm:w-[300px] flex flex-col items-center p-5 border border-gray-200 shadow-md transition-transform rounded-2xl hover:scale-105 duration-300'
            onMouseEnter={() => item.image.length > 1 && setImageIndex(1)}
            onMouseLeave={() => setImageIndex(0)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
        >
            <div
                className='w-[320px] max-sm:w-[280px] rounded-xl h-[300px] bg-cover bg-center transition-all duration-300'
                style={{
                    backgroundImage: `url(${item.image[imageIndex]?.url || '/placeholder.png'})`
                }}
            ></div>
            <Link href='/products' className='my-2 text-xl flex gap-5 items-center hover:text-blue-500 transition-colors'>
                {item.title}
                <span className='w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-all duration-300'>
                    <IoIosArrowForward />
                </span>
            </Link>
        </motion.div>
    )
}

export default TopProduct

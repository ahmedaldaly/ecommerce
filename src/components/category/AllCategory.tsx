'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import BaseUrl from '../BaseUrl'
import cookie from 'js-cookie'
import { useLocale } from 'next-intl'
const AllCategory = () => {
    interface category {
_id:string;
name:string;
image:{url:string}
    }
    const locale = useLocale();
    const isArabic = locale === "ar";
    const [category, setCategory] = useState<category[]>([])
    useEffect(()=>{
      try{
        axios.get(`${BaseUrl}/api/vi/category`)
        .then((data)=>{
            setCategory(data.data)
            console.log(data.data)})
      }catch(err){console.log(err)}
    },[])
    
    const delet = async (id: any)=>{
        const token = cookie.get('token')
       try{
        await axios.delete(`${BaseUrl}/api/vi/category/${id}`,{
            headers:{
                authorization: `Berer ${token}`
            }
        })
        setCategory((prevUsers) => prevUsers.filter((category) => category._id !== id));
       }catch(err){console.log(err)}
        
    }
  return (
    <div>
        {category.length> 0 ? (
            category.map((item)=>(
                <div className='w-[500px] my-5 flex justify-between items-center mx-auto h-44 hover:scale-105 duration-200 max-sm:w-[300px] shadow-md border-gray-300 rounded-2xl' key={item._id}>
                    <img className='h-full rounded-2xl w-40  object-cover object-center' src={item.image.url} alt="" />
                    {/*  */}
                    <div className='mx-10'>
                    <h1 className='my-5'>{item.name}</h1>
                    <button onClick={()=>delet(item._id)} className='w-32 max-sm:w-20 h-11 border-1 border-gray-300 shadow-md rounded-2xl cursor-pointer hover:scale-105 hover:shadow-xl'>
                        
                   {isArabic?'حذف':'delete'}
                    </button>
                    </div>
                </div>
            ))
        ):<div>Loading</div>}
    </div>
  )
}

export default AllCategory
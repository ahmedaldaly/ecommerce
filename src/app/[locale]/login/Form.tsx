"use client";
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import BaseUrl from "@/components/BaseUrl";
import {  useLocale } from "next-intl";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import cookie  from 'js-cookie'
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
type FormData = {
  email: string;
  passwoard: string;
};
const Form = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios
        .post(`${BaseUrl}/api/vi/auth/login`, {
          email: data.email,
          passwoard: data.passwoard, // سيتم إصلاحها في الخطوة التالية
        }).then((data)=>{
          cookie.set('token',data.data.token)
        
        })
       await toast.success('Login Success')
       
       window.location.href ='/'
        
    } catch (err) {
        toast.error('worng username or password')
      console.log(err);
    }
  });
  const locale = useLocale(); // الحصول على اللغة الحالية
  const isArabic = locale === "ar"; // تحديد ما إذا كانت اللغة العربية
  return (
    <form onSubmit={onSubmit}>
      <label>{isArabic ? "الايميل" : "Email:"}</label>
      <input
      placeholder={isArabic?'ادخل الايميل...':'enter your email ....'}
        className="w-full h-11 border-1 px-5 border-gray-300 rounded-xl shadow-md"
        type="email"
        {...register("email")}
      />
      <label >{isArabic ? "كلمة المرور" : "Password:"}</label>
      <input
      placeholder={isArabic?'ادخل كلمة المرور...':'enter your password...'}
        className="w-full h-11 border-1 px-5 border-gray-300 rounded-xl shadow-md"
        type="password"
        {...register("passwoard")}
      />
      <button className="w-full h-11 text-center border-1 hover:scale-105 hover:shadow-xl duration-300 border-gray-200 mt-10 rounded-xl cursor-pointer bg-gray-100" type="submit">{isArabic ? "دخول" : "Log In"}</button>
      <ToastContainer position="top-right" autoClose={3000} />
      <Link className="text-blue-700" href='/register'>{isArabic?"انشاء حساب":"/ Create Acount"}</Link>
      <Link className="w-44 h-12 border-1 shadow-md flex justify-center items-center border-gray-200 my-5 mx-auto gap-2 hover:scale-105 hover:shadow-xl duration-300"
       href={`${BaseUrl}/api/vi/auth/google`}><FaGoogle/>{isArabic?"عبر جوجل":"Google"}</Link>
    </form>

  );
};

export default Form;

// ahmed2005@gmail.com
// Ahmed@2005

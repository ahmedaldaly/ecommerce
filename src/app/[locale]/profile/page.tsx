'use client';
import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import cookie from 'js-cookie';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      cookie.set('token', token, { expires: 7 }); // تخزين الـ token في الـ cookies
      console.log('Token saved:', token);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        {/* علامة الصح الخضراء */}
        <svg
          className="w-24 h-24 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          تم تسجيل الدخول بنجاح
        </h1>
        {/* زر العودة إلى الصفحة الرئيسية */}
        <a
          href="/"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          العودة إلى الصفحة الرئيسية
        </a>
      </div>
    </div>
  );
};

export default Page;
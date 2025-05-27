'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import BaseUrl from '../BaseUrl'
import { useTranslations, useLocale } from "next-intl";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import cookie from 'js-cookie'
const User = () => {
  interface user {
    _id:string;
    email:string;
    isAdmin:boolean;
    username:string;
  }
     const locale = useLocale();
        const isArabic = locale === "ar";
    const [user, setUser] = useState<user[]>([])
    const token =cookie.get ('token')
    useEffect(()=>{
        try{
            axios.get(`${BaseUrl}/api/vi/users`,{
              headers:{
                authorization:`Berere ${token}`
              }
            })
            .then((data)=>{
                console.log(data.data.data)
                setUser(data.data.data)
            })
        }catch(err){console.log(err)}
    },[])
    const delet = async(id:any)=>{
        try{
            await axios.delete(`${BaseUrl}/api/vi/users/${id}`,{
              headers:{
                authorization:`Berere ${token}`
              }
            })
            setUser((prevUsers) => prevUsers.filter((user) => user._id !== id));
        }catch(err){console.log(err)}
    }
    async function edit(id:string ,admin:boolean) {
        try {
          await axios.put(`${BaseUrl}/api/vi/users/${id}`,{
            isAdmin:!admin,
          },{
            headers:{
              authorization:`Berere ${token}`
            }
          });

          setUser((prevUsers) =>
            prevUsers.map((user) =>
              user._id === id ? { ...user, isAdmin: !admin } : user
            )
          );
     // تحديث الحالة
        } catch (err) {
          console.log(err);
        }
      }
      return (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? "البريد الالكتروني" : "Email"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? "اسم المستخدم" : "Username"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? "مسئول" : "Admin"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isArabic ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {user.length > 0 ? (
                user.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${item.isAdmin ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {item.isAdmin ? (isArabic ? "مسئول" : "Admin") : (isArabic ? "مستخدم" : "User")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => delet(item._id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          aria-label={isArabic ? "حذف" : "Delete"}
                        >
                          <MdDelete size={20} />
                        </button>
                        <button
                          onClick={() => edit(item._id, item.isAdmin)}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                          aria-label={isArabic ? "تعديل" : "Edit"}
                        >
                          <MdOutlineModeEdit size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Loading skeleton when no users
                <>
                  {[...Array(3)].map((_, index) => (
                    <tr key={`skeleton-${index}`} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      {isArabic ? "جاري تحميل البيانات..." : "Loading user data..."}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      );
}

export default User
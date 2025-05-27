'use client'
import BaseUrl from '@/components/BaseUrl'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import cookie from 'js-cookie'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { MdModeEditOutline, MdDeleteForever } from "react-icons/md";

const page = () => {
  interface Product {
    id: string;
    desc: string;
    title: string;
    address: string;
    category: string;
    price: number;
    quantity: number;
    sale: number;
    image: { url: string }[];
    review: number;
    src: string;
  }

  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [products, setProducts] = useState<Product[]>([]);
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editedQuantity, setEditedQuantity] = useState<number>(0);
  const [editedAddress, setEditedAddress] = useState<string>("");

  useEffect(() => {
    const token = cookie.get('token');
    axios.get(`${BaseUrl}/api/vi/order/userorder`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((data) => {
      setProducts(data.data);
    });
  }, []);

  const handleMouseEnter = (id: string) => {
    setImageIndexes((prev) => ({ ...prev, [id]: 1 }));
  };

  const handleMouseLeave = (id: string) => {
    setImageIndexes((prev) => ({ ...prev, [id]: 0 }));
  };

  const deleteProduct = async (id: string) => {
    const token = cookie.get('token');
    try {
      await axios.delete(`${BaseUrl}/api/vi/order/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setProducts((prevProducts) => prevProducts.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ فتح نافذة التعديل
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditedQuantity(product.quantity);
    setEditedAddress(product.address);
  };

  // ✅ تحديث الطلب في API
  const updateProduct = async () => {
    if (!selectedProduct) return;

    const token = cookie.get('token');
    try {
      await axios.put(`${BaseUrl}/api/vi/order/${selectedProduct.id}`, {
        quantity: editedQuantity,
        address: editedAddress,
      }, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // ✅ تحديث القائمة بدون إعادة تحميل الصفحة
      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item.id === selectedProduct.id ? { ...item, quantity: editedQuantity, address: editedAddress } : item
        )
      );

      // ✅ إغلاق المودال
      setSelectedProduct(null);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ حساب المجموع الكلي للسعر (السعر * الكمية)
  const totalPrice = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
console.log(totalPrice)
const pay = async () => {
  const token = cookie.get('token');

  try {
    const response = await axios.post(`${BaseUrl}/api/v1/paypal/pay`, 
      { 
        totalAmount: totalPrice // ✅ إرسال البيانات في الجسم (Body)
      },
      {
        headers: { // ✅ إرسال التوكن في الهيدر
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.redirectUrl) {
      window.location.href = response.data.redirectUrl; // ✅ تحويل المستخدم إلى صفحة الدفع
    }
  } catch (error) {
    console.error("Payment error:", error);
  }
};

  return (
    <div className="w-full min-h-[100vh] pt-22">
      <h1 className="w-full text-3xl text-center">
        {isArabic ? "مشترياتك" : 'Your Orders'}
      </h1>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-6">
            {products.map((item) => (
              <div key={item.id}>
                <motion.div
                  className="border-1 border-gray-300 shadow-md p-4 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
                >
                  <motion.img
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={() => handleMouseLeave(item.id)}
                    src={item.image[imageIndexes[item.id] || 0]?.url}
                    alt={item.title}
                    className="w-full h-auto object-cover rounded-md cursor-pointer transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                  <h2 className="text-lg font-semibold mt-2">{item.category}</h2>
                  <h2 className="text-lg font-semibold mt-2">{item.title}</h2>
                  <p className="text-gray-600">{isArabic ? "السعر" : "Price"}: ${item.price}</p>
                  <p className="text-gray-600">{isArabic ? "الكمية" : "Quantity"}: {item.quantity}</p>
                  <p className="text-gray-600">{isArabic ? "العنوان" : "Address"}: {item.address}</p>

                  <div className="w-full flex justify-between mt-3">
                    <div 
                      onClick={() => deleteProduct(item.id)} 
                      className="text-xl w-8 h-8 border border-gray-200 rounded-full flex justify-center items-center cursor-pointer hover:scale-105 hover:shadow-md duration-300 hover:text-red-600">
                      <MdDeleteForever />
                    </div>
                    <div 
                      onClick={() => openEditModal(item)}
                      className="text-xl w-8 h-8 border border-gray-200 rounded-full flex justify-center items-center cursor-pointer hover:scale-105 hover:shadow-md duration-300 hover:text-green-600">
                      <MdModeEditOutline />
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="w-full text-center flex-wrap mt-6 text-2xl font-semibold text-gray-700">
           
            <button onClick={()=>pay()} className=' w-[30%] max-md:w-[60%] my-5 h-14 bg-blue-600 mx-auto text-green-300 rounded-full cursor-pointer hover:shadow-md hover:shadow-blue-200 hover:scale-105 duration-300'>${totalPrice.toFixed(2)}</button>
          </div>
        </>
      ) : (
        <div className="w-full text-center text-4xl mt-20 text-gray-300">
          {isArabic ? "ليس لديك أي طلبات" : "You don't have any requests"}
        </div>
      )}

      {/* ✅ المودال الخاص بالتعديل */}
      {selectedProduct && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl mb-4">{isArabic ? "تعديل الطلب" : "Edit Order"}</h2>
            <input type="text" value={editedAddress} onChange={(e) => setEditedAddress(e.target.value)} className="border p-2 w-full mb-2"/>
            <input type="number" value={editedQuantity} onChange={(e) => setEditedQuantity(Number(e.target.value))} className="border p-2 w-full"/>
            <button onClick={updateProduct} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">حفظ</button>
          </div>
        </div>
      )}
    
    </div>
  );
};

export default page;

"use client";
import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import axios from "axios";
import BaseUrl from "../BaseUrl";
import cookie from "js-cookie";
import { ToastContainer, toast } from "react-toastify";

// تعريف الواجهة الخاصة بالبيانات
interface ProductData {
  title: string;
  desc: string;
  category: string;
  price: number;
  review: number;
  sale: number;
  image: FileList;
}

// تعريف الواجهة الخاصة بالتصنيفات
interface Category {
  _id: string;
  name: string;
}

const AddProducts = () => {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { register, handleSubmit, reset } = useForm<ProductData>();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category[]>([]);
  const [message, setMessage] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });

  const onSubmit = async (data: ProductData) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("category", data.category);
    formData.append("price", data.price.toString());
    formData.append("review", data.review.toString());
    formData.append("sale", data.sale.toString());

    // إضافة جميع الصور (يدعم رفع صور متعددة)
    Array.from(data.image).forEach((img) => {
      formData.append("image", img);
    });

    const token = cookie.get("token");
    try {
      await axios.post(`${BaseUrl}/api/vi/product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
      toast.success("added success");
      setMessage({
        type: "success",
        text: isArabic
          ? "تم إضافة المنتج بنجاح!"
          : "Product added successfully!",
      });
      reset(); // إعادة تعيين الفورم
    } catch (error) {
      toast.error("error");
      console.error("حدث خطأ أثناء الرفع:", error);
      setMessage({
        type: "error",
        text: isArabic
          ? "حدث خطأ أثناء الإرسال"
          : "An error occurred while uploading",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios.get(`${BaseUrl}/api/vi/category`).then((response) => {
      setCategory(response.data);
    });
  }, []);

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        {isArabic ? "إضافة منتج جديد" : "Add New Product"}
      </h2>

      {message.text && (
        <p
          className={`text-center p-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          {...register("title", { required: true })}
          placeholder={isArabic ? "عنوان المنتج" : "Product Title"}
          className="w-full p-2 border rounded"
        />

        <textarea
          {...register("desc", { required: true })}
          placeholder={isArabic ? "وصف المنتج" : "Product Description"}
          className="w-full p-2 border rounded"
        />

        <select
          {...register("category", { required: true })}
          className="w-full h-12 border border-gray-300 rounded-sm"
        >
          {category.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          {...register("price", { required: true })}
          placeholder={isArabic ? "السعر" : "Price"}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          {...register("review", { required: true })}
          placeholder={isArabic ? "التقييم (من 5)" : "Review (out of 5)"}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          {...register("sale", { required: true })}
          placeholder={isArabic ? "الخصم" : "Sale"}
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          {...register("image", { required: true })}
          multiple
          accept="image/*"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-800 transition"
          disabled={loading}
        >
          {loading
            ? isArabic
              ? "جاري الإرسال..."
              : "Uploading..."
            : isArabic
            ? "إضافة المنتج"
            : "Add Product"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddProducts;

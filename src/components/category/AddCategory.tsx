"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations, useLocale } from "next-intl";
import axios from "axios";
import BaseUrl from "../BaseUrl";
import cookei from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify';
type FormData = {
  name: string;
  image: FileList;
};
const AddCategory = () => {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
 
  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image.length > 0) {
      formData.append("image", data.image[0]); // رفع أول صورة فقط
    }

    try {
      const token = cookei.get('token')
      await axios.post(`${BaseUrl}/api/vi/category`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization:`Berere ${token}`
        },
      });
      toast.success('تم الاضافة بنجاح')
    } catch (error) {
      toast.error("حدث خطأ أثناء الإرسال");
    }
  });

  return  <form onSubmit={onSubmit} style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
  <div style={{ marginBottom: "15px" }}>
    <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>First Name</label>
    <input type="text" {...register("name")} style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
  </div>

  <div style={{ marginBottom: "15px" }}>
    <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Last Name</label>
    <input type="file" {...register("image")} style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
  </div>

  <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>
    Submit
  </button>
  <ToastContainer />
</form>

};

export default AddCategory;

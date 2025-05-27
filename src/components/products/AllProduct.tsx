'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import BaseUrl from '../BaseUrl'
import { useLocale } from 'next-intl'
import cookie from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'

// تعريف واجهة المنتج
interface Product {
    _id: string;
    title: string;
    desc: string;
    category: string;
    price: number;
    review: number;
    sale: number;
    image: { url: string }[];
}

const AllProduct = () => {
    const locale = useLocale();
    const isArabic = locale === 'ar';
    const [products, setProducts] = useState<Product[]>([]);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    // تحميل جميع المنتجات عند فتح الصفحة
    useEffect(() => {
        axios.get(`${BaseUrl}/api/vi/product`)
            .then((response) => {
                console.log(response.data);
                setProducts(response.data);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                toast.error(isArabic ? "فشل تحميل المنتجات" : "Failed to load products");
            });
    }, []);

    // حذف المنتج
    const deleteProduct = async (id: string) => {
        try {
            const token = cookie.get('token');
            await axios.delete(`${BaseUrl}/api/vi/product/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setProducts((prev) => prev.filter((p) => p._id !== id));
            toast.success(isArabic ? "تم الحذف بنجاح" : "Deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error(isArabic ? "فشل الحذف" : "Failed to delete");
        }
    };

    // فتح نافذة التعديل
    const handleEdit = (product: Product) => {
        setEditProduct(product);
    };

    // حفظ التعديلات
    const handleUpdate = async () => {
        if (!editProduct) return;
        try {
            const token = cookie.get('token');
            await axios.put(`${BaseUrl}/api/vi/product/${editProduct._id}`, editProduct, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setProducts((prev) =>
                prev.map((p) => (p._id === editProduct._id ? editProduct : p))
            );
            toast.success(isArabic ? "تم التحديث بنجاح" : "Updated successfully");
            setEditProduct(null);
        } catch (err) {
            console.error(err);
            toast.error(isArabic ? "فشل التحديث" : "Failed to update");
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {products.map((p) => (
                <div key={p._id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
                    <img src={p.image[0]?.url || "/placeholder.jpg"} alt={p.title} className="w-full h-48 object-cover rounded-md" />
                    <div className="mt-3">
                        <h2 className="text-lg font-semibold">{p.title}</h2>
                        <p className="text-gray-500 text-sm">{p.category}</p>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-green-600 font-bold text-xl">${p.price}</span>
                            <span className="text-red-500 text-sm line-through">${p.price + p.sale}</span>
                        </div>
                        <div className="flex items-center mt-2">
                            {"⭐".repeat(p.review)}
                            <span className="text-gray-500 text-sm ml-2">({p.review})</span>
                        </div>
                        <button onClick={() => handleEdit(p)} className="w-full mt-3 bg-green-600 text-white py-2 rounded-md hover:bg-green-900 transition">
                            {isArabic ? 'تعديل' : 'Edit'}
                        </button>
                        <button onClick={() => deleteProduct(p._id)} className="w-full mt-3 bg-red-600 text-white py-2 rounded-md hover:bg-red-900 transition">
                            {isArabic ? 'حذف' : 'Delete'}
                        </button>
                    </div>
                </div>
            ))}

            {/* نافذة التعديل */}
            {editProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">{isArabic ? 'تعديل المنتج' : 'Edit Product'}</h2>
                        <input type="text" className="w-full p-2 border rounded mb-2" placeholder="Title"
                            value={editProduct.title} onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })} />
                        <input type="number" className="w-full p-2 border rounded mb-2" placeholder="Price"
                            value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })} />
                        <textarea className="w-full p-2 border rounded mb-2" placeholder="Description"
                            value={editProduct.desc} onChange={(e) => setEditProduct({ ...editProduct, desc: e.target.value })}></textarea>
                        <div className="flex justify-between">
                            <button onClick={handleUpdate} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800">
                                {isArabic ? 'حفظ' : 'Save'}
                            </button>
                            <button onClick={() => setEditProduct(null)} className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                                {isArabic ? 'إلغاء' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default AllProduct;

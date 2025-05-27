"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "js-cookie";
import BaseUrl from "@/components/BaseUrl";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";

interface Order {
  id: string;
  user: string;
  title: string;
  quantity: number;
  address: string;
  status?: string; // اختياري لأن البيانات الواردة لا تحتويه
  image: { url: string; public_id: string; _id: string }[];
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editedAddress, setEditedAddress] = useState("");
  const [editedQuantity, setEditedQuantity] = useState<number>(0);
  const [editedStatus, setEditedStatus] = useState("pending");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = cookie.get("token");
      const res = await axios.get(`${BaseUrl}/api/vi/order/`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data || []);
      console.log(res.data)
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const token = cookie.get("token");
      await axios.delete(`${BaseUrl}/api/vi/order/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setEditedAddress(order.address);
    setEditedQuantity(order.quantity);
    setEditedStatus(order.status || "pending");
  };

  const updateOrder = async () => {
    if (!selectedOrder) return;
    try {
      const token = cookie.get("token");
      await axios.put(
        `${BaseUrl}/api/vi/order/${selectedOrder.id}`,
        {
          address: editedAddress,
          quantity: editedQuantity,
          status: editedStatus,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      ).then((data)=>console.log(data.data))
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, address: editedAddress, quantity: editedQuantity, status: editedStatus }
            : order
        )
      );
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="w-full min-h-screen p-6 pt-24">
      <h1 className="text-3xl font-bold text-center">إدارة الطلبات</h1>
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {orders.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                {item.image.length > 0 && (
                  <img
                    src={item.image[0].url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-600">المستخدم: {item.user}</p>
                <p className="text-gray-600">الكمية: {item.quantity}</p>
                <p className="text-gray-600">العنوان: {item.address}</p>
                {item.status && <p className="text-gray-600">الحالة: {item.status}</p>}
                
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <MdModeEditOutline size={24} />
                  </button>
                  <button
                    onClick={() => deleteOrder(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdDeleteForever size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">لا يوجد طلبات حاليًا.</p>
      )}

      {selectedOrder && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">تعديل الطلب</h2>
            <label className="block text-gray-600">العنوان</label>
            <input
              type="text"
              value={editedAddress}
              onChange={(e) => setEditedAddress(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <label className="block text-gray-600">الكمية</label>
            <input
              type="number"
              value={editedQuantity}
              onChange={(e) => setEditedQuantity(Number(e.target.value))}
              className="border p-2 w-full"
            />
            <label className="block text-gray-600">الحالة</label>
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              className="border p-2 w-full mb-2"
            >
              <option value="pending">قيد التنفيذ</option>
              <option value="delivered">مكتملة</option>
              <option value="shipped">تم الشحن</option>
            </select>
            <div className="flex justify-between mt-4">
              <button onClick={updateOrder} className="bg-green-500 text-white px-4 py-2 rounded">
                حفظ التغييرات
              </button>
              <button onClick={() => setSelectedOrder(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
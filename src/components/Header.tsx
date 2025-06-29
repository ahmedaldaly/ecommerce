"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FiUser } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { LuShoppingCart } from "react-icons/lu";
import { useTranslations, useLocale } from "next-intl";
import { RiMenu2Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import cookie from "js-cookie";
import { CiLogout } from "react-icons/ci";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import axios from "axios";
import BaseUrl from "./BaseUrl";
import { IoMdArrowDropdown } from "react-icons/io";

export default function LanguageSwitcher() {
  interface User {
    username: string;
    isAdmin: boolean;
  }

  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [menu, setMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [adminMenu, setAdminMenu] = useState(false);
  const [admin, setAdmin] = useState(false);
  const currentLang = pathname.split("/")[1];
  const newLang = currentLang === "en" ? "ar" : "en";
  const [token, setToken] = useState('');

  const toggleLanguage = () => {
    const newPath = `/${newLang}${pathname.slice(3)}`;
    startTransition(() => {
      router.push(newPath);
    });
  };

  const locale = useLocale();
  const isArabic = locale === "ar";

  // Animation variants
  const containerVariants = {
    hidden: { y: -60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    expanded: {
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    collapsed: {
      height: 64,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
    exit: { opacity: 0, y: -20 },
  };

  useEffect(() => {
    const token = cookie.get('token');
    if (token) {
      setToken(token);
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${BaseUrl}/api/vi/users/token`, {
            headers: {
              authorization: `Bearer ${token}`
            }
          });
          setUser(response.data.data);
          setAdmin(response.data.data.isAdmin);
        } catch (err) {
          console.log(err);
        }
      };
      fetchUser();
    }
  }, []);

  const delet = async () => {
    await cookie.remove("token");
    await cookie.remove("Admin");
    window.location.href = "/";
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate={["visible", menu ? "expanded" : "collapsed"]}
        variants={containerVariants}
        className={`w-[95%] flex-wrap max-xl:p-5 px-10 items-center justify-between rounded-3xl shadow-md fixed top-5 flex border-1 border-gray-300 z-10 left-[2.5%] bg-white overflow-hidden`}
      >
        <Link href='/'><img src="/png.png" className="w-22" alt="logo" /></Link>

        <div className="flex justify-center items-center gap-5 group max-xl:hidden">
          <Link
            href="/products/67e73e03f936f0e8465f2546"
            className="transition-opacity duration-300 hover:scale-105 max-xl:text-sm group-hover:opacity-50 hover:opacity-100"
          >
            {isArabic ? "الاكثر مبيعا" : "Best Sellers"}
          </Link>
          <Link
            href="/products/67e69aba1b63f6d7d0bf4534"
            className="transition-opacity duration-300 hover:scale-105 max-xl:text-sm group-hover:opacity-50 hover:opacity-100"
          >
            {isArabic ? "اكسسوارات" : "Accessories"}
          </Link>
          <Link
            href="/products/67e74651f936f0e8465f257a"
            className="transition-opacity duration-300 hover:scale-105 max-xl:text-sm group-hover:opacity-50 hover:opacity-100"
          >
            {isArabic ? "ساعة أبل" : "Apple Watch"}
          </Link>
          <Link
            href="/products/67e69c1d1b63f6d7d0bf453a"
            className="transition-opacity duration-300 hover:scale-105 max-xl:text-sm group-hover:opacity-50 hover:opacity-100"
          >
            {isArabic ? "شاحن" : "Charging"}
          </Link>
          <Link
            href="/products/67e69c1d1b63f6d7d0bf453a"
            className="transition-opacity duration-300 hover:scale-105 max-xl:text-sm group-hover:opacity-50 hover:opacity-100"
          >
            {isArabic ? "محافظ" : "Tracking "}
          </Link>
          <Link
            href="/products/67ebd1923d753b3a3dcf5d3b"
            className="transition-opacity duration-300 hover:scale-105 max-xl:text-sm group-hover:opacity-50 hover:opacity-100"
          >
            {isArabic ? "خصومات" : "Discounts"}
          </Link>
        </div>

        <div className="flex justify-center items-center gap-5 group">
          <div className="transition-opacity duration-300 hover:scale-105 group-hover:opacity-50 hover:opacity-100">
            {token ? (
              <div className="flex justify-center items-center">
                <div className="border-r-1 p-1">{user?.username}</div>
                <div onClick={() => setUserMenu(!userMenu)} className="cursor-pointer"><IoMdArrowDropdown /></div>
              </div>
            ) : (
              <Link href="/login">
                <FiUser />
              </Link>
            )}
          </div>

          <Link href='/search' className="transition-opacity duration-300 hover:scale-105 group-hover:opacity-50 hover:opacity-100">
            <GoSearch />
          </Link>

          <div onClick={() => setMenu(!menu)} className="hidden max-xl:block">
            {menu ? <IoMdClose /> : <RiMenu2Fill />}
          </div>
        </div>

        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full xl:hidden"
            >
              {[
                {
                  title: isArabic ? "اسكسسوارات" : "Cover",
                  a: '/products/67e69aba1b63f6d7d0bf4534',
                  img: "https://cdn.shopify.com/s/files/1/0384/6721/files/iphone16.jpg?v=1742420460&width=400&height=400&crop=center",
                },
                {
                  title: isArabic ? "ساعات ابل" : "Apple Watch",
                  a: '/products/67e74651f936f0e8465f257a',
                  img: "https://cdn.shopify.com/s/files/1/0384/6721/files/aw_b6c5f2be-841b-4a70-9317-01f533f494fe.jpg?v=1742421299&width=400&height=400&crop=center",
                },
                {
                  title: isArabic ? "الشواحن" : "Charging",
                  a: '/products/67e69c1d1b63f6d7d0bf453a',
                  img: "https://cdn.shopify.com/s/files/1/0384/6721/files/som_2fabbeba-ab79-4fc1-826f-8aed94b4b3a9.jpg?v=1742420460&width=400&height=400&crop=center",
                },
                {
                  title: isArabic ? "محافظ" : "Wallets",
                  a: '/products/67e69c1d1b63f6d7d0bf453a',
                  img: "https://cdn.shopify.com/s/files/1/0384/6721/files/bifold.jpg?v=1742420460&width=400&height=400&crop=center",
                },
                {
                  title: isArabic ? "العروض" : "Sale",
                  a: '/products/67ebd1923d753b3a3dcf5d3b',
                  img: "https://cdn.shopify.com/s/files/1/0384/6721/files/findmy_2ac5454b-587c-4bc1-b758-93eac01128f1.jpg?v=1742420460&width=400&height=400&crop=center",
                },
                {
                  title: isArabic ? "الاكثر مبيعا" : "Best Sellers",
                  a: '/products/67e73e03f936f0e8465f2546',
                  img: "https://cdn.shopify.com/s/files/1/0384/6721/files/ip13.jpg?v=1742420460&width=400&height=400&crop=center",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="cursor-pointer my-3 hover:scale-105 duration-300 mx-auto w-[80%] h-20 shadow-md rounded-xl border-1 border-gray-300 flex justify-between items-center px-5"
                >
                  <Link href={item.a} onClick={()=>setMenu(!menu)} className="flex gap-3 items-center">
                    <img
                      className="w-14 rounded-md"
                      src={item.img}
                      alt={item.title}
                    />
                    <p className="font-black">{item.title}</p>
                  </Link>
                  <div>
                    {isArabic ?<Link href={item.a}> <IoIosArrowBack /></Link> : <Link href={item.a}><IoIosArrowForward /></Link>}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {adminMenu && (
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 300 : -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isArabic ? 300 : -300 }}
            transition={{ duration: 0.2 }}
            className={`w-48 h-full fixed ${isArabic ? 'right-0' : 'left-0'} top-0 shadow-md bg-white px-5 z-20 text-wrap`}
          >
            <div onClick={() => setAdminMenu(!adminMenu)}
              className="text-2xl ml-32 mt-5 hover:text-blue-400"
            >
              <IoMdClose />
            </div>
            <div onClick={() => setAdminMenu(!adminMenu)} className="w-full h-10 border-b-1 hover:scale-105 duration-300 my-3">
              <Link href='/user'>{isArabic ? "ادارة المستخدمين" : "User Management"}</Link>
            </div>
            <div onClick={() => setAdminMenu(!adminMenu)} className="w-full h-10 border-b-1 hover:scale-105 duration-300 my-3">
              <Link href='/allcategory'>{isArabic ? "ادارة الفئات" : "Category Management"}</Link>
            </div>
            <div onClick={() => setAdminMenu(!adminMenu)} className="w-full h-10 border-b-1 hover:scale-105 duration-300 my-3">
              <Link href='/addcategory'>{isArabic ? "اضافة فئات" : "Add Categories"}</Link>
            </div>
            <div onClick={() => setAdminMenu(!adminMenu)} className="w-full h-10 border-b-1 hover:scale-105 duration-300 my-3">
              <Link href='/allproduct'>{isArabic ? "ادارة المنتجات" : "Product Management"}</Link>
            </div>
            <div onClick={() => setAdminMenu(!adminMenu)} className="w-full h-10 border-b-1 hover:scale-105 duration-300 my-3">
              <Link href='/addproduct'>{isArabic ? "اضافة منتجات" : "Add Products"}</Link>
            </div>
            <div onClick={() => setAdminMenu(!adminMenu)} className="w-full h-10 border-b-1 hover:scale-105 duration-300 my-3">
              <Link href='/allorder'>{isArabic ? "ادارة الطلبات" : "Order Management"}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {userMenu && (
          <motion.div
            initial={{ opacity: 0, y: -300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -300 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-20 px-2 top-22 ${isArabic ? 'left-28' : 'right-28'} w-44 h-48 rounded-md border-1 border-gray-300 shadow-md bg-white`}
          >
            <div onClick={() => {
              delet()
              setUserMenu(!userMenu)
            }} className="w-full rounded-md hover:scale-105 duration-300 hover:shadow-md h-10 my-1.5 flex justify-center items-center gap-2 border-1 cursor-pointer border-gray-300 ">
              <CiLogout />{isArabic ? "تسجيل الخروج" : "Log out"}
            </div>

            {user?.isAdmin && (
              <div onClick={() => {
                setAdminMenu(!adminMenu)
                setUserMenu(!userMenu)
              }} className="w-full rounded-md hover:scale-105 duration-300 hover:shadow-md h-10 my-1.5 flex justify-center items-center gap-2 cursor-pointer border-1 border-gray-300 ">
                <MdOutlineAdminPanelSettings />{isArabic ? "لوحة المسئول" : "Admin menu"}
              </div>
            )}

            <div
              className="w-full rounded-md hover:scale-105 duration-300 hover:shadow-md h-10 my-1.5 flex justify-center items-center gap-2 cursor-pointer border-1 border-gray-300"
              onClick={toggleLanguage}
            >
              {newLang.toUpperCase()}
            </div>

            <Link href='/order' onClick={() => {
              setUserMenu(!userMenu)
            }} className="w-full rounded-md hover:scale-105 duration-300 hover:shadow-md h-10 my-1.5 flex justify-center items-center gap-2 cursor-pointer border-1 border-gray-300 ">
              <LuShoppingCart />{isArabic ? "الطلبات" : "Orders"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

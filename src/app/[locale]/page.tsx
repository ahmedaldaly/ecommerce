import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import GetCategory from "@/components/Home/GetCategory";
import TopProduct from "@/components/Home/TopProduct";

export default function Page() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("HomePage");

  return (
    <div className="w-full overflow-hidden text-center">
      <div
        className={`flex items-center  ${
          isArabic ? "justify-start" : "justify-end"
        } bg-cover bg-center max-md:h-[80vh] h-[100vh] w-full bg-no-repeat`}
        style={{
          backgroundImage: `url('https://cdn.shopify.com/s/files/1/0384/6721/files/mlb_desktop_1a28dade-7e8b-45ae-90a8-983418bda74a.jpg?v=1742840211&width=2000&height=999&crop=center')`,
        }}
      >
        <div className="mx-24 max-md:mx-14">
          <h1 className="text-6xl font-bold  title text-white">{t("welcome")}</h1>
          <h1 className="text-6xl title max-md:text-5xl font-bold text-white">
            {t("h1")}
          </h1>
          <p className="text-2xl title font-bold text-white">{t("about")}</p>
          <Link href='/products'>
          <button className="w-32 h-12 mt-5 rounded-xl font-bold cursor-pointer bg-white text-black">
            {t("btn")}
          </button>
          </Link>
        </div>
      </div>
      <h1 className="text-center title text-4xl font-bold my-10">
        {isArabic ? "التسوق حسب الفئات" : "Shop by Category"}
      </h1>
      <GetCategory />
      <h1 className="text-center text-4xl font-bold my-14">
        {isArabic ? "المعدات الرائجة حاليًا " : "Currently Trending Gear"}
      </h1>
      <TopProduct />
      <button className="w-36 rounded-md hover:bg-black hover:text-white font-bold h-12 border-1 border-gray-200 shadow-md my-2">
        {isArabic ? "تسوق الان" : "Shop Now"}
      </button>
      <div className="w-[95%] max-md:w-[90%] max-md:h-[300px] max-sm:h-[300px] h-[500px] relative mx-auto">
        <video
          className="w-full h-full object-cover rounded-2xl"
          autoPlay
          muted
          playsInline
          loop
          src="https://checkout.nomadgoods.com/cdn/shop/videos/c/vp/79c811b03eb1410ba4d3904ab695f972/79c811b03eb1410ba4d3904ab695f972.HD-1080p-2.5Mbps-42019174.mp4"
        ></video>

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start px-16 bg-black/50 text-white  font-bold rounded-2xl">
          <div className={`${isArabic ? "text-right" : "text-left"}`}>
            <p className=" text-2xl  max-sm:text-sm font-bold ">
              {isArabic ? "الأول من نوعه" : "The First of its Kind"}
            </p>
            <h1 className="text-6xl max-md:text-4xl max-sm:text-2xl font-bold">
              {isArabic ? "كابل عالمي" : "Universal Cable"}
            </h1>
            <h1 className="text-6xl max-md:text-4xl max-sm:text-2xl font-bold">
              {isArabic ? "لساعة أبل" : "for Apple Watch"}
            </h1>
            <Link href="/products">
              {" "}
              <button className=" cursor-pointer w-32 h-11 rounded-2xl border-1 border-gray-300 bg-white text-black my-5">
                {isArabic ? "التسوق الان" : "Shop Now"}
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="w-full px-3 flex-wrap flex justify-center gap-3 my-5">
        <div className=" w-[450px] flex justify-center items-center h-[450] border-1 bg-cover bg-center border-gray-300 shadow-md rounded-xl bg-[url(https://cdn.shopify.com/s/files/1/0384/6721/files/magmer.jpg?v=1731520217&width=1000&height=1211&crop=center)]">
          <h1 className="text-4xl text-white font-bold">
            {isArabic ? "المنتجات الجدد" : "New Products"}
          </h1>
        </div>
        <div className=" w-[450px] flex justify-center items-center h-[450] border-1 bg-cover bg-center border-gray-300 shadow-md rounded-xl bg-[url(https://cdn.shopify.com/s/files/1/0384/6721/files/leth.jpg?v=1731519995&width=1000&height=1211&crop=center)]">
          <h1 className="text-4xl text-white font-bold">
            {isArabic ? " معدات جلدية" : "Leather equipment"}
          </h1>
        </div>
        <div className=" w-[450px] flex justify-center items-center h-[450] border-1 bg-cover bg-center border-gray-300 shadow-md rounded-xl bg-[url(https://cdn.shopify.com/s/files/1/0384/6721/files/overstock_786ff798-d52b-461c-9c8b-96e410168c7d.jpg?v=1731520130&width=1000&height=1211&crop=center)]">
          <h1 className="text-4xl text-white font-bold">
            {isArabic ? " افضل الخصومات" : "Best discounts "}
          </h1>
        </div>
      </div>
      <div className=" w-full my-5 text-center text-3xl px-5 max-sm:text-xl">
        <p className="my-10" >
          {isArabic
            ? "نصنع منتجات تُبقي الرحّال العصري مشحونًا، ومحميًا، ومنظمًا أثناء تنقلاته. التصميم الهادف والمواد اللازمة هما جوهر كل ما نقوم به."
            : "We create products to keep the modern nomad charged, protected, and organized on the go. Purposeful design and the requisite materials are at the core of everything we do."}
        </p>
        <h2 className="text-3xl my-5 font-bold">{isArabic?"احمد الدالي المؤسس والمشارك والرئيس التنفيذي":"- Ahmed Eldaly, Co-founder & CEO"}</h2>
      </div>
      {/*  */}
      <div className="w-full px-3 flex-wrap flex justify-center gap-3 my-10">
        <div className=" w-[350px] flex justify-center items-center h-[250] border-1 bg-cover bg-center border-gray-300 shadow-md rounded-xl bg-[url(https://cdn.shopify.com/s/files/1/0384/6721/files/Mobile_Navigation_Cards_-_Wallets.jpg?v=1731609241&width=200&height=49&crop=center%20200w,%20https://cdn.shopify.com/s/files/1/0384/6721/files/Mobile_Navigation_Cards_-_Wallets.jpg?v=1731609241&width=400&height=98&crop=center%20400w,%20https://cdn.shopify.com/s/files/1/0384/6721/files/Mobile_Navigation_Cards_-_Wallets.jpg?v=1731609241&width=600&height=147&crop=center%20600w,%20https://cdn.shopify.com/s/files/1/0384/6721/files/Mobile_Navigation_Cards_-_Wallets.jpg?v=1731609241&width=800&height=196&crop=center%20800w,%20https://cdn.shopify.com/s/files/1/0384/6721/files/Mobile_Navigation_Cards_-_Wallets.jpg?v=1731609241&width=1000&height=245&crop=center%201000w)]">
          <h1 className="text-4xl text-white font-bold">
            {isArabic ? " معدات نمط الحياة" : "Lifestyle equipment"}
          </h1>
        </div>
        <div className=" w-[350px] flex justify-center items-center h-[250] border-1 bg-cover bg-center border-gray-300 shadow-md rounded-xl bg-[url(https://cdn.shopify.com/s/files/1/0384/6721/files/iphone_14_042d33f6-09d7-4ff2-8761-1e251e4273de.jpg?v=1731523879&width=1400&height=972&crop=center)]">
          <h1 className="text-4xl text-white font-bold">
            {isArabic ? "  ايفون" : " IPhone"}
          </h1>
        </div>
        <div className=" w-[350px] flex justify-center items-center h-[250] border-1 bg-cover bg-center border-gray-300 shadow-md rounded-xl bg-[url(https://cdn.shopify.com/s/files/1/0384/6721/files/headphne.jpg?v=1731523879&width=1400&height=972&crop=center)]">
          <h1 className="text-4xl text-white font-bold">
            {isArabic ? "  سماعات بلتوث" : "Air pods "}
          </h1>
        </div>
        <div className=" w-[350px] flex justify-center items-center h-[250] border-1 bg-cover bg-center border-gray-300 shadow-md rounded-xl bg-[url(https://cdn.shopify.com/s/files/1/0384/6721/files/rugged_case.jpg?v=1731622799&width=1000&height=759&crop=center)]">
          <h1 className="text-4xl text-white font-bold">
            {isArabic ? "  الحافظات القوية" : "Rugged Cases "}
          </h1>
        </div>
      </div>
      {/*  */}
      <div className="w-[95%] max-md:w-[90%] max-md:h-[300px] max-sm:h-[300px] h-[500px] relative mx-auto">
        <video
          className="w-full h-full object-cover rounded-2xl"
          autoPlay
          muted
          playsInline
          loop
          src="https://checkout.nomadgoods.com/cdn/shop/videos/c/vp/12959ecdaf00448f85ee651af60e4586/12959ecdaf00448f85ee651af60e4586.HD-1080p-4.8Mbps-18259336.mp4"
        ></video>

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center px-16 bg-black/50 text-white  font-bold rounded-2xl">
          <div>
            <h1 className="text-6xl max-md:text-4xl max-sm:text-2xl font-bold">
              {isArabic ? "جلد " : "Leather "}
            </h1>
            <h1 className="text-4xl max-md:text-2xl max-sm:text-2xl font-bold">
              {isArabic
                ? " الذي يصبح أفضل مع تقدم العمر"
                : "That Gets Better with Age"}
            </h1>
            <Link href="/products">
              {" "}
              <button className=" cursor-pointer w-32 h-11 rounded-2xl border-1 border-gray-300 bg-white text-black my-5">
                {isArabic ? "التسوق الان" : "Shop Now"}
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* */}
      <div className="w-full px-3 flex-wrap flex justify-center gap-3 my-5">
        <div className=" w-[700px] max-sm:w-full flex flex-wrap justify-center items-center h-[450] border-1 bg-cover bg-center border-gray-300 shadow-md rounded-xl bg-[url(https://cdn.shopify.com/s/files/1/0384/6721/files/FInal_Goofy_recolor_web1.jpg?v=1738016396&width=2000&height=2000&crop=center)]">
          <div>
            <h1 className="text-4xl   text-white font-bold">
              {isArabic ? "  عنا!" : " About Us"}
            </h1>
            <h4 className="text-2xl text-white font-bold">
              {isArabic
                ? "12 عام من السلع عالية الجوده"
                : "  12 Years of Quality Goods"}
            </h4>
            <button className="w-32 h-12 mt-5 rounded-xl font-bold cursor-pointer bg-white text-black">
              {isArabic ? " المزيد" : "Learn More"}
            </button>
          </div>
        </div>
        
        <div className=" w-[700px] max-sm:w-full flex flex-wrap justify-center items-center h-[450] border-1 bg-cover bg-center border-gray-300 shadow-md rounded-xl bg-[url(https://cdn.shopify.com/s/files/1/0384/6721/files/environment.jpg?v=1731525231&width=1600&height=1110&crop=center)]">
          <div>
            <h1 className="text-2xl   text-white font-bold">
              {isArabic ? " التزامنا بـ" : "  Our Commitment to "}
            </h1>
            <h4 className="text-4xl text-white font-bold">
              {isArabic
                ? "البيئة  "
                : "  The Environment"}
            </h4>
            <button className="w-32  h-12 mt-5 rounded-xl font-bold cursor-pointer bg-white text-black">
              {isArabic ? " المزيد" : "Learn More"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

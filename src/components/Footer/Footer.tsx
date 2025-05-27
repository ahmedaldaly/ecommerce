import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const Footer = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const footerContent = {
    links: [
      {
        title: isArabic ? 'الدعم' : 'Support',
        items: [
          { text: isArabic ? 'مركز المساعدة' : 'Help Center', href: '#' },
          { text: isArabic ? 'اتصل بنا' : 'Contact Us', href: '#' }
        ]
      },
      {
        title: isArabic ? 'عن الشركة' : 'About',
        items: [
          { text: isArabic ? 'من نحن' : 'About Us', href: '#' },
          { text: isArabic ? 'الوظائف' : 'Careers', href: '#' }
        ]
      },
      {
        title: isArabic ? 'معلومات' : 'Information',
        items: [
          { text: isArabic ? 'الشروط والأحكام' : 'Terms', href: '#' },
          { text: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy', href: '#' }
        ]
      }
    ],
    copyright: isArabic ? '© 2025 جميع الحقوق محفوظة' : '© 2025 All rights reserved'
  };

  return (
    <footer className="bg-gray-100 text-gray-800 py-8 px-4 md:px-8">
      <div className={`max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-6 ${isArabic ? 'text-right' : 'text-left'}`}>
        {footerContent.links.map((section, index) => (
          <div key={index}>
            <h3 className="font-bold text-lg mb-3">{section.title}</h3>
            <ul className="space-y-2 text-sm">
              {section.items.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="hover:underline hover:text-gray-600">
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className={`max-w-7xl mx-auto pt-4 border-t border-gray-200 text-sm text-center ${isArabic ? 'text-right' : 'text-left'}`}>
        <p>{footerContent.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
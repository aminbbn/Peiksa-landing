
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Rocket, BarChart3, Settings, Wrench, Plus, Minus, MessageCircle, Mail, Phone, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';

const learningPath = [
  { step: 1, title: 'آمادگی (Prep)', desc: 'وارد کردن داده‌ها' },
  { step: 2, title: 'کمپین (Campaign)', desc: 'ساخت اولین ایمیل/پیامک' },
  { step: 3, title: 'بهینه‌سازی (Optimize)', desc: 'تحلیل گزارش‌ها' },
  { step: 4, title: 'اتوماسیون (Automate)', desc: 'ساخت ورک‌فلو خودکار' },
];

const faqs = [
  { q: 'پیکسا برای چه کسب‌وکارهایی مناسب است؟', a: 'پیکسا برای فروشگاه‌های اینترنتی، شرکت‌های خدماتی، استارتاپ‌ها و هر کسب‌وکاری که به دنبال مدیریت بهتر مشتریان و بازاریابی است، مناسب می‌باشد.' },
  { q: 'آیا دوره آزمایشی محدودیت دارد؟', a: 'خیر، در دوره ۱۴ روزه آزمایشی شما به تمام امکانات پلن حرفه‌ای دسترسی دارید تا قدرت کامل پیکسا را تجربه کنید.' },
  { q: 'مالکیت داده‌ها با کیست؟', a: 'شما مالک ۱۰۰٪ داده‌های خود هستید. پیکسا هیچ‌گاه داده‌های شما را به اشخاص ثالث نمی‌فروشد و شما هر زمان می‌توانید داده‌های خود را خروجی بگیرید.' },
];

export const Support: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white">
      <section className="py-20 bg-slate-900 text-white text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4"
        >
          <h1 className="text-4xl font-bold mb-6">مرکز آموزش و پشتیبانی</h1>
          <div className="max-w-xl mx-auto relative">
            <input 
              type="text" 
              placeholder="جستجو در ۵۰+ آموزش ویدیویی..." 
              className="w-full h-14 px-6 pl-12 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:bg-white/20 transition-all backdrop-blur-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </motion.div>
      </section>

      {/* Learning Path */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-10">مسیر یادگیری پیکسا</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-0">
            {learningPath.map((item, idx) => (
              <React.Fragment key={idx}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-blue-50 p-6 rounded-2xl w-full md:w-64 border border-blue-100"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">{item.step}</div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </motion.div>
                {idx < learningPath.length - 1 && (
                  <div className="hidden md:block w-12 h-1 bg-blue-100 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">سوالات متداول</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button 
                  className="w-full flex items-center justify-between p-5 text-right font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  {faq.q}
                  {openFaq === idx ? <Minus size={20} className="text-blue-600" /> : <Plus size={20} className="text-slate-400" />}
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: openFaq === idx ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-0 text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

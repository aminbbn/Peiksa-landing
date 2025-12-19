
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { ShoppingBag, Heart, Briefcase, TrendingUp, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageRoute } from '../types';

const stories = [
  {
    company: 'فروشگاه آنلاین دیجی‌مارت',
    industry: 'خرده‌فروشی آنلاین',
    icon: ShoppingBag,
    color: 'bg-pink-100 text-pink-600',
    quote: 'پیکسا به ما کمک کرد تا فروش آنلاین خود را ۳ برابر کنیم. سیستم اتوماسیون بازاریابی باعث شد تا مشتریان وفادار بیشتری داشته باشیم.',
    author: 'احمد رضایی',
    role: 'مدیرعامل',
    results: [
      { value: '۳۰۰٪', label: 'افزایش فروش' },
      { value: '۱۰۰۰+', label: 'مشتری جدید' }
    ]
  },
  {
    company: 'کلینیک زیبایی نگار',
    industry: 'خدمات درمانی',
    icon: Heart,
    color: 'bg-rose-100 text-rose-600',
    quote: 'با استفاده از سیستم اتوماسیون پیکسا، توانستیم یادآوری‌های ویزیت را خودکار کنیم و نرخ غیبت بیماران را به صفر برسانیم.',
    author: 'دکتر مریم احمدی',
    role: 'مدیر کلینیک',
    results: [
      { value: '۹۰٪', label: 'کاهش غیبت' },
      { value: '۴۰٪', label: 'افزایش رضایت' }
    ]
  },
  {
    company: 'آژانس دیجیتال میرا',
    industry: 'بازاریابی',
    icon: Briefcase,
    color: 'bg-blue-100 text-blue-600',
    quote: 'پیکسا به ما کمک کرد تا خدمات بهتری به مشتریان ارائه دهیم و پروژه‌های بزرگ‌تری ببریم. ابزارهای تحلیل پیشرفته واقعاً تفاوت ایجاد کردند.',
    author: 'فاطمه حسینی',
    role: 'مدیر آژانس',
    results: [
      { value: '۱۵۰٪', label: 'رشد پروژه‌ها' },
      { value: '۹۵٪', label: 'رضایت مشتریان' }
    ]
  },
  {
    company: 'کارخانه نساجی پارس',
    industry: 'تولیدی و صنعت',
    icon: TrendingUp,
    color: 'bg-amber-100 text-amber-600',
    quote: 'با استفاده از سیستم اتوماسیون پیکسا، توانستیم ارتباط بهتری با مشتریان عمده‌فروش برقرار کنیم و فروش B2B خود را افزایش دهیم.',
    author: 'مهدی رضایی',
    role: 'مدیر فروش',
    results: [
      { value: '۱۰۰٪', label: 'رشد B2B' },
      { value: '۵۰٪', label: 'بهبود ارتباط' }
    ]
  }
];

export const Customers: React.FC = () => {
  return (
    <div className="bg-white">
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-800 text-white text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container mx-auto px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">داستان‌های موفقیت</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12">
            ببینید چگونه کسب‌وکارهای پیشرو با استفاده از پیکسا رشد کرده‌اند
          </p>
          <div className="flex justify-center gap-8 md:gap-16 flex-wrap text-center">
             <div><div className="text-4xl font-bold mb-1">۱۰۰۰+</div><div className="text-blue-200 text-sm">مشتری فعال</div></div>
             <div><div className="text-4xl font-bold mb-1">۹۸٪</div><div className="text-blue-200 text-sm">رضایت</div></div>
             <div><div className="text-4xl font-bold mb-1">۲۵۰٪</div><div className="text-blue-200 text-sm">رشد متوسط</div></div>
          </div>
        </motion.div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${story.color}`}>
                      <story.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{story.company}</h3>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{story.industry}</span>
                    </div>
                  </div>
                  <blockquote className="text-lg text-slate-700 mb-8 leading-relaxed">"{story.quote}"</blockquote>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {story.results.map((res, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{res.value}</div>
                        <div className="text-sm text-slate-500">{res.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 border-t border-slate-100 pt-6">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">{story.author.charAt(0)}</div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{story.author}</div>
                      <div className="text-slate-500 text-xs">{story.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

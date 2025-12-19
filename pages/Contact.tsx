
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, Linkedin, Instagram, Twitter, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Contact: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Header */}
      <section className="bg-slate-900 pt-32 pb-48 relative overflow-hidden rounded-b-[3rem]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        {/* Animated Blobs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px] pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 4 }}
          className="absolute bottom-0 left-20 w-64 h-64 bg-purple-600/30 rounded-full blur-[80px] pointer-events-none"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white mb-6"
          >
            ارتباط با <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">پیکسا</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto"
          >
            تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست. انتقادات و پیشنهادات شما مسیر رشد ما را هموار می‌کند.
          </motion.p>
        </div>
      </section>

      {/* Floating Card Container */}
      <div className="container mx-auto px-4 -mt-32 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid lg:grid-cols-5 min-h-[600px]"
        >
          
          {/* Right Side: Form (Visually Right in RTL, layout col-span-3) */}
          <div className="lg:col-span-3 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">ارسال پیام</h2>
            <p className="text-slate-500 mb-8">اطلاعات خود را وارد کنید، کارشناسان ما در سریع‌ترین زمان با شما تماس می‌گیرند.</p>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">نام و نام خانوادگی</label>
                  <input 
                    type="text" 
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="مثال: علی رضایی" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">شماره موبایل</label>
                  <input 
                    type="tel" 
                    dir="ltr"
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-left"
                    placeholder="0912..." 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">موضوع پیام</label>
                <select className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all">
                  <option value="">انتخاب موضوع...</option>
                  <option value="sales">مشاوره فروش</option>
                  <option value="support">پشتیبانی فنی</option>
                  <option value="partnership">همکاری تجاری</option>
                  <option value="other">سایر</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">متن پیام</label>
                <textarea 
                  className="w-full h-32 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                  placeholder="پیام خود را بنویسید..."
                ></textarea>
              </div>

              <Button size="lg" className="w-full md:w-auto shadow-xl shadow-blue-600/20">
                ارسال درخواست
                <Send size={18} className="mr-2" />
              </Button>
            </form>
          </div>

          {/* Left Side: Contact Info Sidebar (Visually Left in RTL) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-8 md:p-12 relative overflow-hidden flex flex-col justify-between">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8">اطلاعات تماس</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-blue-100 mb-1 text-sm">آدرس دفتر مرکزی</p>
                    <p className="text-white leading-relaxed">تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه ۳۴، پلاک ۱۲۳، ساختمان پیکسا</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-blue-100 mb-1 text-sm">شماره تماس</p>
                    <p className="text-white text-lg font-bold" dir="ltr">021 - 1234 5678</p>
                    <p className="text-white/60 text-xs mt-1">پاسخگویی: شنبه تا پنج‌شنبه ۹ الی ۱۷</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-blue-100 mb-1 text-sm">پست الکترونیک</p>
                    <p className="text-white font-medium">support@peiksa.com</p>
                    <p className="text-white font-medium">sales@peiksa.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="relative z-10 mt-12">
              <p className="text-blue-200 text-sm mb-4 font-medium">ما را دنبال کنید</p>
              <div className="flex gap-4">
                {[
                  { icon: Linkedin, href: '#' },
                  { icon: Instagram, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Globe, href: '#' },
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </div>
  );
};

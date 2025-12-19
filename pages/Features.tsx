
import React from 'react';
import { motion } from 'framer-motion';
import { Database, MessageCircle, BarChart2, Target, Lock, Cpu, Users, Smartphone, Zap, ArrowLeft, Layers, GitBranch, PieChart, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { PageRoute } from '../types';

// --- Custom Animated Visualizations ---

const CdpVisual = () => (
  <div className="relative w-full aspect-square max-w-[400px] mx-auto flex items-center justify-center">
    {/* Orbit Rings */}
    <div className="absolute inset-0 border border-slate-200 rounded-full opacity-50"></div>
    <div className="absolute inset-[15%] border border-slate-200 rounded-full opacity-50"></div>
    
    {/* Center Node (User) */}
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      className="relative z-10 bg-white p-4 rounded-2xl shadow-xl border border-blue-100 flex flex-col items-center"
    >
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mb-2 shadow-lg shadow-blue-500/30">
        <Users size={32} />
      </div>
      <div className="text-slate-900 font-bold text-sm">پروفایل ۳۶۰ درجه</div>
      <div className="text-slate-400 text-[10px]">Customer ID: #8492</div>
    </motion.div>

    {/* Orbiting Data Points */}
    {[
      { icon: MessageCircle, color: 'bg-purple-500', label: 'چت‌ها', angle: 0 },
      { icon: Smartphone, color: 'bg-green-500', label: 'موبایل', angle: 72 },
      { icon: Lock, color: 'bg-amber-500', label: 'امنیت', angle: 144 },
      { icon: Target, color: 'bg-red-500', label: 'رفتار', angle: 216 },
      { icon: Database, color: 'bg-cyan-500', label: 'سوابق', angle: 288 },
    ].map((item, i) => (
      <motion.div
        key={i}
        className="absolute w-12 h-12 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center z-10"
        initial={{ x: 0, y: 0, opacity: 0 }}
        whileInView={{ 
          x: Math.cos((item.angle * Math.PI) / 180) * 140,
          y: Math.sin((item.angle * Math.PI) / 180) * 140,
          opacity: 1
        }}
        transition={{ duration: 0.8, delay: i * 0.1, type: "spring" }}
      >
        <item.icon size={20} className={item.color.replace('bg-', 'text-')} />
      </motion.div>
    ))}
  </div>
);

const AutomationVisual = () => (
  <div className="relative w-full max-w-[400px] mx-auto bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-slate-200 border-l border-dashed border-slate-300"></div>
    
    <div className="space-y-8 relative z-10">
      {/* Trigger */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 w-4/5 mx-auto"
      >
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
          <Zap size={18} />
        </div>
        <div className="text-xs font-bold text-slate-700">ثبت نام کاربر جدید</div>
      </motion.div>

      {/* Delay */}
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-8 h-8 bg-slate-200 rounded-full mx-auto flex items-center justify-center text-slate-500 border-2 border-white"
      >
        <span className="text-[10px] font-bold">2h</span>
      </motion.div>

      {/* Action 1 */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-4 rounded-xl shadow-sm border border-purple-200 flex items-center gap-3 w-4/5 mx-auto relative"
      >
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
          <MessageCircle size={18} />
        </div>
        <div>
           <div className="text-xs font-bold text-slate-700">ارسال پیامک خوش‌آمد</div>
           <div className="text-[10px] text-green-500">Sent Successfully</div>
        </div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
      </motion.div>

      {/* Condition */}
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: 0.6 }}
        className="w-24 mx-auto bg-slate-800 text-white text-[10px] py-1 px-3 rounded-full text-center"
      >
        اگر خرید نکرد؟
      </motion.div>

      {/* Action 2 */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 flex items-center gap-3 w-4/5 mx-auto opacity-50"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
          <GitBranch size={18} />
        </div>
        <div className="text-xs font-bold text-slate-700">ارسال کد تخفیف</div>
      </motion.div>
    </div>
  </div>
);

const AnalyticsVisual = () => (
  <div className="relative w-full max-w-[400px] mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-6 overflow-hidden">
    <div className="flex justify-between items-center mb-6">
       <div className="text-sm font-bold text-slate-800">گزارش رشد فروش</div>
       <div className="bg-green-50 text-green-600 px-2 py-1 rounded text-[10px] font-bold">+۲۴٪ رشد</div>
    </div>
    
    <div className="flex items-end justify-between gap-2 h-32 mb-4">
       {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
         <motion.div
           key={i}
           initial={{ height: 0 }}
           whileInView={{ height: `${h}%` }}
           transition={{ delay: i * 0.1, type: "spring" }}
           className="w-full bg-blue-500 rounded-t-sm opacity-90 hover:opacity-100 transition-opacity"
         />
       ))}
    </div>

    <div className="grid grid-cols-2 gap-4">
       <div className="bg-slate-50 p-3 rounded-lg">
          <div className="text-[10px] text-slate-500 mb-1">بازدیدکنندگان</div>
          <div className="text-lg font-bold text-slate-800">12.5K</div>
       </div>
       <div className="bg-slate-50 p-3 rounded-lg">
          <div className="text-[10px] text-slate-500 mb-1">نرخ تبدیل</div>
          <div className="text-lg font-bold text-slate-800">3.2%</div>
       </div>
    </div>
  </div>
);

// --- Main Component ---

export const Features: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden text-white rounded-b-[3rem]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        {/* Animated Background Globs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 5 }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6 backdrop-blur-md"
          >
            <Layers size={16} />
            پلتفرم جامع بازاریابی
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 leading-tight"
          >
            هر ابزاری که برای <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">رشد انفجاری</span> نیاز دارید
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10"
          >
            جایگزین ۵ ابزار مختلف شوید. پیکسا تمام نیازهای بازاریابی، فروش و پشتیبانی شما را در یک داشبورد یکپارچه می‌کند.
          </p>
        </div>
      </section>

      {/* Feature Modules */}
      <div className="container mx-auto px-4 py-24 space-y-32">
        
        {/* Module 1: CDP */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
             <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
               <Database size={28} />
             </div>
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">مدیریت داده مشتریان (CDP)</h2>
             <p className="text-lg text-slate-600 leading-relaxed mb-8">
               پراکندگی داده‌ها دشمن رشد است. پیکسا تمام اطلاعات مشتریان شما را از وب‌سایت، اپلیکیشن و فروشگاه فیزیکی جمع‌آوری کرده و در پروفایل‌های ۳۶۰ درجه ذخیره می‌کند.
             </p>
             <ul className="space-y-4">
               {[
                 'شناسایی هویت مشتریان در کانال‌های مختلف',
                 'دسته‌بندی هوشمند بر اساس رفتار خرید (RFM)',
                 'امتیازدهی به سرنخ‌ها (Lead Scoring) برای تیم فروش'
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                   <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                     <Check size={14} strokeWidth={3} />
                   </div>
                   {item}
                 </li>
               ))}
             </ul>
          </motion.div>
          <div className="order-1 lg:order-2">
             <CdpVisual />
          </div>
        </div>

        {/* Module 2: Automation */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-1">
             <AutomationVisual />
          </div>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2"
          >
             <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
               <Zap size={28} />
             </div>
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">اتوماسیون هوشمند</h2>
             <p className="text-lg text-slate-600 leading-relaxed mb-8">
               فروش خود را روی حالت خلبان خودکار بگذارید. با ابزار طراحی ویژوال ما، سفر مشتری را طراحی کنید و پیام مناسب را در زمان طلایی ارسال کنید.
             </p>
             <ul className="space-y-4">
               {[
                 'کمپین‌های سبد خرید رها شده',
                 'یادآوری‌های تمدید سرویس و تولد',
                 'ارسال ترکیبی ایمیل، پیامک و پوش نوتیفیکیشن'
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                   <div className="w-6 h-6 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                     <Check size={14} strokeWidth={3} />
                   </div>
                   {item}
                 </li>
               ))}
             </ul>
          </motion.div>
        </div>

        {/* Module 3: Analytics */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
             <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
               <BarChart2 size={28} />
             </div>
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">تحلیل و رشد داده‌محور</h2>
             <p className="text-lg text-slate-600 leading-relaxed mb-8">
               بدون داده، شما فقط یک نفر با یک نظر هستید. داشبوردهای پیکسا به شما نشان می‌دهند کدام کمپین‌ها پولساز هستند و کجا باید سرمایه‌گذاری کنید.
             </p>
             <ul className="space-y-4">
               {[
                 'گزارش نرخ تبدیل (Conversion Rate) در لحظه',
                 'تحلیل بازگشت سرمایه (ROI) کمپین‌ها',
                 'پیش‌بینی فروش با هوش مصنوعی'
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                   <div className="w-6 h-6 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                     <Check size={14} strokeWidth={3} />
                   </div>
                   {item}
                 </li>
               ))}
             </ul>
          </motion.div>
          <div className="order-1 lg:order-2">
             <AnalyticsVisual />
          </div>
        </div>

      </div>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200 text-center">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-slate-900 mb-6">آماده تحول کسب‌وکارتان هستید؟</h2>
           <p className="text-slate-600 mb-8 max-w-xl mx-auto">
             همین امروز به جمع ۱۰,۰۰۰ کسب‌وکار موفق بپیوندید. بدون نیاز به کارت اعتباری.
           </p>
           <div className="flex justify-center gap-4">
             <Link to={PageRoute.AUTH}>
                <Button size="lg" className="shadow-xl shadow-blue-600/20">شروع رایگان ۱۴ روزه</Button>
             </Link>
             <Link to={PageRoute.CONTACT}>
                <Button variant="outline" size="lg">مشاوره رایگان</Button>
             </Link>
           </div>
        </div>
      </section>

    </div>
  );
};

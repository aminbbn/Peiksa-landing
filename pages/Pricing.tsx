
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, ChevronDown, ChevronUp, Zap, Shield, Headphones, Server, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

const plans = [
  {
    id: 'basic',
    name: 'پایه',
    enName: 'Basic',
    monthlyPrice: 499000,
    description: 'شروع قدرتمند برای کسب‌وکارهای کوچک',
    features: [
      '۱,۰۰۰ مخاطب فعال',
      '۲ کاربر سیستم',
      'ارسال ایمیل نامحدود',
      'فرمساز استاندارد',
      'پشتیبانی ایمیلی'
    ],
    color: 'blue',
    popular: false
  },
  {
    id: 'pro',
    name: 'حرفه‌ای',
    enName: 'Professional',
    monthlyPrice: 999000,
    description: 'همه ابزارها برای رشد سریع کسب‌وکار',
    features: [
      '۱۰,۰۰۰ مخاطب فعال',
      '۱۰ کاربر سیستم',
      'پنل پیامک و اتوماسیون',
      'هوش مصنوعی (AI) نامحدود',
      'پشتیبانی تلفنی اختصاصی',
      'حذف برندینگ پیکسا'
    ],
    color: 'purple',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'سازمانی',
    enName: 'Enterprise',
    monthlyPrice: null, // Contact Sales
    description: 'مقیاس‌پذیری و امنیت برای سازمان‌ها',
    features: [
      'مخاطب و کاربر نامحدود',
      'سرور اختصاصی (Private Cloud)',
      'IP اختصاصی ارسال ایمیل',
      'مدیر موفقیت مشتری (CSM)',
      'قرارداد SLA و محرمانگی',
      'API پیشرفته و Webhook'
    ],
    color: 'slate',
    popular: false
  }
];

const faqs = [
  { q: "آیا می‌توانم پلن خود را تغییر دهم؟", a: "بله، در هر زمان می‌توانید پلن خود را ارتقا یا تنزل دهید. هزینه باقی‌مانده محاسبه می‌شود." },
  { q: "آیا هزینه راه‌اندازی اولیه وجود دارد؟", a: "خیر، تمام پلن‌ها شامل راه‌اندازی رایگان هستند و هزینه پنهانی وجود ندارد." },
  { q: "تفاوت مخاطب فعال و کل مخاطبین چیست؟", a: "مخاطب فعال کسی است که در ماه جاری پیامی دریافت کرده است. ذخیره‌سازی مخاطبین غیرفعال رایگان است." },
  { q: "آیا قرارداد بلندمدت لازم است؟", a: "خیر، شما می‌توانید به صورت ماهانه پرداخت کنید و هر زمان که بخواهید سرویس را لغو کنید." },
];

export const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const calculatePrice = (monthly: number | null) => {
    if (monthly === null) return 'تماس بگیرید';
    if (isYearly) {
      const yearlyTotal = monthly * 12 * 0.8;
      return new Intl.NumberFormat('fa-IR').format(Math.round(yearlyTotal / 12));
    }
    return new Intl.NumberFormat('fa-IR').format(monthly);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-slate-900 pt-32 pb-48 relative overflow-hidden rounded-b-[3rem]">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
         
         <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-white mb-6"
            >
              سرمایه‌گذاری روی <span className="text-blue-400">رشد</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
            >
              پلن مناسب کسب‌وکار خود را انتخاب کنید. همگی با ۱۴ روز تست رایگان.
            </motion.p>

            {/* Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 items-center bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20 relative w-[320px] mx-auto"
            >
               {/* Sliding Background */}
               <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-lg transition-all duration-300 ${isYearly ? 'left-1' : 'right-1'}`}></div>

               <button 
                 onClick={() => setIsYearly(false)}
                 className={`py-3 rounded-full text-sm font-bold transition-all duration-300 relative z-10 text-center ${!isYearly ? 'text-slate-900' : 'text-white hover:text-blue-200'}`}
               >
                 ماهانه
               </button>
               <button 
                 onClick={() => setIsYearly(true)}
                 className={`py-3 rounded-full text-sm font-bold transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${isYearly ? 'text-slate-900' : 'text-white hover:text-blue-200'}`}
               >
                 سالانه
                 <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">۲۰٪ تخفیف</span>
               </button>
            </motion.div>
         </div>
      </section>

      {/* Cards Container */}
      <section className="container mx-auto px-4 -mt-32 relative z-20">
         <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
               <motion.div
                 key={idx}
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className={`bg-white rounded-[2rem] p-8 flex flex-col relative overflow-hidden ${
                    plan.popular 
                      ? 'shadow-2xl shadow-purple-500/20 border-2 border-purple-500 transform scale-105 z-10' 
                      : 'shadow-xl border border-slate-100'
                 }`}
               >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                  )}
                  
                  <div className="mb-8">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                           <span className="text-sm text-slate-400 font-medium">{plan.enName}</span>
                        </div>
                        {plan.popular && (
                           <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <Star size={12} fill="currentColor" />
                              پیشنهاد ما
                           </div>
                        )}
                     </div>
                     <p className="text-slate-500 text-sm min-h-[40px]">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                     <div className="flex items-baseline gap-1">
                        {plan.monthlyPrice ? (
                           <>
                              <span className="text-4xl font-black text-slate-900 tracking-tight">
                                 {calculatePrice(plan.monthlyPrice)}
                              </span>
                              <span className="text-slate-500 text-sm">تومان / ماه</span>
                           </>
                        ) : (
                           <span className="text-3xl font-black text-slate-900">تماس بگیرید</span>
                        )}
                     </div>
                     {isYearly && plan.monthlyPrice && (
                        <div className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                           <Zap size={12} />
                           صرفه‌جویی {(plan.monthlyPrice * 12 * 0.2).toLocaleString('fa-IR')} تومان در سال
                        </div>
                     )}
                  </div>

                  <div className="flex-grow">
                     <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, fIdx) => (
                           <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-700">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.popular ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                 <Check size={12} strokeWidth={3} />
                              </div>
                              {feature}
                           </li>
                        ))}
                     </ul>
                  </div>

                  <Button 
                    fullWidth 
                    size="lg" 
                    variant={plan.popular ? 'primary' : 'outline'}
                    className={plan.popular ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-none shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40' : ''}
                  >
                     {plan.monthlyPrice ? 'شروع رایگان' : 'مشاوره رایگان'}
                  </Button>
                  
                  {plan.monthlyPrice && (
                     <p className="text-center text-[10px] text-slate-400 mt-3">بدون نیاز به کارت بانکی</p>
                  )}
               </motion.div>
            ))}
         </div>
      </section>

      {/* Premium Enterprise Banner */}
      <section className="container mx-auto px-4 mt-20">
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-slate-900/20"
         >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              {/* Text & Features */}
              <div className="flex-1 text-center md:text-right">
                 <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold mb-6 backdrop-blur-sm">
                    <Shield size={14} />
                    نسخه سازمانی (Enterprise)
                 </div>
                 <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                    نیاز به <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">قدرت و امنیت</span> بیشتر دارید؟
                 </h3>
                 <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-xl">
                    برای سازمان‌های بزرگ با حجم دیتای بالا، ما زیرساخت اختصاصی (Private Cloud) با بالاترین استانداردهای امنیتی و عملکرد ارائه می‌دهیم.
                 </p>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                       { icon: Server, text: 'سرورهای اختصاصی ایزوله' },
                       { icon: Headphones, text: 'مدیر موفقیت مشتری (CSM)' },
                       { icon: Lock, text: 'قرارداد عدم افشا (NDA)' },
                       { icon: Zap, text: 'SLA تضمین‌شده ۹۹.۹۹٪' }
                    ].map((feat, idx) => (
                       <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                             <feat.icon size={16} />
                          </div>
                          <span className="text-slate-200 text-sm font-medium">{feat.text}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* CTA */}
              <div className="w-full md:w-auto flex flex-col gap-4 shrink-0">
                 <Button 
                   size="lg" 
                   className="!bg-white !text-slate-900 hover:!bg-blue-50 border-none font-bold px-8 h-14 text-lg shadow-xl shadow-white/10 w-full md:w-auto"
                 >
                    تماس با واحد فروش سازمانی
                    <ArrowLeft className="mr-2" />
                 </Button>
                 <p className="text-slate-500 text-xs text-center">پاسخگویی در کمتر از ۲ ساعت کاری</p>
              </div>
            </div>
         </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 mt-24 max-w-3xl">
         <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">سوالات متداول</h2>
            <p className="text-slate-500">پاسخ به پرتکرارترین سوالات شما درباره قیمت‌گذاری</p>
         </div>
         
         <div className="space-y-4">
            {faqs.map((faq, idx) => (
               <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-300">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-right font-bold text-slate-800"
                  >
                     {faq.q}
                     {openFaq === idx ? <ChevronUp size={20} className="text-blue-500" /> : <ChevronDown size={20} className="text-slate-400" />}
                  </button>
                  <AnimatePresence>
                     {openFaq === idx && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                           <div className="p-5 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 text-sm">
                              {faq.a}
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

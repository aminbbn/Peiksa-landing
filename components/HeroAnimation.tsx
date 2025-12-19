
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Sparkles, Send, TrendingUp, Mail, Smartphone, MoreHorizontal, CheckCircle, ArrowUpRight } from 'lucide-react';

const steps = [
  { id: 'data', label: 'ورود داده‌ها', color: 'bg-blue-500' },
  { id: 'analyze', label: 'تحلیل هوشمند', color: 'bg-purple-500' },
  { id: 'campaign', label: 'ارسال کمپین', color: 'bg-amber-500' },
  { id: 'growth', label: 'رشد فروش', color: 'bg-green-500' },
];

export const HeroAnimation: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000); // 3 seconds per step
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[500px] mx-auto aspect-[4/3] flex flex-col">
      
      {/* --- Progress Indicator --- */}
      <div className="flex justify-between items-center mb-6 px-2" dir="rtl">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 w-1/4 relative">
            {/* Line Connector */}
            {idx !== steps.length - 1 && (
               <div className="absolute top-1.5 left-0 w-full h-0.5 bg-slate-100 -z-10 translate-x-[-50%]" />
            )}
            
            <motion.div 
              animate={{ 
                backgroundColor: activeStep >= idx ? (step.id === 'data' ? '#3b82f6' : step.id === 'analyze' ? '#a855f7' : step.id === 'campaign' ? '#f59e0b' : '#22c55e') : '#e2e8f0',
                scale: activeStep === idx ? 1.2 : 1
              }}
              className="w-3 h-3 rounded-full transition-colors duration-500"
            />
            <motion.span 
              animate={{ 
                opacity: activeStep === idx ? 1 : 0.4,
                y: activeStep === idx ? 0 : 2,
                fontWeight: activeStep === idx ? 700 : 400
              }}
              className="text-[10px] sm:text-xs text-slate-600"
            >
              {step.label}
            </motion.span>
          </div>
        ))}
      </div>

      {/* --- Mock App Window --- */}
      <div className="flex-1 bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative flex flex-col">
        
        {/* App Header */}
        <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2" dir="rtl">
           <div className="flex gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
             <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
             <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
           </div>
           <div className="flex-1 text-center">
             <div className="inline-block px-3 py-0.5 bg-white rounded-md text-[10px] font-medium text-slate-400 shadow-sm">
               Peiksa Platform
             </div>
           </div>
        </div>

        {/* App Content Area */}
        <div className="flex-1 relative p-6 bg-slate-50/50 overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* --- STEP 1: DATA IMPORT --- */}
            {activeStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="grid grid-cols-3 gap-4 p-3 border-b border-slate-100 bg-slate-50 text-[10px] text-slate-500 font-bold" dir="rtl">
                      <span>نام مشتری</span>
                      <span>وضعیت</span>
                      <span>آخرین خرید</span>
                   </div>
                   <div className="p-1">
                      {[1, 2, 3].map((i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.2 }}
                          className="grid grid-cols-3 gap-4 p-3 border-b border-slate-50 last:border-0 text-xs items-center" dir="rtl"
                        >
                           <div className="flex items-center gap-2">
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i===1 ? 'bg-pink-100 text-pink-600' : i===2 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                               {i===1 ? 'س' : i===2 ? 'ع' : 'م'}
                             </div>
                             <div className="w-16 h-2 bg-slate-100 rounded-full" />
                           </div>
                           <div className="w-12 h-4 bg-slate-100 rounded-md" />
                           <div className="w-20 h-2 bg-slate-100 rounded-full" />
                        </motion.div>
                      ))}
                   </div>
                </div>
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ delay: 0.8, type: "spring" }}
                  className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-blue-500/20"
                >
                  <CheckCircle size={14} />
                  <span>اطلاعات وارد شد</span>
                </motion.div>
              </motion.div>
            )}

            {/* --- STEP 2: ANALYZE --- */}
            {activeStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                className="w-full h-full flex flex-col items-center justify-center relative"
              >
                 {/* Scanning Effect */}
                 <motion.div 
                   initial={{ top: '0%' }}
                   animate={{ top: '100%' }}
                   transition={{ duration: 1.5, ease: "linear" }}
                   className="absolute w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent z-10 opacity-50"
                 />
                 
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 text-center relative z-0 w-full max-w-[280px]">
                    <div className="w-14 h-14 mx-auto bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4">
                       <Search size={24} />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">تحلیل هوشمند</h3>
                    <div className="space-y-3 mt-4">
                       <motion.div 
                         initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.2 }}
                         className="flex justify-between text-xs items-center bg-purple-50 p-2 rounded-lg text-purple-700"
                       >
                          <span>مشتریان وفادار</span>
                          <span className="font-bold">۳۵٪</span>
                       </motion.div>
                       <motion.div 
                         initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.4 }}
                         className="flex justify-between text-xs items-center bg-slate-50 p-2 rounded-lg text-slate-500"
                       >
                          <span>مشتریان غیرفعال</span>
                          <span className="font-bold">۱۵٪</span>
                       </motion.div>
                    </div>
                 </div>
              </motion.div>
            )}

            {/* --- STEP 3: CAMPAIGN --- */}
            {activeStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                 <div className="w-full max-w-[300px] bg-white rounded-2xl shadow-lg border border-amber-100 p-5" dir="rtl">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                             <Sparkles size={16} />
                          </div>
                          <div>
                             <div className="text-[10px] text-slate-400">کمپین هوشمند</div>
                             <div className="text-xs font-bold text-slate-800">پیشنهاد ویژه بازگشت</div>
                          </div>
                       </div>
                       <div className="flex gap-1">
                          <Mail size={14} className="text-slate-400" />
                          <Smartphone size={14} className="text-slate-400" />
                       </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                       <div className="h-2 bg-slate-100 rounded-full w-3/4" />
                       <div className="h-2 bg-slate-100 rounded-full w-full" />
                       <div className="h-2 bg-slate-100 rounded-full w-5/6" />
                    </div>

                    <motion.button
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 0.95, 1] }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      className="w-full bg-amber-500 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
                    >
                       <Send size={14} />
                       ارسال به ۵۰۰ نفر
                    </motion.button>
                    
                    {/* Flying Particles */}
                    {[1,2,3,4].map(i => (
                       <motion.div
                         key={i}
                         initial={{ opacity: 0, x: 0, y: 0 }}
                         animate={{ opacity: [0, 1, 0], x: -100 - (Math.random() * 50), y: -50 + (Math.random() * 100) }}
                         transition={{ delay: 1 + (i*0.1), duration: 1 }}
                         className="absolute left-10 bottom-10 text-amber-500"
                       >
                          <Mail size={16} fill="currentColor" />
                       </motion.div>
                    ))}
                 </div>
              </motion.div>
            )}

            {/* --- STEP 4: GROWTH --- */}
            {activeStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                 <div className="grid grid-cols-2 gap-4 w-full max-w-[320px]">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 col-span-2 flex items-center justify-between"
                    >
                       <div>
                          <div className="text-xs text-slate-500 mb-1">نرخ تبدیل</div>
                          <div className="text-2xl font-black text-slate-800">۱۲.۵٪</div>
                       </div>
                       <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                          <TrendingUp size={24} />
                       </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"
                    >
                       <div className="text-[10px] text-slate-400 mb-2">فروش کل</div>
                       <div className="text-lg font-bold text-slate-800 flex items-center gap-1">
                          ۵۲ م
                          <ArrowUpRight size={14} className="text-green-500" />
                       </div>
                    </motion.div>

                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"
                    >
                       <div className="text-[10px] text-slate-400 mb-2">لید جدید</div>
                       <div className="text-lg font-bold text-slate-800 flex items-center gap-1">
                          +۱۴۲
                          <Users size={14} className="text-blue-500" />
                       </div>
                    </motion.div>
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

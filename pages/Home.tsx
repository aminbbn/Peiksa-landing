
import React, { useState, useEffect } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BarChart3, Zap, Shield, TrendingUp, Layers, CheckCircle, ArrowRight, Bot, Sparkles, MessageSquare, PenTool, Send, Smartphone, Mail, PieChart, Database, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { PageRoute } from '../types';
import { HeroAnimation } from '../components/HeroAnimation';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

// --- AI ANIMATION COMPONENTS ---

const AiSmsAnimation = () => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [step, setStep] = useState(0); // 0: Typing, 1: Sending, 2: Thinking, 3: Result, 4: Pause

  const scenarios = [
    {
      user: "یک متن کوتاه برای تخفیف شب یلدا بنویس، لحن صمیمی باشه.",
      ai: "🍉 یلدات مبارک رفیق!\nامشب طولانی‌ترین شب ساله، اما تخفیف‌های ما کوتاهه! 😉\n\nتا ۵۰٪ تخفیف روی همه محصولات.",
      link: "peiksa.ir/yalda",
      color: "from-purple-600 to-indigo-600"
    },
    {
      user: "پیام خوش‌آمدگویی رسمی برای مشتری جدید.",
      ai: "سلام! به خانواده بزرگ پیکسا خوش آمدید. 🌹\nخوشحالیم که شما را در کنار خود داریم.\nبرای شروع، راهنمای زیر را مطالعه کنید.",
      link: "peiksa.ir/start",
      color: "from-blue-600 to-cyan-600"
    },
    {
      user: "معرفی محصول جدید (کفش ورزشی) با هیجان بالا!",
      ai: "🚀 آماده پرواز هستید؟\nکفش‌های سری X جدید رسید! سبک‌تر، سریع‌تر و جذاب‌تر از همیشه.\nهمین الان ببینید! 👟",
      link: "peiksa.ir/new",
      color: "from-rose-500 to-orange-500"
    }
  ];

  useEffect(() => {
    const sequence = async () => {
      // Step 0: Typing (Start)
      setStep(0);
      await new Promise(r => setTimeout(r, 1500));
      
      // Step 1: Thinking
      setStep(1);
      await new Promise(r => setTimeout(r, 2000));
      
      // Step 2: Result
      setStep(2);
      await new Promise(r => setTimeout(r, 4000)); // Show result for 4s
      
      // Next Scenario
      setScenarioIndex((prev) => (prev + 1) % scenarios.length);
    };

    sequence();
    // Loop creates a natural recursion via useEffect dependency on scenarioIndex changing at the end
  }, [scenarioIndex]);

  const currentScenario = scenarios[scenarioIndex];

  return (
    <div className="bg-white rounded-[3rem] border-[12px] border-slate-900 w-full max-w-[320px] mx-auto shadow-2xl aspect-[9/19] relative overflow-hidden flex flex-col transform transition-transform hover:scale-[1.02] duration-500">
      {/* Physical Buttons */}
      <div className="absolute -left-[14px] top-24 w-[3px] h-10 bg-slate-800 rounded-l-md"></div>
      <div className="absolute -left-[14px] top-36 w-[3px] h-10 bg-slate-800 rounded-l-md"></div>
      <div className="absolute -right-[14px] top-28 w-[3px] h-16 bg-slate-800 rounded-r-md"></div>

      {/* Status Bar */}
      <div className="h-8 bg-white flex items-center justify-between px-6 pt-3 select-none z-20">
         <span className="text-[12px] font-bold text-slate-900">9:41</span>
         <div className="flex gap-1.5">
            <div className="w-4 h-2.5 bg-slate-900 rounded-[2px]"></div>
            <div className="w-0.5 h-2.5 bg-slate-900 rounded-[1px]"></div>
         </div>
      </div>

      {/* Dynamic Island */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-slate-900 rounded-full z-30 flex items-center justify-center">
          <div className="w-12 h-12 bg-black/50 rounded-full blur-xl absolute -z-10"></div>
      </div>
      
      {/* App Header */}
      <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-5 pt-2 z-10">
         <div className="flex items-center gap-2.5">
           <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-md shadow-purple-500/20">
             <Sparkles size={18} />
           </div>
           <div>
             <div className="text-sm font-bold text-slate-900">AI Writer</div>
             <div className="text-[10px] text-green-500 font-medium flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               Online
             </div>
           </div>
         </div>
         <MoreHorizontal size={20} className="text-slate-400" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-50/80 p-4 space-y-6 overflow-hidden flex flex-col relative">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* User Prompt */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`user-${scenarioIndex}`}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9, position: "absolute", top: 20, right: 20 }}
            transition={{ duration: 0.4 }}
            className="self-end max-w-[85%] relative z-0"
          >
            <div className="bg-white text-slate-700 p-4 rounded-2xl rounded-tr-sm shadow-sm border border-slate-100 text-xs leading-relaxed">
              {currentScenario.user}
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5 text-left px-1 font-medium">You • Now</div>
          </motion.div>
        </AnimatePresence>

        {/* AI Thinking / Result */}
        <div className="min-h-[120px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
               <motion.div 
                 key="loading"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                 className="self-start bg-white p-3 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex gap-1.5 items-center w-fit"
               >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium ml-1">AI is typing...</span>
               </motion.div>
            )}

            {step >= 2 && (
              <motion.div 
                key={`ai-${scenarioIndex}`}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ type: "spring", duration: 0.6 }}
                className="self-start max-w-[95%]"
              >
                 <div className={`bg-gradient-to-br ${currentScenario.color} p-5 rounded-2xl rounded-tl-sm shadow-lg text-white relative overflow-hidden`}>
                    {/* Shine Effect */}
                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 animate-[shimmer_2s_infinite]"></div>
                    
                    <p className="text-xs leading-relaxed relative z-10 whitespace-pre-line font-medium">
                      {currentScenario.ai}
                    </p>
                    <div className="mt-4 pt-3 border-t border-white/20 relative z-10">
                      <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-1.5 text-[10px] font-mono text-center text-white/90 flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        {currentScenario.link}
                      </div>
                    </div>
                 </div>
                 <div className="text-[10px] text-slate-400 mt-1.5 px-1 font-medium flex items-center gap-1">
                    <Bot size={12} />
                    AI • Just now
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-slate-100 z-10 pb-8">
        <div className="h-11 bg-slate-100 rounded-full flex items-center px-4 justify-between border border-slate-200">
           <span className="text-xs text-slate-400">Ask AI Writer...</span>
           <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md shadow-blue-500/30 hover:scale-105 transition-transform cursor-pointer">
              <Send size={14} className="text-white" />
           </div>
        </div>
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-300 rounded-full"></div>
      </div>
    </div>
  );
};

const AiEmailAnimation = () => {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden w-full max-w-[350px] mx-auto aspect-[4/3] flex flex-col">
      {/* Toolbar */}
      <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
         <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
         </div>
         <div className="ml-auto bg-blue-100 text-blue-600 text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1">
           <Sparkles size={10} />
           Generating...
         </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-4 bg-slate-100 flex flex-col gap-3 items-center justify-center relative">
         
         {/* Blocks flying in */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="w-full bg-white p-3 rounded-lg shadow-sm flex items-center justify-center"
         >
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="mr-2 font-bold text-slate-800">Logo</span>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.6 }}
           className="w-full h-24 bg-slate-200 rounded-lg overflow-hidden relative"
         >
           <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <img src="https://picsum.photos/seed/marketing/300/150" className="w-full h-full object-cover opacity-50" alt="" />
           </div>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           transition={{ duration: 0.5, delay: 1 }}
           className="w-full space-y-2"
         >
            <div className="h-3 bg-slate-300 rounded w-3/4 mx-auto"></div>
            <div className="h-2 bg-slate-200 rounded w-full"></div>
            <div className="h-2 bg-slate-200 rounded w-5/6 mx-auto"></div>
         </motion.div>

         <motion.button 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", delay: 1.4 }}
            className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg shadow-blue-600/30"
         >
            خرید کنید
         </motion.button>

         {/* Cursor */}
         <motion.div 
           animate={{ x: [0, 50, 0], y: [0, 40, 0] }}
           transition={{ duration: 3, repeat: Infinity }}
           className="absolute top-10 left-10 pointer-events-none"
         >
            <div className="w-4 h-4 bg-black rounded-full opacity-20 blur-sm absolute top-2 left-2"></div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#2563EB" stroke="white" strokeWidth="2"/>
            </svg>
         </motion.div>
      </div>
    </div>
  );
};

const AiAgentAnimation = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-[350px] mx-auto aspect-[4/3] flex flex-col overflow-hidden">
      <div className="p-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
         <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
            <Bot size={18} />
         </div>
         <div>
            <div className="text-xs font-bold text-slate-800">دستیار هوشمند پیکسا</div>
            <div className="text-[10px] text-green-500 flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               Online
            </div>
         </div>
      </div>
      
      <div className="flex-1 p-4 space-y-4 bg-slate-50/50">
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="flex gap-2 justify-end"
         >
            <div className="bg-blue-600 text-white px-3 py-2 rounded-2xl rounded-tr-sm text-xs">
               تحلیل فروش این هفته چطور بود؟ 📈
            </div>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.8 }}
           className="flex gap-2"
         >
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm text-xs text-slate-600 w-full shadow-sm">
               <p className="mb-2">فروش فوق‌العاده بود! 🚀 رشد <span className="text-green-600 font-bold">۲۰٪</span> نسبت به هفته قبل داشتیم.</p>
               
               {/* Chart */}
               <div className="h-24 flex items-end justify-between gap-1 mt-2 px-2">
                  {[30, 45, 35, 60, 50, 75, 90].map((h, i) => (
                     <motion.div 
                       key={i}
                       initial={{ height: 0 }}
                       whileInView={{ height: `${h}%` }}
                       transition={{ delay: 1 + (i*0.1), type: "spring" }}
                       className={`w-full rounded-t-sm ${i === 6 ? 'bg-green-500' : 'bg-slate-200'}`}
                     />
                  ))}
               </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---

export const Home: React.FC = () => {
  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-white opacity-70"></div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-center lg:text-right"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                نسخه ۲.۱ پیکسا منتشر شد
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.2] mb-6">
                همه تلاش‌های بازاریابی خود را <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">متحد کنید</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                پلتفرم جامع مدیریت مشتری (CRM) و اتوماسیون بازاریابی مخصوص کسب‌وکارهای ایرانی. داده‌های پراکنده را یکپارچه کنید و با کمپین‌های هوشمند، فروش خود را افزایش دهید.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to={PageRoute.AUTH}>
                  <Button size="lg" className="group w-full sm:w-auto">
                    شروع رایگان ۱۴ روزه
                    <ArrowLeft className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  </Button>
                </Link>
                <Link to={PageRoute.FEATURES}>
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">مشاهده دمو</Button>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-green-500" />
                  <span>امنیت ISO 27001</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-yellow-500" />
                  <span>راه‌اندازی آنی</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="relative h-full min-h-[400px] flex items-center justify-center"
            >
               <HeroAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-slate-500 text-sm font-medium mb-8">مورد اعتماد بیش از ۱۰,۰۰۰ کسب‌وکار پیشرو</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale transition-all hover:grayscale-0">
             {['دیجی‌کالا', 'اسنپ', 'تپسی', 'کافه‌بازار', 'علی‌بابا', 'دیوار'].map((brand, i) => (
               <motion.div 
                key={i} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-xl font-bold text-slate-400 hover:text-blue-600 transition-colors cursor-default flex items-center gap-2"
               >
                 <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
                 {brand}
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">پایان دوران پراکندگی داده‌ها</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 text-lg">چرا بیش از ۱۰,۰۰۰ کسب‌وکار ایرانی پیکسا را انتخاب کرده‌اند؟</motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-red-50 p-8 rounded-3xl border border-red-100"
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6">
                <TrendingUp size={24} className="rotate-180" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">چالش: جزیره‌های اطلاعاتی</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                داده‌های مشتریان شما در فایل‌های اکسل، پنل‌های پیامک، نرم‌افزارهای حسابداری و ایمیل‌ها پخش شده‌اند. نتیجه؟ عدم شناخت مشتری و فرصت‌های سوخته.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-red-700 text-sm">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  عدم دسترسی به تاریخچه کامل مشتری
                </li>
                <li className="flex items-center gap-2 text-red-700 text-sm">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  کمپین‌های کور و بدون هدف‌گذاری
                </li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-blue-50 p-8 rounded-3xl border border-blue-100 shadow-lg shadow-blue-100/50"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">راه‌حل: پلتفرم یکپارچه پیکسا</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                پیکسا (CDP) تمام نقاط تماس مشتری را در یک پروفایل ۳۶۰ درجه جمع می‌کند. ایمیل، پیامک، و رفتار وب‌سایت در یک داشبورد واحد.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-blue-700 text-sm">
                  <CheckCircle size={16} />
                  بانک اطلاعاتی جامع و منظم (CDP)
                </li>
                <li className="flex items-center gap-2 text-blue-700 text-sm">
                  <CheckCircle size={16} />
                  افزایش فروش با اتوماسیون هوشمند
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section className="py-24 bg-slate-50" id="features">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">امکانات کلیدی پیکسا</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-600 text-lg">سه ماژول قدرتمند برای رشد کسب‌وکار شما</motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Database, title: 'مدیریت داده مشتریان (CDP)', desc: 'پروفایل‌های ۳۶۰ درجه، دسته‌بندی هوشمند مشتریان و امتیازدهی به سرنخ‌های فروش (Lead Scoring).' },
              { icon: Zap, title: 'اتوماسیون چندکاناله', desc: 'اجرای خودکار کمپین‌ها در ایمیل، پیامک و پوش نوتیفیکیشن با قابلیت طراحی بصری سناریو.' },
              { icon: BarChart3, title: 'رشد و تحلیل پیشرفته', desc: 'گزارش‌های لحظه‌ای نرخ تبدیل، تحلیل رقبا با هوش مصنوعی و پیش‌بینی فروش.' },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEW: AI INTELLIGENCE SECTION --- */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        {/* Background Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6"
            >
               <Sparkles size={16} />
               هوش مصنوعی اختصاصی (Peiksa AI)
            </motion.div>
            <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               viewport={{ once: true }}
               className="text-3xl md:text-5xl font-black mb-6"
            >
              قدرت <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">هوش مصنوعی</span> در دستان شما
            </motion.h2>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               viewport={{ once: true }}
               className="text-slate-400 text-lg"
            >
               دستیارهای هوشمند پیکسا کارهای سخت را ساده می‌کنند. از نوشتن پیامک‌های خلاقانه تا تحلیل داده‌های پیچیده.
            </motion.p>
          </div>

          <div className="space-y-24">
            {/* Feature 1: SMS Generator */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="order-2 lg:order-1"
               >
                  <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                     <MessageSquare size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">تولید کننده هوشمند پیامک</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                     دیگر نگران نوشتن متن‌های تبلیغاتی نباشید. هوش مصنوعی پیکسا بر اساس شخصیت برند شما و نوع جشنواره، جذاب‌ترین متن‌های پیامک را در چند ثانیه تولید می‌کند.
                  </p>
                  <ul className="space-y-4 mb-8">
                     <li className="flex items-center gap-3 text-slate-300">
                        <CheckCircle size={20} className="text-purple-500" />
                        لحن شخصی‌سازی شده (رسمی، صمیمی، طنز)
                     </li>
                     <li className="flex items-center gap-3 text-slate-300">
                        <CheckCircle size={20} className="text-purple-500" />
                        رعایت محدودیت کاراکتر پیامک
                     </li>
                  </ul>
                  <Button className="bg-purple-600 hover:bg-purple-700 border-none text-white">تست رایگان AI</Button>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="order-1 lg:order-2 flex justify-center"
               >
                  <AiSmsAnimation />
               </motion.div>
            </div>

            {/* Feature 2: Email Designer */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="flex justify-center"
               >
                  <AiEmailAnimation />
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
               >
                  <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                     <PenTool size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">طراح خودکار ایمیل</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                     فقط موضوع ایمیل را بگویید، هوش مصنوعی پیکسا یک تمپلیت کامل و حرفه‌ای با تصاویر، متن و دکمه‌های اقدام (CTA) برای شما طراحی می‌کند.
                  </p>
                  <ul className="space-y-4 mb-8">
                     <li className="flex items-center gap-3 text-slate-300">
                        <CheckCircle size={20} className="text-blue-500" />
                        انتخاب هوشمند تصاویر مرتبط
                     </li>
                     <li className="flex items-center gap-3 text-slate-300">
                        <CheckCircle size={20} className="text-blue-500" />
                        طراحی ریسپانسیو (موبایل و دسکتاپ)
                     </li>
                  </ul>
                  <Button className="bg-blue-600 hover:bg-blue-700 border-none text-white">مشاهده دمو</Button>
               </motion.div>
            </div>

            {/* Feature 3: CRM Agent */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="order-2 lg:order-1"
               >
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-6">
                     <Bot size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">دستیار تحلیلگر CRM</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                     با داده‌های خود چت کنید! از دستیار هوشمند بپرسید «فروش هفته گذشته چطور بود؟» یا «کدام مشتریان در خطر ریزش هستند؟» و پاسخ دقیق بگیرید.
                  </p>
                  <ul className="space-y-4 mb-8">
                     <li className="flex items-center gap-3 text-slate-300">
                        <CheckCircle size={20} className="text-green-500" />
                        تولید نمودار در لحظه
                     </li>
                     <li className="flex items-center gap-3 text-slate-300">
                        <CheckCircle size={20} className="text-green-500" />
                        پیشنهادات عملی برای افزایش فروش
                     </li>
                  </ul>
                  <Button className="bg-green-600 hover:bg-green-700 border-none text-white">فعال‌سازی دستیار</Button>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="order-1 lg:order-2 flex justify-center"
               >
                  <AiAgentAnimation />
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* User Journey (How It Works) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">مسیر موفقیت با پیکسا</h2>
            <p className="text-slate-600 text-lg">سه گام ساده برای تحول بازاریابی شما</p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent -z-10"></div>
            
            {[
              { num: 1, title: 'واردسازی داده‌ها', desc: 'مخاطبین خود را از اکسل یا API وارد کنید تا پروفایل‌های ۳۶۰ درجه ساخته شود.' },
              { num: 2, title: 'ساخت کمپین', desc: 'با ابزار Drag & Drop، پیام‌های شخصی‌سازی شده طراحی و زمان‌بندی کنید.' },
              { num: 3, title: 'رصد نتایج', desc: 'نتایج را در لحظه ببینید و استراتژی خود را برای فروش بیشتر بهینه کنید.' },
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative bg-white p-6 text-center"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg shadow-blue-600/30 relative z-10">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">آماده رشد کسب‌وکار خود هستید؟</h2>
            <p className="text-xl text-slate-300 mb-10">
              به جمع ۱۰,۰۰۰ کسب‌وکار ایرانی بپیوندید. ۱۴ روز استفاده کاملاً رایگان، بدون نیاز به کارت بانکی.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to={PageRoute.AUTH}>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto font-bold border-none !bg-white !text-slate-900 hover:!bg-slate-100"
                >
                  شروع رایگان
                </Button>
              </Link>
              <Link to={PageRoute.CONTACT}>
                <Button variant="outline" size="lg" className="border-slate-600 !text-white hover:bg-slate-800 hover:border-slate-500 w-full sm:w-auto">تماس با فروش</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

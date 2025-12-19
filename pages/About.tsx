
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Rocket, Smile, Calendar } from 'lucide-react';

const team = [
  { name: 'احمد رضایی', role: 'مدیرعامل و بنیان‌گذار', color: 'bg-blue-100 text-blue-600' },
  { name: 'مریم احمدی', role: 'مدیر فنی (CTO)', color: 'bg-indigo-100 text-indigo-600' },
  { name: 'علی محمدی', role: 'مدیر بازاریابی', color: 'bg-green-100 text-green-600' },
  { name: 'فاطمه کریمی', role: 'طراح رابط کاربری', color: 'bg-purple-100 text-purple-600' },
  { name: 'رضا حسینی', role: 'مدیر پشتیبانی', color: 'bg-orange-100 text-orange-600' },
  { name: 'سارا نوری', role: 'تحلیلگر داده', color: 'bg-rose-100 text-rose-600' },
];

export const About: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">درباره پیکسا</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            ماموریت ما: توانمندسازی کسب‌وکارهای ایرانی با فناوری‌های پیشرفته دیجیتال.
          </p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-bold mb-6">
                <Calendar size={16} />
                تأسیس: ۱۴۰۲
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">داستان ما</h2>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                <p>
                  پیکسا در سال ۱۴۰۲ با هدف حل مشکل «پراکندگی داده‌ها» در بازار ایران متولد شد. ما متوجه شدیم که کسب‌وکارها برای مدیریت مشتریان خود از چندین ابزار جداگانه استفاده می‌کنند که باعث سردرگمی و کاهش بهره‌وری می‌شد.
                </p>
                <p>
                  امروز، ما مفتخریم که به بیش از ۱۰,۰۰۰ کسب‌وکار کمک می‌کنیم تا داده‌های بازاریابی خود را در یک پلتفرم واحد متحد کنند.
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
              <div className="relative bg-slate-50 rounded-3xl h-80 flex items-center justify-center border border-slate-100 shadow-lg">
                <Rocket size={80} className="text-slate-300" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">تیم رهبری</h2>
            <p className="text-slate-600 text-lg">
              متخصصانی که با ارزش‌های «همکاری تیمی» و «نوآوری مداوم» پیکسا را می‌سازند.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-100 transition-all"
              >
                <div className={`h-32 ${member.color} flex items-center justify-center`}>
                  <Smile size={48} className="opacity-50" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-slate-500 font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

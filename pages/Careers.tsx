import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Rocket, Users, Lightbulb, Scale, TrendingUp, Coffee, MapPin, Clock, DollarSign, ArrowLeft, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageRoute } from '../types';

const benefits = [
  { icon: Rocket, title: 'رشد سریع', desc: 'فرصت کار روی پروژه‌های بزرگ با فناوری‌های روز دنیا' },
  { icon: Users, title: 'تیم حرفه‌ای', desc: 'همکاری با متخصصان برتر در حوزه بازاریابی دیجیتال' },
  { icon: Lightbulb, title: 'نوآوری دائمی', desc: 'فرصت مشارکت در پروژه‌های نوآورانه و تأثیرگذار' },
  { icon: Scale, title: 'تعادل زندگی', desc: 'محیط کاری انعطاف‌پذیر با ساعات کاری مناسب' },
  { icon: TrendingUp, title: 'آموزش و توسعه', desc: 'برنامه‌های آموزشی مداوم و فرصت‌های یادگیری' },
  { icon: DollarSign, title: 'پاداش رقابتی', desc: 'حقوق و مزایای رقابتی در صنعت فناوری' },
];

const positions = [
  { title: 'توسعه‌دهنده Frontend', type: 'تمام وقت', exp: '۲-۴ سال', tags: ['React', 'TS', 'Tailwind'] },
  { title: 'مدیر بازاریابی دیجیتال', type: 'تمام وقت', exp: '۳-۵ سال', tags: ['Strategy', 'SEO', 'Analytics'] },
  { title: 'طراح UI/UX', type: 'تمام وقت', exp: '۲-۴ سال', tags: ['Figma', 'Prototyping'] },
  { title: 'توسعه‌دهنده Backend', type: 'تمام وقت', exp: '۳-۵ سال', tags: ['Node.js', 'Python', 'SQL'] },
];

export const Careers: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">به تیم پیکسا بپیوندید</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12">
            جایی که نوآوری، خلاقیت و تأثیرگذاری با هم ملاقات می‌کنند. ما به دنبال استعدادهای درخشان هستیم.
          </p>
          <div className="flex justify-center gap-8 text-blue-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">۵۰+</div>
              <div className="text-sm">کارمند</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">۱۵+</div>
              <div className="text-sm">موقعیت باز</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">۵</div>
              <div className="text-sm">سال تجربه</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">چرا پیکسا؟</h2>
            <p className="text-slate-600">مزایای کار در محیطی پویا و رو به رشد</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-slate-50 p-8 rounded-2xl border border-slate-100"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-6">
                  <b.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{b.title}</h3>
                <p className="text-slate-600 text-sm">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">فرهنگ کاری ما</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                ما به دنبال افرادی هستیم که به رشد و یادگیری اهمیت می‌دهند. محیط کاری ما بر پایه احترام، همکاری و نوآوری بنا شده است. ما معتقدیم که بهترین ایده‌ها می‌توانند از هر کسی بیایند.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold">همکاری تیمی</h4>
                    <p className="text-sm text-slate-500">با هم رشد می‌کنیم و یاد می‌گیریم</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                    <Target size={20} className="text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold">تمرکز بر نتیجه</h4>
                    <p className="text-sm text-slate-500">به دنبال کیفیت و تأثیرگذاری هستیم</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center">
               <Coffee size={64} className="text-slate-600 opacity-50" />
               <p className="absolute bottom-4 text-slate-500 text-sm">محیط کاری دوستانه و پویا</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">موقعیت‌های شغلی باز</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {positions.map((pos, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{pos.title}</h3>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{pos.type}</span>
                </div>
                
                <div className="flex gap-4 text-sm text-slate-500 mb-6">
                  <div className="flex items-center gap-1"><MapPin size={14} /> تهران</div>
                  <div className="flex items-center gap-1"><Clock size={14} /> {pos.exp}</div>
                  <div className="flex items-center gap-1"><DollarSign size={14} /> حقوق رقابتی</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {pos.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                  <Link to={PageRoute.CONTACT}>
                    <Button variant="ghost" size="sm" className="group-hover:bg-blue-50">درخواست <ArrowLeft size={16} className="mr-1" /></Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">موقعیت مورد نظر خود را پیدا نکردید؟</h2>
          <p className="text-slate-600 mb-8">رزومه خود را برای ما ارسال کنید، ما همیشه به دنبال افراد با استعداد هستیم.</p>
          <Link to={PageRoute.CONTACT}>
            <Button variant="outline">ارسال رزومه عمومی</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
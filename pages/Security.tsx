
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Server, FileCheck, Globe, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { PageRoute } from '../types';

const features = [
  { icon: Lock, title: 'رمزگذاری داده‌ها', desc: 'رمزنگاری AES-256 برای داده‌های ذخیره شده و TLS 1.3 برای انتقال داده‌ها.' },
  { icon: Server, title: 'امنیت شبکه', desc: 'فایروال چند لایه، IDS/IPS و جداسازی شبکه VPC برای حفاظت حداکثری.' },
  { icon: Shield, title: 'پایداری ۹۹.۹٪', desc: 'تضمین پایداری سیستم و دسترسی مداوم به سرویس‌ها.' },
  { icon: Eye, title: 'نظارت ۲۴/۷', desc: 'تیم امنیتی ما به صورت شبانه‌روزی تهدیدات احتمالی را رصد می‌کند.' },
];

const certs = ['ISO 27001', 'SOC 2 Type II', 'GDPR Compliant', 'PCI DSS'];

export const Security: React.FC = () => {
  return (
    <div className="bg-white">
      <section className="py-24 bg-slate-900 text-white text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container mx-auto px-4"
        >
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-600/30">
            <Shield size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-6">امنیت در سطح جهانی</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            پیکسا متعهد به حفاظت از داده‌های شما با بالاترین استانداردهای امنیتی است.
          </p>
        </motion.div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {features.map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <feat.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">استانداردها و گواهینامه‌ها</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certs.map((cert, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center gap-4"
              >
                <FileCheck size={32} className="text-green-600" />
                <span className="font-bold text-slate-800">{cert}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

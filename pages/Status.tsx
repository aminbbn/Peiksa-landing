
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Server, Globe, Mail, MessageSquare, Database, Cloud } from 'lucide-react';

const services = [
  { name: 'وب‌سایت اصلی', icon: Globe, status: 'operational', uptime: '99.9%' },
  { name: 'سرویس ایمیل', icon: Mail, status: 'operational', uptime: '99.8%' },
  { name: 'سرویس پیامک', icon: MessageSquare, status: 'operational', uptime: '99.7%' },
  { name: 'API Gateway', icon: Server, status: 'operational', uptime: '99.9%' },
  { name: 'پایگاه داده', icon: Database, status: 'operational', uptime: '100%' },
  { name: 'زیرساخت ابری', icon: Cloud, status: 'operational', uptime: '99.9%' },
];

export const Status: React.FC = () => {
  return (
    <div className="bg-white">
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">وضعیت سیستم</h1>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium animate-pulse">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            همه سیستم‌ها عملیاتی هستند
          </div>
          <p className="text-slate-500 mt-4 text-sm">بروزرسانی خودکار هر ۶۰ ثانیه</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                    <service.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{service.name}</h3>
                    <p className="text-xs text-slate-500">{service.uptime} uptime</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle size={16} />
                  <span>فعال</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

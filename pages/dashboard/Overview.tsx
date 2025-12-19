
import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowUpRight, ArrowDownRight, CreditCard, Megaphone, Eye, Clock, TrendingUp, Calendar } from 'lucide-react';

const stats = [
  { title: 'کل مشتریان', value: '۱۲,۵۴۳', change: '+۱۲٪', isPositive: true, icon: Users, color: 'blue' },
  { title: 'درآمد این ماه', value: '۴۵۸,۰۰۰,۰۰۰', unit: 'تومان', change: '+۸.۲٪', isPositive: true, icon: CreditCard, color: 'green' },
  { title: 'کمپین‌های فعال', value: '۴', change: '-۱', isPositive: false, icon: Megaphone, color: 'purple' },
  { title: 'نرخ باز شدن', value: '۴۲.۸٪', change: '+۲.۴٪', isPositive: true, icon: Eye, color: 'amber' },
];

const recentActivities = [
  { type: 'campaign', title: 'کمپین یلدا ارسال شد', time: '۲ ساعت پیش', desc: 'ارسال موفق به ۵۰۰۰ کاربر', icon: Megaphone, color: 'bg-purple-100 text-purple-600' },
  { type: 'user', title: 'مشتری جدید: علی کریمی', time: '۳ ساعت پیش', desc: 'ثبت نام از طریق وب‌سایت', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { type: 'alert', title: 'هشدار موجودی پیامک', time: '۵ ساعت پیش', desc: 'اعتبار پنل پیامک رو به اتمام است', icon: Clock, color: 'bg-red-100 text-red-600' },
  { type: 'sale', title: 'خرید موفق #8921', time: '۶ ساعت پیش', desc: 'مبلغ: ۲,۵۰۰,۰۰۰ تومان', icon: CreditCard, color: 'bg-green-100 text-green-600' },
];

export const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">پیشخوان</h1>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-2">
          <Calendar size={16} />
          ۱۵ آذر ۱۴۰۳
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                stat.color === 'green' ? 'bg-green-50 text-green-600' :
                stat.color === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
              }`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {stat.isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                {stat.unit && <span className="text-xs text-slate-500 font-medium">{stat.unit}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              روند رشد فروش
            </h3>
            <select className="bg-slate-50 border-none text-sm rounded-lg px-3 py-1 text-slate-600 focus:ring-0">
              <option>۷ روز گذشته</option>
              <option>۳۰ روز گذشته</option>
              <option>امسال</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 25, 55, 45, 70, 65, 85, 60, 75, 90, 50, 80].map((h, i) => (
              <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group hover:bg-blue-100 transition-colors">
                <div 
                  style={{ height: `${h}%` }} 
                  className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all group-hover:bg-blue-600"
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-400 px-2">
            <span>شنبه</span>
            <span>دوشنبه</span>
            <span>چهارشنبه</span>
            <span>جمعه</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">فعالیت‌های اخیر</h3>
          <div className="space-y-6">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex gap-4 relative">
                {idx !== recentActivities.length - 1 && (
                  <div className="absolute top-10 right-5 bottom-[-24px] w-0.5 bg-slate-100"></div>
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${activity.color}`}>
                  <activity.icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{activity.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{activity.desc}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

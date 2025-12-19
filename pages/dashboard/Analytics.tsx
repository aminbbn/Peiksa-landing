
import React from 'react';
import { PieChart, BarChart, Calendar } from 'lucide-react';

export const DashboardAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-900">گزارشات و تحلیل‌ها</h1>
         <div className="bg-white border border-slate-200 rounded-lg p-1 flex text-sm">
            <button className="px-3 py-1 bg-slate-100 rounded font-bold text-slate-800">هفتگی</button>
            <button className="px-3 py-1 text-slate-500 hover:text-slate-800">ماهانه</button>
            <button className="px-3 py-1 text-slate-500 hover:text-slate-800">سالانه</button>
         </div>
       </div>

       <div className="grid md:grid-cols-2 gap-6">
          {/* ROI Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart size={20} className="text-green-500" />
                بازگشت سرمایه (ROI)
             </h3>
             <div className="h-64 flex items-end justify-around gap-4">
                {[30, 50, 45, 70, 60, 90, 80].map((h, i) => (
                   <div key={i} className="w-full bg-green-50 rounded-t-lg relative group">
                      <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-green-500 rounded-t-lg transition-all group-hover:bg-green-600"></div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                         {h}M
                      </div>
                   </div>
                ))}
             </div>
             <div className="flex justify-between mt-4 text-xs text-slate-400">
                <span>ش</span><span>ی</span><span>د</span><span>س</span><span>چ</span><span>پ</span><span>ج</span>
             </div>
          </div>

          {/* Channels */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PieChart size={20} className="text-blue-500" />
                کانال‌های ورودی
             </h3>
             <div className="flex items-center justify-center h-64 relative">
                {/* Simple CSS Pie Chart Representation */}
                <div className="w-48 h-48 rounded-full bg-blue-500 border-[8px] border-white shadow-xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-purple-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%)' }}></div>
                   <div className="absolute inset-0 bg-amber-500" style={{ clipPath: 'polygon(50% 50%, 0 100%, 0 50%)' }}></div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center z-10">
                      <span className="font-bold text-slate-800">کل: ۱۲K</span>
                   </div>
                </div>
             </div>
             <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-xs">
                   <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                   <span className="text-slate-600">گوگل (۵۰٪)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                   <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                   <span className="text-slate-600">اینستاگرام (۳۵٪)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                   <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                   <span className="text-slate-600">مستقیم (۱۵٪)</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

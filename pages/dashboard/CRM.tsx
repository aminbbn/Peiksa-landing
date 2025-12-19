
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, MoreHorizontal, Plus, Phone, Mail, X, User, CheckCircle } from 'lucide-react';
import { Customer } from '../../types';
import { Button } from '../../components/ui/Button';

const initialCustomers: Customer[] = [
  { id: '1', name: 'علی رضایی', email: 'ali.rezaei@gmail.com', phone: '09121234567', status: 'active', spent: 12500000, lastSeen: '۲ ساعت پیش', tags: ['VIP', 'قدیمی'] },
  { id: '2', name: 'سارا احمدی', email: 'sara.ah@yahoo.com', phone: '09351234567', status: 'active', spent: 4500000, lastSeen: '۱ روز پیش', tags: ['خریدار'] },
  { id: '3', name: 'شرکت فناوران', email: 'info@fanavaran.co', phone: '02188888888', status: 'active', spent: 56000000, lastSeen: '۳ روز پیش', tags: ['شرکتی', 'عمده'] },
  { id: '4', name: 'رضا محمدی', email: 'reza.moh@gmail.com', phone: '09191234567', status: 'inactive', spent: 0, lastSeen: '۱ ماه پیش', tags: ['لید'] },
  { id: '5', name: 'مریم کریمی', email: 'maryam.k@gmail.com', phone: '09129876543', status: 'lead', spent: 0, lastSeen: '۵ روز پیش', tags: ['خبرنامه'] },
];

export const DashboardCRM: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      status: 'active',
      spent: 0,
      lastSeen: 'همین الان',
      tags: ['جدید']
    };
    setCustomers([customer, ...customers]);
    setIsAddModalOpen(false);
    setNewCustomer({ name: '', phone: '', email: '' });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">مشتریان (CRM)</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">
            <Download size={18} />
            خروجی اکسل
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm shadow-lg shadow-blue-600/30"
          >
            <Plus size={18} />
            مشتری جدید
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="جستجو با نام، ایمیل یا شماره..." 
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl text-slate-600 font-medium hover:bg-slate-100">
            <Filter size={18} />
            فیلترها
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">مشتری</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">اطلاعات تماس</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">وضعیت</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">مجموع خرید</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">آخرین بازدید</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.filter(c => c.name.includes(searchTerm) || c.phone.includes(searchTerm)).map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{customer.name}</div>
                        <div className="flex gap-1 mt-1">
                          {customer.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      customer.status === 'active' ? 'bg-green-100 text-green-700' :
                      customer.status === 'lead' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {customer.status === 'active' ? 'فعال' : customer.status === 'lead' ? 'سرنخ' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{customer.spent.toLocaleString('fa-IR')} <span className="text-[10px] text-slate-500 font-normal">تومان</span></div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {customer.lastSeen}
                  </td>
                  <td className="px-6 py-4 text-left">
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="text-xs text-slate-500">نمایش ۱ تا {customers.length} از {customers.length}</div>
          <div className="flex gap-2">
             <button className="px-3 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-400 disabled:opacity-50" disabled>قبلی</button>
             <button className="px-3 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50">بعدی</button>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900">افزودن مشتری جدید</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">نام و نام خانوادگی</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                      placeholder="مثال: محمد نوری"
                    />
                    <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">شماره موبایل</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      required
                      dir="ltr"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-left"
                      placeholder="0912..."
                    />
                    <Phone size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">ایمیل (اختیاری)</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      dir="ltr"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-left"
                      placeholder="mail@example.com"
                    />
                    <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="flex-1">انصراف</Button>
                  <Button type="submit" className="flex-1 shadow-lg shadow-blue-600/20">
                    <CheckCircle size={18} className="mr-2" />
                    ثبت مشتری
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

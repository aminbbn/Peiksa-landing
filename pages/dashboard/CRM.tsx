
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, MoreHorizontal, Plus, Phone, Mail, X, User, CheckCircle, MapPin, Globe, Flag, XCircle, Tag, Trash2, Check, AlertTriangle } from 'lucide-react';
import { Customer } from '../../types';
import { Button } from '../../components/ui/Button';

const initialCustomers: Customer[] = [
  { 
    id: '1', 
    name: 'علی رضایی', 
    email: 'ali.rezaei@gmail.com', 
    phone: '09121234567', 
    isEmailable: true, 
    lastEmailSent: '1403/09/15', 
    language: 'فارسی', 
    gender: 'Male', 
    nationality: 'ایرانی', 
    address1: 'تهران، خیابان ولیعصر', 
    address2: 'کوچه چهارم، پلاک ۱۲', 
    tags: ['VIP', 'قدیمی'] 
  },
  { 
    id: '2', 
    name: 'سارا احمدی', 
    email: 'sara.ah@yahoo.com', 
    phone: '09351234567', 
    isEmailable: false, 
    language: 'انگلیسی', 
    gender: 'Female', 
    nationality: 'کانادایی', 
    address1: 'ونک، خیابان ملاصدرا', 
    address2: '', 
    tags: ['خریدار', 'لید'] 
  },
  { 
    id: '3', 
    name: 'محمد نوری', 
    email: 'mohammad@company.com', 
    phone: '09199998888', 
    isEmailable: true, 
    lastEmailSent: '1403/09/20', 
    language: 'فارسی', 
    gender: 'Male', 
    nationality: 'ایرانی', 
    address1: 'اصفهان، چهارباغ عباسی', 
    address2: 'مجتمع تجاری نگین', 
    tags: ['شرکتی'] 
  },
  { 
    id: '4', 
    name: 'الناز شاکردوست', 
    email: 'elnaz.sh@gmail.com', 
    phone: '09127776655', 
    isEmailable: true, 
    lastEmailSent: '1403/09/10', 
    language: 'فارسی', 
    gender: 'Female', 
    nationality: 'ایرانی', 
    address1: 'تهران، زعفرانیه', 
    address2: 'برج الماس', 
    tags: ['اینفلوئنسر', 'همکار'] 
  },
];

// Animation Variants - Simplified to match other pages
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export const DashboardCRM: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Tag Management State
  const [addingTagId, setAddingTagId] = useState<string | null>(null);
  const [newTagValue, setNewTagValue] = useState('');

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({ 
    name: '', phone: '', email: '', 
    isEmailable: true, gender: 'Male', 
    language: 'فارسی', nationality: 'ایرانی',
    address1: '', address2: '', tags: []
  });

  // Derived state for filtering
  const filteredCustomers = customers.filter(c => 
    c.name.includes(searchTerm) || 
    c.phone.includes(searchTerm) ||
    c.tags.some(t => t.includes(searchTerm))
  );

  const isAllSelected = filteredCustomers.length > 0 && selectedIds.length === filteredCustomers.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map(c => c.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const executeBulkDelete = () => {
    setCustomers(customers.filter(c => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    setIsDeleteConfirmOpen(false);
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name || 'نامشخص',
      email: newCustomer.email || '',
      phone: newCustomer.phone || '',
      isEmailable: newCustomer.isEmailable || false,
      lastEmailSent: newCustomer.isEmailable ? 'ارسال نشده' : undefined,
      language: newCustomer.language || 'فارسی',
      gender: newCustomer.gender as any || 'Other',
      nationality: newCustomer.nationality || 'ایرانی',
      address1: newCustomer.address1 || '',
      address2: newCustomer.address2 || '',
      tags: ['جدید']
    };
    setCustomers([customer, ...customers]);
    setIsAddModalOpen(false);
    setNewCustomer({ name: '', phone: '', email: '', isEmailable: true, gender: 'Male', language: 'فارسی', nationality: 'ایرانی', address1: '', address2: '' });
  };

  const handleAddTag = (customerId: string) => {
    if (!newTagValue.trim()) {
        setAddingTagId(null);
        return;
    }
    setCustomers(customers.map(c => 
      c.id === customerId ? { ...c, tags: [...c.tags, newTagValue.trim()] } : c
    ));
    setNewTagValue('');
    setAddingTagId(null);
  };

  const handleRemoveTag = (customerId: string, tagToRemove: string) => {
    setCustomers(customers.map(c => 
      c.id === customerId ? { ...c, tags: c.tags.filter(t => t !== tagToRemove) } : c
    ));
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 relative h-[calc(100vh-140px)] flex flex-col"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
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
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center shrink-0">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="جستجو با نام، ایمیل، شماره یا تگ..." 
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
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col relative">
        <div className="overflow-auto custom-scrollbar flex-1 pb-20">
          <table className="w-full text-right min-w-[1200px]">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 w-[50px]">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                    />
                    <Check size={14} strokeWidth={3} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 w-[200px]">اسم و فامیلی</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 w-[250px]">شماره تلفن و ایمیل</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 w-[180px]">وضعیت ایمیل</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 w-[120px]">زبان</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 w-[100px]">جنسیت</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 w-[120px]">ملیت</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 w-[200px]">آدرس ۱</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 w-[200px]">آدرس ۲</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 min-w-[200px]">تگ‌ها</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => {
                const isSelected = selectedIds.includes(customer.id);
                return (
                  <tr 
                    key={customer.id} 
                    className={`transition-colors group ${isSelected ? 'bg-blue-50/80 hover:bg-blue-50' : 'hover:bg-slate-50/50'}`}
                  >
                    
                    {/* Checkbox */}
                    <td className="px-6 py-4">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleSelect(customer.id)}
                          className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                        />
                        <Check size={14} strokeWidth={3} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="font-bold text-slate-900 text-sm truncate">{customer.name}</div>
                      </div>
                    </td>

                    {/* Phone & Email */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded w-fit">
                          <Phone size={14} className="text-slate-400" />
                          <span dir="ltr" className="font-mono text-xs">{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 px-2">
                          <Mail size={14} className="text-slate-400" />
                          <span dir="ltr" className="truncate max-w-[150px]">{customer.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email Status */}
                    <td className="px-6 py-4">
                      {customer.isEmailable ? (
                        <div>
                          <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold mb-1">
                            <CheckCircle size={14} />
                            <span>مجاز</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            آخرین ارسال: {customer.lastEmailSent || '-'}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-full w-fit">
                          <XCircle size={14} />
                          <span>غیرمجاز</span>
                        </div>
                      )}
                    </td>

                    {/* Language */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Globe size={16} className="text-blue-400" />
                        {customer.language}
                      </div>
                    </td>

                    {/* Gender */}
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        customer.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 
                        customer.gender === 'Female' ? 'bg-pink-50 text-pink-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {customer.gender === 'Male' ? 'مرد' : customer.gender === 'Female' ? 'زن' : 'سایر'}
                      </span>
                    </td>

                    {/* Nationality */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Flag size={16} className="text-amber-500" />
                        {customer.nationality}
                      </div>
                    </td>

                    {/* Address 1 */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-600 leading-relaxed max-w-[180px] truncate" title={customer.address1}>
                        {customer.address1 || '-'}
                      </div>
                    </td>

                    {/* Address 2 */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-500 leading-relaxed max-w-[180px] truncate" title={customer.address2}>
                        {customer.address2 || '-'}
                      </div>
                    </td>

                    {/* Tags */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {customer.tags.map(tag => (
                          <div key={tag} className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 group/tag">
                            {tag}
                            <button 
                              onClick={() => handleRemoveTag(customer.id, tag)}
                              className="text-slate-400 hover:text-red-500 hidden group-hover/tag:block"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        
                        {addingTagId === customer.id ? (
                          <div className="flex items-center">
                            <input 
                              autoFocus
                              type="text"
                              value={newTagValue}
                              onChange={(e) => setNewTagValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddTag(customer.id);
                                if (e.key === 'Escape') setAddingTagId(null);
                              }}
                              onBlur={() => handleAddTag(customer.id)}
                              className="w-20 text-[10px] bg-white border border-blue-400 rounded px-1 py-0.5 outline-none"
                              placeholder="تگ جدید..."
                            />
                          </div>
                        ) : (
                          <button 
                            onClick={() => setAddingTagId(customer.id)}
                            className="w-5 h-5 flex items-center justify-center bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-left">
                      <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Floating Bulk Action Bar - REDESIGNED */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
            >
              <div className="bg-white p-2 pr-4 pl-2 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 flex items-center gap-4 md:gap-6">
                
                {/* Selection Count */}
                <div className="flex items-center gap-3">
                   <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold shadow-md shadow-slate-900/20">
                      {selectedIds.length}
                   </div>
                   <span className="text-sm font-bold text-slate-700 whitespace-nowrap hidden sm:inline-block">مشتری انتخاب شد</span>
                </div>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-slate-200"></div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                   <button 
                     onClick={() => setSelectedIds([])} 
                     className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors rounded-full hover:bg-slate-100"
                   >
                     لغو
                   </button>
                   <button 
                     onClick={handleBulkDeleteClick} 
                     className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-red-500/30 hover:shadow-red-600/40 active:scale-95"
                   >
                     <Trash2 size={16} />
                     <span className="hidden sm:inline">حذف</span>
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div className="text-xs text-slate-500">نمایش ۱ تا {customers.length} از {customers.length}</div>
          <div className="flex gap-2">
             <button className="px-3 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-400 disabled:opacity-50" disabled>قبلی</button>
             <button className="px-3 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50">بعدی</button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsDeleteConfirmOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">حذف {selectedIds.length} مشتری</h3>
                <p className="text-sm text-slate-500 mb-6">
                  آیا از حذف مشتریان انتخاب شده اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
                </p>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1">انصراف</Button>
                  <Button onClick={executeBulkDelete} className="flex-1 bg-red-500 hover:bg-red-600 border-none shadow-red-500/20">
                    بله، حذف کن
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <h3 className="text-lg font-bold text-slate-900">افزودن مشتری جدید</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleAddCustomer} className="p-6 space-y-6 overflow-y-auto">
                {/* Personal Info */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <User size={14} />
                    اطلاعات هویتی
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">نام و نام خانوادگی</label>
                      <input 
                        type="text" required
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                        placeholder="مثال: محمد نوری"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">جنسیت</label>
                        <select 
                          value={newCustomer.gender}
                          onChange={(e) => setNewCustomer({...newCustomer, gender: e.target.value as any})}
                          className="w-full px-2 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                        >
                          <option value="Male">مرد</option>
                          <option value="Female">زن</option>
                          <option value="Other">سایر</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">ملیت</label>
                        <input 
                          type="text"
                          value={newCustomer.nationality}
                          onChange={(e) => setNewCustomer({...newCustomer, nationality: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <Phone size={14} />
                    اطلاعات تماس
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">شماره موبایل</label>
                      <input 
                        type="tel" required dir="ltr"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-left"
                        placeholder="0912..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">ایمیل</label>
                      <input 
                        type="email" dir="ltr"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-left"
                        placeholder="mail@example.com"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newCustomer.isEmailable}
                        onChange={(e) => setNewCustomer({...newCustomer, isEmailable: e.target.checked})}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-sm text-slate-700">مجاز به دریافت ایمیل</span>
                    </label>
                    <div className="flex items-center gap-2">
                       <span className="text-sm text-slate-700 font-bold">زبان:</span>
                       <select 
                          value={newCustomer.language}
                          onChange={(e) => setNewCustomer({...newCustomer, language: e.target.value})}
                          className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-sm"
                        >
                          <option value="فارسی">فارسی</option>
                          <option value="انگلیسی">انگلیسی</option>
                          <option value="عربی">عربی</option>
                        </select>
                    </div>
                  </div>
                </div>

                {/* Address Info */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <MapPin size={14} />
                    آدرس‌ها
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">آدرس ۱ (اصلی)</label>
                      <input 
                        type="text"
                        value={newCustomer.address1}
                        onChange={(e) => setNewCustomer({...newCustomer, address1: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                        placeholder="استان، شهر، خیابان..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">آدرس ۲ (فرعی/محل کار)</label>
                      <input 
                        type="text"
                        value={newCustomer.address2}
                        onChange={(e) => setNewCustomer({...newCustomer, address2: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3 border-t border-slate-100">
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
    </motion.div>
  );
};


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Download, MoreHorizontal, Plus, Phone, Mail, X, User, 
  CheckCircle, MapPin, Globe, XCircle, Tag, Trash2, Check, AlertTriangle, 
  Copy, Layers, Filter, Clock, ChevronDown,
  LayoutGrid, Heart, Target, Crown, List, Star, Zap, Flag, Bookmark, Briefcase, Shield, Users,
  Award, Gift, ShoppingBag, Truck, Headphones, Settings, PenTool, Camera, Music
} from 'lucide-react';
import { Customer } from '../../types';
import { Button } from '../../components/ui/Button';
import { CustomerDetailPanel } from '../../components/dashboard/crm/CustomerDetailPanel';

// --- Icons & Colors for List Creation ---
const ICON_OPTIONS = [
  { id: 'List', icon: List },
  { id: 'Heart', icon: Heart },
  { id: 'Target', icon: Target },
  { id: 'Crown', icon: Crown },
  { id: 'Star', icon: Star },
  { id: 'Zap', icon: Zap },
  { id: 'Users', icon: Users },
  { id: 'Briefcase', icon: Briefcase },
  { id: 'Flag', icon: Flag },
  { id: 'Bookmark', icon: Bookmark },
  { id: 'Shield', icon: Shield },
  { id: 'LayoutGrid', icon: LayoutGrid },
  { id: 'Award', icon: Award },
  { id: 'Gift', icon: Gift },
  { id: 'ShoppingBag', icon: ShoppingBag },
  { id: 'Truck', icon: Truck },
  { id: 'Headphones', icon: Headphones },
  { id: 'Phone', icon: Phone },
  { id: 'Mail', icon: Mail },
  { id: 'Globe', icon: Globe },
  { id: 'Settings', icon: Settings },
  { id: 'PenTool', icon: PenTool },
  { id: 'Camera', icon: Camera },
  { id: 'Music', icon: Music },
];

const COLOR_OPTIONS = [
  { id: 'slate', bg: 'bg-slate-500', text: 'text-slate-600', ring: 'ring-slate-500' },
  { id: 'blue', bg: 'bg-blue-600', text: 'text-blue-600', ring: 'ring-blue-600' },
  { id: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-500' },
  { id: 'amber', bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-500' },
  { id: 'rose', bg: 'bg-rose-500', text: 'text-rose-600', ring: 'ring-rose-500' },
  { id: 'purple', bg: 'bg-purple-600', text: 'text-purple-600', ring: 'ring-purple-600' },
];

// --- Mock Data (Based on 17 required fields) ---
const initialCustomers: Customer[] = [
  { 
    id: 'CS-1001', 
    firstName: 'علی',
    lastName: 'رضایی', 
    phone: '09121234567', 
    email: 'ali.rezaei@gmail.com', 
    isEmailable: true, 
    lastEmailDate: '1403/09/15 10:30',
    lastEmailSubject: 'تخفیف ویژه یلدا',
    lastSmsDate: '1403/09/16 14:20',
    lastSmsSubject: 'کد تخفیف: YALDA20',
    language: 'فارسی', 
    gender: 'Male', 
    nationality: 'ایرانی', 
    address1: 'تهران، خیابان ولیعصر، کوچه چهارم، پلاک ۱۲', 
    address2: '', 
    workAddress: 'تهران، جردن، برج سایه، طبقه ۵',
    tags: ['VIP', 'قدیمی'],
    group: 'مشتریان وفادار',
    interestScore: 85,
    status: 'active'
  },
  { 
    id: 'CS-1002', 
    firstName: 'سارا', 
    lastName: 'احمدی',
    phone: '09351234567', 
    email: 'sara.ah@yahoo.com', 
    isEmailable: false,
    lastEmailDate: '1403/08/20 09:00',
    lastEmailSubject: 'خوش‌آمدگویی',
    lastSmsDate: undefined,
    lastSmsSubject: undefined, 
    language: 'انگلیسی', 
    gender: 'Female', 
    nationality: 'کانادایی', 
    address1: 'ونک، خیابان ملاصدرا، پلاک ۵۰', 
    address2: '', 
    workAddress: '',
    tags: ['خریدار', 'لید'],
    group: 'سرنخ‌ها',
    interestScore: 45,
    status: 'inactive'
  },
  { 
    id: 'CS-1003', 
    firstName: 'محمد', 
    lastName: 'نوری',
    phone: '09199998888', 
    email: 'mohammad@company.com', 
    isEmailable: true, 
    lastEmailDate: '1403/09/20 11:15', 
    lastEmailSubject: 'فاکتور خرید #892',
    lastSmsDate: '1403/09/20 11:16',
    lastSmsSubject: 'سفارش شما ثبت شد',
    language: 'فارسی', 
    gender: 'Male', 
    nationality: 'ایرانی', 
    address1: 'اصفهان، چهارباغ عباسی', 
    address2: 'مجتمع تجاری نگین', 
    workAddress: 'اصفهان، شهرک صنعتی جی',
    tags: ['شرکتی', 'عمده'],
    group: 'عمومی',
    interestScore: 60,
    status: 'active'
  },
  { 
    id: 'CS-1004', 
    firstName: 'الناز', 
    lastName: 'شاکردوست',
    phone: '09127776655', 
    email: 'elnaz.sh@gmail.com', 
    isEmailable: true, 
    lastEmailDate: '1403/09/10 18:00', 
    lastEmailSubject: 'دعوت‌نامه رویداد',
    lastSmsDate: '1403/09/10 18:05',
    lastSmsSubject: 'یادآوری رویداد',
    language: 'فارسی', 
    gender: 'Female', 
    nationality: 'ایرانی', 
    address1: 'تهران، زعفرانیه', 
    address2: 'برج الماس، پنت هاوس', 
    workAddress: '',
    tags: ['اینفلوئنسر', 'همکار'],
    group: 'VIP',
    interestScore: 98,
    status: 'active'
  },
];

// Initial Groups State
const INITIAL_GROUPS = [
  { id: 'all', name: 'همه', description: 'نمایش تمام مخاطبین', color: 'slate', icon: LayoutGrid },
  { id: 'loyal', name: 'مشتریان وفادار', description: 'خریداران تکراری و با ارزش', color: 'blue', icon: Heart },
  { id: 'leads', name: 'سرنخ‌ها', description: 'مشتریان بالقوه', color: 'amber', icon: Target },
  { id: 'public', name: 'عمومی', description: 'کاربران ثبت نام شده', color: 'slate', icon: Users },
  { id: 'vip', name: 'VIP', description: 'افراد خاص و مهم', color: 'purple', icon: Crown },
  { id: 'lost', name: 'از دست رفته', description: 'غیرفعال یا لغو اشتراک', color: 'rose', icon: XCircle },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 }
};

export const DashboardCRM: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState('همه');
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals & Panels State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Create List State
  const [newList, setNewList] = useState({ name: '', description: '', color: 'blue', icon: 'List' });

  // Copy Feedback
  const [copyFeedback, setCopyFeedback] = useState<{id: string, type: 'email'|'phone'} | null>(null);

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({ 
    firstName: '', lastName: '', phone: '', email: '', 
    isEmailable: true, gender: 'Male', 
    language: 'فارسی', nationality: 'ایرانی',
    address1: '', address2: '', workAddress: '',
    tags: [], group: 'عمومی', interestScore: 50
  });
  const [newCustomerTag, setNewCustomerTag] = useState('');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.firstName.includes(searchTerm) || 
      c.lastName?.includes(searchTerm) ||
      c.phone.includes(searchTerm) ||
      c.tags.some(t => t.includes(searchTerm));
    
    const matchesGroup = activeGroup === 'همه' || c.group === activeGroup;

    return matchesSearch && matchesGroup;
  });

  const isAllSelected = filteredCustomers.length > 0 && selectedIds.length === filteredCustomers.length;

  const handleCopy = (text: string, id: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopyFeedback({ id, type });
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleSelectAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds(filteredCustomers.map(c => c.id));
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(sid => sid !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const executeBulkDelete = () => {
    setCustomers(customers.filter(c => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    setIsDeleteConfirmOpen(false);
  };

  const executeSingleDelete = (id: string) => {
    if (confirm('آیا از حذف این مشتری اطمینان دارید؟')) {
      setCustomers(customers.filter(c => c.id !== id));
      setSelectedCustomer(null);
    }
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setSelectedCustomer(updatedCustomer); // Keep the panel open with new data
  };

  const handleMoveGroup = (newGroup: string, ids: string[]) => {
    setCustomers(customers.map(c => ids.includes(c.id) ? { ...c, group: newGroup } : c));
    setSelectedIds([]);
    if (selectedCustomer && ids.includes(selectedCustomer.id)) {
        setSelectedCustomer({ ...selectedCustomer, group: newGroup });
    }
  };

  const handleAddCustomerTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCustomerTag.trim()) {
      e.preventDefault();
      const currentTags = newCustomer.tags || [];
      if (!currentTags.includes(newCustomerTag.trim())) {
        setNewCustomer({ ...newCustomer, tags: [...currentTags, newCustomerTag.trim()] });
      }
      setNewCustomerTag('');
    }
  };

  const handleRemoveNewCustomerTag = (tagToRemove: string) => {
    setNewCustomer({ ...newCustomer, tags: (newCustomer.tags || []).filter(t => t !== tagToRemove) });
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      id: `CS-${Math.floor(Math.random() * 10000)}`,
      firstName: newCustomer.firstName || '',
      lastName: newCustomer.lastName || '',
      email: newCustomer.email || '',
      phone: newCustomer.phone || '',
      isEmailable: newCustomer.isEmailable ?? true,
      language: newCustomer.language || 'فارسی',
      gender: newCustomer.gender as any || 'Male',
      nationality: newCustomer.nationality || 'ایرانی',
      address1: newCustomer.address1 || '',
      address2: newCustomer.address2 || '',
      workAddress: newCustomer.workAddress || '',
      tags: newCustomer.tags || ['جدید'],
      group: newCustomer.group || 'عمومی',
      interestScore: newCustomer.interestScore || 50,
      status: 'active'
    };
    setCustomers([customer, ...customers]);
    setIsAddModalOpen(false);
    setNewCustomer({ 
      firstName: '', lastName: '', phone: '', email: '', 
      isEmailable: true, gender: 'Male', 
      language: 'فارسی', nationality: 'ایرانی', 
      address1: '', address2: '', workAddress: '', 
      tags: [], group: 'عمومی', interestScore: 50
    });
    setNewCustomerTag('');
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newList.name) return;

    const iconObj = ICON_OPTIONS.find(i => i.id === newList.icon)?.icon || List;
    
    setGroups([...groups, {
      id: Date.now().toString(),
      name: newList.name,
      description: newList.description,
      color: newList.color,
      icon: iconObj
    }]);
    
    setIsCreateListOpen(false);
    setNewList({ name: '', description: '', color: 'blue', icon: 'List' });
  };

  const getInterestColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 shadow-emerald-500/30';
    if (score >= 50) return 'bg-amber-500 shadow-amber-500/30';
    return 'bg-red-500 shadow-red-500/30';
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col relative font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-5 mb-6 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              لیست مشتریان
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">{customers.length}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">مدیریت و پایش وضعیت مشتریان و سرنخ‌های فروش</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold text-xs transition-all shadow-sm">
              <Download size={16} />
              خروجی اکسل
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Plus size={16} />
              مشتری جدید
            </button>
          </div>
        </div>

        {/* --- FILTERS --- */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex overflow-x-auto no-scrollbar w-full xl:w-auto gap-1 items-center">
              {groups.map(group => {
                 const isActive = activeGroup === group.name;
                 const activeColorClass = COLOR_OPTIONS.find(c => c.id === group.color)?.bg || 'bg-slate-900';
                 return (
                   <button
                     key={group.id}
                     onClick={() => setActiveGroup(group.name)}
                     className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        isActive 
                          ? `${activeColorClass} text-white shadow-md` 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                     }`}
                     title={group.description}
                   >
                      <group.icon size={14} />
                      {group.name}
                   </button>
                 );
              })}
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button 
                onClick={() => setIsCreateListOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
              >
                 <Plus size={14} />
                 لیست جدید
              </button>
           </div>
           
           <div className="flex w-full xl:w-auto gap-2">
             <div className="relative flex-1 xl:w-80 group">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="جستجو نام، ایمیل، شماره..." 
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm outline-none font-medium placeholder:font-normal"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-white hover:border-slate-300 transition-all">
                <Filter size={18} />
             </button>
           </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col relative"
      >
        <div className="overflow-auto custom-scrollbar flex-1 pb-20">
          <table className="w-full text-right min-w-[1400px]">
            <thead className="bg-slate-50/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
              <tr>
                <th className="px-4 py-4 w-[50px]">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                    <Check size={14} strokeWidth={3} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                </th>
                <th className="px-4 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">مشخصات کاربر</th>
                <th className="px-4 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">اطلاعات تماس</th>
                <th className="px-4 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">گروه & وضعیت</th>
                <th className="px-4 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">آخرین فعالیت</th>
                <th className="px-4 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">امتیاز</th>
                <th className="px-4 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">تگ‌ها</th>
                <th className="px-4 py-4 w-[60px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => {
                const isSelected = selectedIds.includes(customer.id);
                
                return (
                  <motion.tr 
                    key={customer.id}
                    variants={itemVariants}
                    className={`transition-colors group hover:bg-slate-50/50 ${isSelected ? 'bg-blue-50/40' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" checked={isSelected} onChange={() => handleSelect(customer.id)} className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                        <Check size={14} strokeWidth={3} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </td>

                    {/* Name & ID */}
                    <td className="px-4 py-3">
                      <div onClick={() => setSelectedCustomer(customer)} className="flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-slate-100 shadow-inner">
                          {customer.firstName.charAt(0)}
                        </div>
                        <div>
                           <div className="font-bold text-slate-800 text-sm hover:text-blue-600 transition-colors">{customer.firstName} {customer.lastName}</div>
                           <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-400 font-mono">{customer.id}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-[10px] text-slate-500">{customer.language}</span>
                           </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact (Phone & Email) */}
                    <td className="px-4 py-3">
                       <div className="flex flex-col gap-1.5">
                          {/* Phone */}
                          <div 
                            onClick={() => handleCopy(customer.phone, customer.id, 'phone')}
                            className="group/copy flex items-center gap-2 cursor-pointer w-fit"
                          >
                             <Phone size={12} className="text-slate-400" />
                             <span dir="ltr" className="text-xs font-bold text-slate-600 font-mono group-hover/copy:text-blue-600 transition-colors">
                                {copyFeedback?.id === customer.id && copyFeedback.type === 'phone' ? <span className="text-green-600">کپی شد!</span> : customer.phone}
                             </span>
                          </div>
                          {/* Email */}
                          <div 
                            onClick={() => handleCopy(customer.email, customer.id, 'email')}
                            className="group/copy flex items-center gap-2 cursor-pointer w-fit"
                          >
                             <Mail size={12} className="text-slate-400" />
                             <span dir="ltr" className="text-xs font-medium text-slate-600 group-hover/copy:text-blue-600 transition-colors truncate max-w-[180px]">
                                {copyFeedback?.id === customer.id && copyFeedback.type === 'email' ? <span className="text-green-600">کپی شد!</span> : customer.email}
                             </span>
                          </div>
                       </div>
                    </td>

                    {/* Group & Status */}
                    <td className="px-4 py-3">
                       <div className="flex flex-col gap-1.5 items-start">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                             {customer.group}
                          </span>
                          <div className="flex items-center gap-1.5">
                             <div className={`w-1.5 h-1.5 rounded-full ${customer.isEmailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                             <span className={`text-[10px] font-medium ${customer.isEmailable ? 'text-green-600' : 'text-red-500'}`}>
                                {customer.isEmailable ? 'ایمیل مارکتینگ فعال' : 'لغو اشتراک'}
                             </span>
                          </div>
                       </div>
                    </td>

                    {/* Last Activity */}
                    <td className="px-4 py-3">
                       <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                             <Mail size={12} className="text-blue-500" />
                             <span className="text-[10px] text-slate-600 font-mono">{customer.lastEmailDate?.split(' ')[0] || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Clock size={12} className="text-purple-500" />
                             <span className="text-[10px] text-slate-600 font-mono">{customer.lastSmsDate?.split(' ')[0] || '-'}</span>
                          </div>
                       </div>
                    </td>

                    {/* Score */}
                    <td className="px-4 py-3">
                       <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full ${getInterestColor(customer.interestScore)}`} style={{ width: `${customer.interestScore}%` }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-600">{customer.interestScore}%</span>
                       </div>
                    </td>

                    {/* Tags */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md text-[10px] font-medium shadow-sm">
                            {tag}
                          </span>
                        ))}
                        {customer.tags.length > 2 && (
                           <span className="bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded-md text-[10px]">+</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-left">
                      <button 
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-2 hover:bg-white hover:shadow-sm hover:border-slate-200 border border-transparent rounded-lg text-slate-400 hover:text-blue-600 transition-all"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bulk Action Bar - Floating */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
            >
              <div className="bg-slate-900 text-white p-2 pr-4 pl-2 rounded-full shadow-2xl flex items-center gap-4 md:gap-6 border border-slate-700/50 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                   <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-slate-900 text-xs font-bold">
                      {selectedIds.length}
                   </div>
                   <span className="text-xs font-bold whitespace-nowrap hidden sm:inline-block opacity-80">انتخاب شد</span>
                </div>
                <div className="h-5 w-px bg-slate-700"></div>
                <div className="flex items-center gap-1">
                   <div className="relative group/dropup">
                      <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-lg transition-colors text-xs font-bold">
                         <Layers size={14} />
                         تغییر گروه
                      </button>
                      <div className="absolute bottom-full left-0 mb-3 w-40 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden hidden group-hover/dropup:block text-slate-800 animate-in slide-in-from-bottom-2">
                         {groups.filter(g => g.name !== 'همه').map(g => (
                            <button 
                              key={g.id} 
                              onClick={() => handleMoveGroup(g.name, selectedIds)}
                              className="w-full text-right px-4 py-2.5 hover:bg-blue-50 hover:text-blue-600 text-xs font-medium transition-colors border-b border-slate-50 last:border-0"
                            >
                               {g.name}
                            </button>
                         ))}
                      </div>
                   </div>

                   <button onClick={() => setIsDeleteConfirmOpen(true)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors text-xs font-bold">
                     <Trash2 size={14} />
                     حذف
                   </button>
                   <button onClick={() => setSelectedIds([])} className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 ml-1">
                     <X size={14} />
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --- CUSTOMER DETAIL INSPECTOR --- */}
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDetailPanel 
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onDelete={executeSingleDelete}
            onUpdate={handleUpdateCustomer}
          />
        )}
      </AnimatePresence>

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

      {/* Create List Modal */}
      <AnimatePresence>
        {isCreateListOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsCreateListOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900">ساخت لیست جدید</h3>
                <button onClick={() => setIsCreateListOpen(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateList} className="p-6 space-y-5">
                <div>
                   <label className="block text-xs font-bold text-slate-700 mb-1.5">نام لیست</label>
                   <input 
                     type="text" autoFocus required
                     value={newList.name}
                     onChange={(e) => setNewList({...newList, name: e.target.value})}
                     className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900"
                     placeholder="مثال: همکاران تجاری"
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-700 mb-1.5">توضیحات</label>
                   <textarea 
                     rows={2}
                     value={newList.description}
                     onChange={(e) => setNewList({...newList, description: e.target.value})}
                     className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none resize-none text-slate-900"
                     placeholder="توضیح کوتاه درباره این گروه..."
                   />
                </div>
                
                {/* Color Picker */}
                <div>
                   <label className="block text-xs font-bold text-slate-700 mb-2">رنگ لیست</label>
                   <div className="flex gap-3">
                      {COLOR_OPTIONS.map(color => (
                         <button
                           key={color.id}
                           type="button"
                           onClick={() => setNewList({...newList, color: color.id})}
                           className={`w-8 h-8 rounded-full ${color.bg} flex items-center justify-center transition-transform ${newList.color === color.id ? `ring-2 ring-offset-2 ${color.ring} scale-110` : 'hover:scale-105'}`}
                         >
                            {newList.color === color.id && <Check size={14} className="text-white" />}
                         </button>
                      ))}
                   </div>
                </div>

                {/* Icon Picker */}
                <div>
                   <label className="block text-xs font-bold text-slate-700 mb-2">آیکون</label>
                   <div className="grid grid-cols-6 gap-2">
                      {ICON_OPTIONS.map(opt => (
                         <button
                           key={opt.id}
                           type="button"
                           onClick={() => setNewList({...newList, icon: opt.id})}
                           className={`aspect-square rounded-xl flex items-center justify-center transition-all ${newList.icon === opt.id ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-500' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                         >
                            <opt.icon size={20} />
                         </button>
                      ))}
                   </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsCreateListOpen(false)} className="flex-1">انصراف</Button>
                  <Button type="submit" className="flex-1 shadow-lg shadow-blue-600/20">
                    ساخت لیست
                  </Button>
                </div>
              </form>
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <h3 className="text-lg font-bold text-slate-900">افزودن مشتری جدید</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleAddCustomer} className="flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  
                  {/* Identity Section */}
                  <section>
                     <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <User size={18} className="text-blue-500" />
                        اطلاعات هویتی
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1.5">نام</label>
                           <input 
                             type="text" required
                             value={newCustomer.firstName}
                             onChange={(e) => setNewCustomer({...newCustomer, firstName: e.target.value})}
                             className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 placeholder:text-slate-400"
                             placeholder="مثال: علی"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1.5">نام خانوادگی</label>
                           <input 
                             type="text"
                             value={newCustomer.lastName}
                             onChange={(e) => setNewCustomer({...newCustomer, lastName: e.target.value})}
                             className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 placeholder:text-slate-400"
                             placeholder="مثال: رضایی"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1.5">جنسیت</label>
                           <div className="relative">
                              <select 
                                 value={newCustomer.gender}
                                 onChange={(e) => setNewCustomer({...newCustomer, gender: e.target.value as any})}
                                 className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none text-slate-900"
                              >
                                 <option value="Male">مرد</option>
                                 <option value="Female">زن</option>
                                 <option value="Other">سایر</option>
                              </select>
                              <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">ملیت</label>
                              <input 
                                type="text"
                                value={newCustomer.nationality}
                                onChange={(e) => setNewCustomer({...newCustomer, nationality: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">زبان</label>
                              <input 
                                type="text"
                                value={newCustomer.language}
                                onChange={(e) => setNewCustomer({...newCustomer, language: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900"
                              />
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* Contact Section */}
                  <section>
                     <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Phone size={18} className="text-green-500" />
                        اطلاعات تماس
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1.5">موبایل</label>
                           <input 
                             type="tel" required dir="ltr"
                             value={newCustomer.phone}
                             onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                             className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-left text-slate-900 placeholder:text-slate-400 font-mono"
                             placeholder="0912..."
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1.5">ایمیل</label>
                           <input 
                             type="email" dir="ltr"
                             value={newCustomer.email}
                             onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                             className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none text-left text-slate-900 placeholder:text-slate-400"
                             placeholder="example@mail.com"
                           />
                        </div>
                     </div>
                     <div className="mt-4 flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${newCustomer.isEmailable ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                           <Mail size={16} />
                        </div>
                        <div className="flex-1">
                           <span className="text-xs font-bold text-slate-700 block">وضعیت اشتراک</span>
                           <span className="text-[10px] text-slate-500">{newCustomer.isEmailable ? 'مجاز به ارسال ایمیل و پیامک' : 'لغو اشتراک شده'}</span>
                        </div>
                        <button 
                           type="button"
                           onClick={() => setNewCustomer({...newCustomer, isEmailable: !newCustomer.isEmailable})}
                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${newCustomer.isEmailable ? 'bg-emerald-500' : 'bg-slate-300'}`}
                           dir="ltr"
                        >
                           <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${newCustomer.isEmailable ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                     </div>
                  </section>

                  {/* Address Section */}
                  <section>
                     <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MapPin size={18} className="text-red-500" />
                        آدرس‌ها
                     </h4>
                     <div className="space-y-3">
                        <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1.5">آدرس سکونت (اصلی)</label>
                           <textarea 
                             rows={2}
                             value={newCustomer.address1}
                             onChange={(e) => setNewCustomer({...newCustomer, address1: e.target.value})}
                             className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none resize-none text-slate-900 placeholder:text-slate-400"
                             placeholder="تهران، ..."
                           />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">آدرس دوم (اختیاری)</label>
                              <textarea 
                                rows={2}
                                value={newCustomer.address2}
                                onChange={(e) => setNewCustomer({...newCustomer, address2: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none resize-none text-slate-900"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">آدرس محل کار (اختیاری)</label>
                              <textarea 
                                rows={2}
                                value={newCustomer.workAddress}
                                onChange={(e) => setNewCustomer({...newCustomer, workAddress: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none resize-none text-slate-900"
                              />
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* Segmentation Section */}
                  <section>
                     <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Tag size={18} className="text-purple-500" />
                        دسته‌بندی و امتیاز
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1.5">گروه مشتری</label>
                           <div className="relative">
                              <select 
                                 value={newCustomer.group}
                                 onChange={(e) => setNewCustomer({...newCustomer, group: e.target.value})}
                                 className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none text-slate-900"
                              >
                                 {groups.filter(g => g.name !== 'همه').map(g => (
                                    <option key={g.id} value={g.name}>{g.name}</option>
                                 ))}
                              </select>
                              <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                           </div>
                        </div>
                        
                        <div>
                           <div className="flex justify-between items-center mb-2">
                              <label className="text-xs font-bold text-slate-700">امتیاز علاقه (Interest Score)</label>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${getInterestColor(newCustomer.interestScore || 0).replace('shadow-emerald-500/30', '').replace('bg-emerald-500', 'text-emerald-600 bg-emerald-50').replace('bg-amber-500', 'text-amber-600 bg-amber-50').replace('bg-red-500', 'text-red-600 bg-red-50')}`}>
                                 {newCustomer.interestScore}%
                              </span>
                           </div>
                           <input 
                              type="range" min="0" max="100" step="5"
                              value={newCustomer.interestScore}
                              onChange={(e) => setNewCustomer({...newCustomer, interestScore: parseInt(e.target.value)})}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                           />
                           <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                              <span>سرد (0)</span>
                              <span>داغ (100)</span>
                           </div>
                        </div>
                     </div>

                     <div className="mt-4">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">برچسب‌ها</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white transition-all">
                           <div className="flex flex-wrap gap-2 mb-2">
                              {(newCustomer.tags || []).map(tag => (
                                 <span key={tag} className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                    {tag}
                                    <button type="button" onClick={() => handleRemoveNewCustomerTag(tag)} className="hover:text-red-500 p-0.5 rounded-full hover:bg-slate-100 transition-colors"><X size={12} /></button>
                                 </span>
                              ))}
                           </div>
                           <input 
                              type="text" 
                              value={newCustomerTag}
                              onChange={(e) => setNewCustomerTag(e.target.value)}
                              onKeyDown={handleAddCustomerTag}
                              placeholder={(newCustomer.tags?.length || 0) === 0 ? "تایپ کنید و اینتر بزنید..." : "افزودن تگ..."}
                              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-900"
                           />
                        </div>
                     </div>
                  </section>

                </div>

                <div className="pt-4 p-6 flex gap-3 border-t border-slate-100 bg-slate-50">
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

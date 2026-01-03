
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Phone, Mail, MapPin, Briefcase, Calendar, 
  MessageSquare, User, Flag, Globe, Tag, CheckCircle, 
  XCircle, Copy, Edit2, Trash2, Save, ArrowRight,
  MoreVertical, Star, Shield, ChevronDown, AlignLeft, AlertTriangle
} from 'lucide-react';
import { Customer } from '../../../types';
import { Button } from '../../ui/Button';

interface CustomerDetailPanelProps {
  customer: Customer;
  onClose: () => void;
  onUpdate?: (updatedCustomer: Customer) => void;
  onDelete?: (id: string) => void;
}

export const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({ 
  customer, 
  onClose,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Customer>(customer);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');

  // Update local state when prop changes
  useEffect(() => {
    setFormData(customer);
  }, [customer]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(formData);
    }
    setIsEditing(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const getInterestColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  // --- Render Functions ---

  const renderViewMode = () => (
    <>
      {/* Header */}
      <div className="relative bg-slate-50 border-b border-slate-200 shrink-0 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 z-0"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
               <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${customer.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                 <div className={`w-1.5 h-1.5 rounded-full ${customer.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                 {customer.status === 'active' ? 'فعال' : 'غیرفعال'}
               </span>
               <span className="text-[10px] font-mono text-slate-400 bg-white/50 px-2 py-1 rounded-lg border border-slate-200/50">#{customer.id}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(true)} className="p-2 bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all shadow-sm border border-slate-200/50 group" title="ویرایش">
                <Edit2 size={18} />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-white text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-3xl p-1.5 shadow-xl shadow-slate-200/50 border border-white">
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-inner">
                  {customer.firstName.charAt(0)}
                </div>
              </div>
              <div className={`absolute -bottom-3 -right-3 px-3 py-1 rounded-xl border-2 border-white text-xs font-bold shadow-lg flex items-center gap-1 ${getInterestColor(customer.interestScore)}`}>
                <Star size={10} fill="currentColor" />
                %{customer.interestScore}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-black text-slate-900 mb-2 truncate leading-tight">{customer.firstName} {customer.lastName}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] rounded-lg font-bold shadow-sm">
                  {customer.group}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] rounded-lg font-medium shadow-sm">
                  {customer.isEmailable ? <CheckCircle size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-rose-500" />}
                  {customer.isEmailable ? 'خبرنامه فعال' : 'لغو اشتراک'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-8">
            <button className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
              <Phone size={18} />
              تماس
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm">
              <Mail size={18} />
              ایمیل
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
        
        {/* Contact Info */}
        <section>
          <h3 className="text-xs font-bold text-slate-900 uppercase mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            اطلاعات تماس
          </h3>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
              <div className="p-4 flex items-center gap-4 group hover:bg-slate-50/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-slate-400 font-medium mb-0.5">شماره موبایل</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 font-mono" dir="ltr">{customer.phone}</span>
                    <button onClick={() => handleCopy(customer.phone, 'phone')} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                      {copyFeedback === 'phone' ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center gap-4 group hover:bg-slate-50/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-slate-400 font-medium mb-0.5">آدرس ایمیل</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 truncate">{customer.email}</span>
                    <button onClick={() => handleCopy(customer.email, 'email')} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                      {copyFeedback === 'email' ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Addresses */}
        <section>
          <h3 className="text-xs font-bold text-slate-900 uppercase mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
            دفترچه آدرس
          </h3>
          <div className="space-y-3">
            {/* Home Address */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
               <div className="absolute top-4 left-4 p-1.5 bg-white rounded-lg shadow-sm text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MapPin size={14} />
               </div>
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-bold text-slate-700">آدرس سکونت (اصلی)</span>
               </div>
               <p className="text-sm text-slate-600 leading-relaxed pr-4">{customer.address1 || '---'}</p>
            </div>

            {/* Address 2 */}
            {customer.address2 && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-700">آدرس دوم</span>
                 </div>
                 <p className="text-sm text-slate-600 leading-relaxed pr-4">{customer.address2}</p>
              </div>
            )}

            {/* Work Address */}
            {customer.workAddress && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
                 <div className="absolute top-4 left-4 p-1.5 bg-white rounded-lg shadow-sm text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Briefcase size={14} />
                 </div>
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-700">آدرس محل کار</span>
                 </div>
                 <p className="text-sm text-slate-600 leading-relaxed pr-4">{customer.workAddress}</p>
              </div>
            )}
          </div>
        </section>

        {/* Demographics */}
        <section>
          <h3 className="text-xs font-bold text-slate-900 uppercase mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            اطلاعات فردی
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
              <div className="text-[10px] text-slate-400 font-medium mb-1 flex items-center gap-1"><User size={12}/> جنسیت</div>
              <div className="text-sm font-bold text-slate-700">
                {customer.gender === 'Male' ? 'مرد' : customer.gender === 'Female' ? 'زن' : 'سایر'}
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
              <div className="text-[10px] text-slate-400 font-medium mb-1 flex items-center gap-1"><Flag size={12}/> ملیت</div>
              <div className="text-sm font-bold text-slate-700">{customer.nationality}</div>
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
              <div className="text-[10px] text-slate-400 font-medium mb-1 flex items-center gap-1"><Globe size={12}/> زبان</div>
              <div className="text-sm font-bold text-slate-700">{customer.language}</div>
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
              <div className="text-[10px] text-slate-400 font-medium mb-1 flex items-center gap-1"><Tag size={12}/> تگ‌ها</div>
              <div className="text-sm font-bold text-slate-700">{customer.tags.length} عدد</div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {customer.tags.map(tag => (
              <span key={tag} className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                #{tag}
              </span>
            ))}
          </div>
        </section>

        {/* Activity Timeline */}
        <section className="relative pt-2">
           <div className="absolute right-[9px] top-4 bottom-4 w-0.5 bg-slate-100 rounded-full"></div>
           
           <div className="space-y-6 relative">
              {/* Last Email */}
              <div className="flex gap-4">
                 <div className="relative z-10 w-5 h-5 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                 </div>
                 <div className="flex-1 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <Mail size={14} className="text-blue-500" />
                          آخرین ایمیل ارسالی
                       </span>
                       <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md font-mono">{customer.lastEmailDate || '---'}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                       {customer.lastEmailSubject || 'هیچ ایمیلی ارسال نشده است.'}
                    </p>
                 </div>
              </div>

              {/* Last SMS */}
              <div className="flex gap-4">
                 <div className="relative z-10 w-5 h-5 rounded-full bg-purple-100 border-4 border-white shadow-sm flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                 </div>
                 <div className="flex-1 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <MessageSquare size={14} className="text-purple-500" />
                          آخرین پیامک
                       </span>
                       <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md font-mono">{customer.lastSmsDate || '---'}</span>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
                        <p className="text-xs text-purple-700 font-medium leading-relaxed" dir="auto">
                           {customer.lastSmsSubject || 'هیچ پیامکی ارسال نشده است.'}
                        </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Delete Action */}
        {onDelete && (
           <div className="pt-8 mt-auto border-t border-slate-100">
              <button 
                onClick={() => onDelete(customer.id)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors border border-rose-100"
              >
                 <Trash2 size={16} />
                 حذف این کاربر
              </button>
           </div>
        )}
      </div>
    </>
  );

  const renderEditMode = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <h3 className="font-black text-slate-800 flex items-center gap-2.5 text-lg">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
             <Edit2 size={20} />
          </div>
          ویرایش اطلاعات
        </h3>
        <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-10 custom-scrollbar">
        {/* Identity */}
        <section className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
             هویت
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1.5 block">نام</label>
              <input 
                type="text" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1.5 block">نام خانوادگی</label>
              <input 
                type="text" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
             تماس
          </h4>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                 <Phone size={12} className="text-slate-400" />
                 شماره موبایل
              </label>
              <input 
                type="tel" dir="ltr"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-mono text-left focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                 <Mail size={12} className="text-slate-400" />
                 ایمیل
              </label>
              <input 
                type="email" dir="ltr"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm text-left focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
             آدرس‌ها
          </h4>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                 <MapPin size={12} className="text-blue-500"/> آدرس منزل (۱)
              </label>
              <textarea 
                rows={2}
                value={formData.address1}
                onChange={(e) => setFormData({...formData, address1: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none shadow-sm leading-relaxed"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                 <MapPin size={12} className="text-slate-400"/> آدرس منزل (۲) - اختیاری
              </label>
              <textarea 
                rows={2}
                value={formData.address2 || ''}
                onChange={(e) => setFormData({...formData, address2: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none shadow-sm leading-relaxed"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                 <Briefcase size={12} className="text-purple-500"/> آدرس محل کار
              </label>
              <textarea 
                rows={2}
                value={formData.workAddress || ''}
                onChange={(e) => setFormData({...formData, workAddress: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none shadow-sm leading-relaxed"
              />
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
             جزئیات تکمیلی
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1.5 block">جنسیت</label>
              <div className="relative">
                 <select 
                   value={formData.gender}
                   onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none shadow-sm"
                 >
                   <option value="Male">مرد</option>
                   <option value="Female">زن</option>
                   <option value="Other">سایر</option>
                 </select>
                 <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1.5 block">زبان</label>
              <input 
                type="text" 
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1.5 block">ملیت</label>
              <input 
                type="text" 
                value={formData.nationality}
                onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1.5 block">گروه</label>
              <div className="relative">
                 <select 
                   value={formData.group}
                   onChange={(e) => setFormData({...formData, group: e.target.value})}
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none shadow-sm"
                 >
                   <option value="عمومی">عمومی</option>
                   <option value="VIP">VIP</option>
                   <option value="سرنخ‌ها">سرنخ‌ها</option>
                   <option value="مشتریان وفادار">مشتریان وفادار</option>
                   <option value="از دست رفته">از دست رفته</option>
                 </select>
                 <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Tags */}
        <section className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
             برچسب‌ها
          </h4>
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100 animate-in fade-in zoom-in duration-200">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-white"><X size={12} /></button>
                </span>
              ))}
            </div>
            <input 
              type="text" 
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={formData.tags.length === 0 ? "تایپ کنید و اینتر بزنید..." : "افزودن برچسب جدید..."}
              className="w-full p-1 bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-900"
            />
          </div>
        </section>

        {/* Settings */}
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.isEmailable ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Mail size={20} />
               </div>
               <div>
                  <span className="text-sm font-bold text-slate-900 block">وضعیت ایمیل مارکتینگ</span>
                  <span className="text-xs text-slate-500">{formData.isEmailable ? 'مشترک فعال خبرنامه' : 'لغو اشتراک شده'}</span>
               </div>
            </div>
            <button 
              onClick={() => setFormData({...formData, isEmailable: !formData.isEmailable})}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${formData.isEmailable ? 'bg-emerald-500' : 'bg-slate-200'}`}
              dir="ltr"
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${formData.isEmailable ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
             <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                   <Star size={14} className="text-amber-500 fill-amber-500" />
                   امتیاز وفاداری
                </label>
                <span className={`text-xs font-black px-2 py-1 rounded-lg border ${getInterestColor(formData.interestScore)}`}>
                   {formData.interestScore}%
                </span>
             </div>
             <div className="relative h-6 flex items-center">
                <input 
                  type="range" min="0" max="100" step="1"
                  value={formData.interestScore}
                  onChange={(e) => setFormData({...formData, interestScore: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 z-10 relative"
                />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 pointer-events-none"
                  style={{ width: `${formData.interestScore}%` }}
                ></div>
             </div>
             <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
                <span>کاربر عادی (0%)</span>
                <span>وفادار (100%)</span>
             </div>
          </div>
        </section>

        {/* Delete Zone */}
        {onDelete && (
           <div className="pt-6 mt-auto border-t border-slate-200">
              <button 
                onClick={() => {
                    if (confirm('آیا از حذف این مشتری اطمینان دارید؟ این عملیات غیرقابل بازگشت است.')) {
                        onDelete(customer.id);
                    }
                }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors border border-red-200 border-dashed hover:border-solid hover:border-red-300"
              >
                 <Trash2 size={18} />
                 حذف این کاربر
              </button>
           </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-200 flex gap-3 z-10 sticky bottom-0">
        <Button variant="ghost" onClick={() => setIsEditing(false)} className="flex-1 py-3 text-slate-500 hover:text-slate-800">انصراف</Button>
        <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 py-3">
          <Save size={18} className="mr-2" />
          ذخیره تغییرات
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-[4px] z-40"
        onClick={onClose}
      />
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-[480px] bg-white shadow-2xl z-50 overflow-hidden flex flex-col border-l border-slate-200"
      >
        {isEditing ? renderEditMode() : renderViewMode()}
      </motion.div>
    </>
  );
};

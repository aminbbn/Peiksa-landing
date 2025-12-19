import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mail, MessageSquare, Bell, MoreVertical, BarChart2, Edit3, ArrowLeft, Sparkles, CheckCircle, X, Send } from 'lucide-react';
import { Campaign } from '../../types';
import { Button } from '../../components/ui/Button';

const mockCampaigns: Campaign[] = [
  { id: '1', name: 'تخفیف شب یلدا', type: 'sms', status: 'sent', sentCount: 5000, date: '۱۴۰۳/۰۹/۳۰' },
  { id: '2', name: 'خبرنامه هفتگی - آذر ماه', type: 'email', status: 'active', sentCount: 12000, openRate: 45, clickRate: 12, date: '۱۴۰۳/۰۹/۱۵' },
  { id: '3', name: 'خوش‌آمدگویی کاربران جدید', type: 'email', status: 'active', sentCount: 150, openRate: 68, clickRate: 25, date: 'خودکار' },
  { id: '4', name: 'جشنواره زمستانه', type: 'push', status: 'draft', date: 'پیش‌نویس' },
  { id: '5', name: 'یادآوری سبد خرید', type: 'sms', status: 'active', sentCount: 85, date: 'خودکار' },
];

export const DashboardCampaigns: React.FC = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    type: 'sms' as 'sms' | 'email' | 'push',
    name: '',
    content: ''
  });

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const handleGenerateAi = () => {
    if (!aiPrompt) return;
    setIsAiGenerating(true);
    // Simulation of AI generation
    setTimeout(() => {
      const generatedText = campaignData.type === 'sms' 
        ? `🔥 پیشنهاد ویژه برای ${aiPrompt}!\nفقط تا پایان امشب فرصت دارید تا با ۵۰٪ تخفیف خرید کنید.\nلینک خرید: peiksa.ir/offer\nلغو ۱۱`
        : `سلام دوست عزیز،\n\nخبرهای خوبی برای ${aiPrompt} داریم! محصولات جدید ما با تخفیف‌های شگفت‌انگیز رسیدند.\n\nهمین حالا به وب‌سایت ما سر بزنید و از این فرصت استثنایی استفاده کنید.\n\nارادتمند،\nتیم پیکسا`;
      
      setCampaignData(prev => ({ ...prev, content: generatedText }));
      setIsAiGenerating(false);
      setShowAiModal(false);
      setAiPrompt('');
    }, 2000);
  };

  const resetFlow = () => {
    setView('list');
    setStep(1);
    setCampaignData({ type: 'sms', name: '', content: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">
          {view === 'create' ? 'ایجاد کمپین جدید' : 'کمپین‌ها'}
        </h1>
        {view === 'list' && (
          <button 
            onClick={() => setView('create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <Plus size={18} />
            ایجاد کمپین جدید
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCampaigns.map((campaign, idx) => (
            <motion.div 
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative group"
            >
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700">
                   <MoreVertical size={18} />
                 </button>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  campaign.type === 'email' ? 'bg-blue-100 text-blue-600' :
                  campaign.type === 'sms' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {campaign.type === 'email' ? <Mail size={24} /> :
                   campaign.type === 'sms' ? <MessageSquare size={24} /> : <Bell size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">{campaign.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'sent' ? 'bg-slate-100 text-slate-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {campaign.status === 'active' ? 'در حال اجرا' :
                       campaign.status === 'sent' ? 'ارسال شده' : 'پیش‌نویس'}
                    </span>
                    <span className="text-xs text-slate-400">{campaign.date}</span>
                  </div>
                </div>
              </div>

              {/* Stats Area */}
              {campaign.status !== 'draft' && (
                <div className="grid grid-cols-3 gap-2 mb-6 border-t border-b border-slate-100 py-4">
                   <div className="text-center border-l border-slate-100">
                      <div className="text-[10px] text-slate-500 mb-1">ارسال شده</div>
                      <div className="font-bold text-slate-900">{campaign.sentCount?.toLocaleString()}</div>
                   </div>
                   <div className="text-center border-l border-slate-100">
                      <div className="text-[10px] text-slate-500 mb-1">باز شده</div>
                      <div className="font-bold text-slate-900">{campaign.openRate ? `%${campaign.openRate}` : '-'}</div>
                   </div>
                   <div className="text-center">
                      <div className="text-[10px] text-slate-500 mb-1">کلیک</div>
                      <div className="font-bold text-slate-900">{campaign.clickRate ? `%${campaign.clickRate}` : '-'}</div>
                   </div>
                </div>
              )}
              
              {campaign.status === 'draft' && (
                 <div className="mb-6 py-4 text-sm text-slate-500 border-t border-b border-slate-100">
                    این کمپین هنوز ارسال نشده است. برای شروع ویرایش کنید.
                 </div>
              )}

              <div className="flex gap-3">
                 {campaign.status === 'draft' ? (
                   <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
                      <Edit3 size={16} />
                      ویرایش
                   </button>
                 ) : (
                   <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">
                      <BarChart2 size={16} />
                      گزارش کامل
                   </button>
                 )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* --- CREATE FLOW --- */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-4">
            <div className="flex items-center justify-between max-w-md mx-auto relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-0 -translate-y-1/2"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {i}
                </div>
              ))}
            </div>
            <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-slate-500 font-medium">
              <span>انتخاب کانال</span>
              <span>محتوا (AI)</span>
              <span>بررسی و ارسال</span>
            </div>
          </div>

          <div className="p-8 min-h-[400px]">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">نوع کمپین را انتخاب کنید</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'sms', label: 'پیامک (SMS)', icon: MessageSquare, desc: 'نرخ بازگشایی ۹۸٪' },
                    { id: 'email', label: 'ایمیل مارکتینگ', icon: Mail, desc: 'مناسب خبرنامه و محتوا' },
                    { id: 'push', label: 'پوش نوتیفیکیشن', icon: Bell, desc: 'ارسال آنی روی موبایل' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setCampaignData({ ...campaignData, type: type.id as any })}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4 ${
                        campaignData.type === type.id 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${campaignData.type === type.id ? 'bg-blue-200' : 'bg-slate-100'}`}>
                        <type.icon size={28} />
                      </div>
                      <div>
                        <div className="font-bold mb-1">{type.label}</div>
                        <div className="text-xs opacity-70">{type.desc}</div>
                      </div>
                      {campaignData.type === type.id && <CheckCircle className="text-blue-600" size={20} />}
                    </button>
                  ))}
                </div>
                <div className="mt-8">
                  <label className="block text-sm font-bold text-slate-700 mb-2">نام کمپین</label>
                  <input 
                    type="text" 
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                    placeholder="مثال: تخفیف یلدایی ۱۴۰۳"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-slate-900">محتوای پیام</h2>
                  <button 
                    onClick={() => setShowAiModal(true)}
                    className="flex items-center gap-2 text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
                  >
                    <Sparkles size={16} />
                    نویسنده هوشمند (AI)
                  </button>
                </div>
                
                <div className="relative">
                  <textarea
                    value={campaignData.content}
                    onChange={(e) => setCampaignData({...campaignData, content: e.target.value})}
                    placeholder={campaignData.type === 'sms' ? "متن پیامک خود را بنویسید..." : "متن ایمیل خود را بنویسید..."}
                    className="w-full h-64 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-slate-900 placeholder:text-slate-400"
                  ></textarea>
                  <div className="absolute bottom-4 left-4 text-xs text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">
                    {campaignData.content.length} کاراکتر
                  </div>
                </div>

                {/* AI Modal Overlay */}
                <AnimatePresence>
                  {showAiModal && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 rounded-3xl flex flex-col items-center justify-center p-8"
                    >
                      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-purple-100 p-6 relative overflow-hidden">
                        <button onClick={() => setShowAiModal(false)} className="absolute top-4 left-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        
                        <div className="flex flex-col items-center mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-purple-500/30">
                            <Sparkles size={24} />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">دستیار هوشمند نویسنده</h3>
                          <p className="text-sm text-slate-500 text-center mt-1">موضوع را بگویید، متن جذاب تحویل بگیرید</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1.5 block">موضوع پیام چیست؟</label>
                            <input 
                              type="text" 
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              placeholder="مثال: تخفیف ۵۰ درصدی برای کفش‌های ورزشی"
                              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all text-slate-900"
                            />
                          </div>
                          
                          <Button 
                            fullWidth 
                            onClick={handleGenerateAi}
                            disabled={isAiGenerating || !aiPrompt}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 border-none shadow-lg shadow-purple-500/20"
                          >
                            {isAiGenerating ? (
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
                              </span>
                            ) : (
                              <>
                                <Sparkles size={18} className="mr-2" />
                                تولید متن هوشمند
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-center">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Send size={40} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">آماده ارسال؟</h2>
                    <p className="text-slate-500">کمپین شما با تنظیمات زیر ایجاد خواهد شد:</p>
                 </div>

                 <div className="bg-slate-50 p-6 rounded-2xl text-right max-w-md mx-auto border border-slate-200">
                    <div className="flex justify-between mb-3 pb-3 border-b border-slate-200">
                       <span className="text-slate-500 text-sm">نام کمپین:</span>
                       <span className="font-bold text-slate-900">{campaignData.name || 'بدون نام'}</span>
                    </div>
                    <div className="flex justify-between mb-3 pb-3 border-b border-slate-200">
                       <span className="text-slate-500 text-sm">نوع:</span>
                       <span className="font-bold text-slate-900">
                         {campaignData.type === 'sms' ? 'پیامک' : campaignData.type === 'email' ? 'ایمیل' : 'پوش'}
                       </span>
                    </div>
                    <div>
                       <span className="text-slate-500 text-sm block mb-2">پیش‌نمایش متن:</span>
                       <p className="text-sm text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                         {campaignData.content || 'متنی وارد نشده...'}
                       </p>
                    </div>
                 </div>
              </motion.div>
            )}
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={18} className="rotate-180 ml-2" />
                مرحله قبل
              </Button>
            ) : (
              <Button variant="ghost" onClick={resetFlow}>انصراف</Button>
            )}

            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !campaignData.name}>
                مرحله بعد
                <ArrowLeft size={18} className="mr-2" />
              </Button>
            ) : (
              <Button onClick={resetFlow} className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20">
                تایید و ارسال
                <CheckCircle size={18} className="mr-2" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
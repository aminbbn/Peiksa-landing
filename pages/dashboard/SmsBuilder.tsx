
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Save, Trash2, 
  Copy, CheckCircle, RefreshCw, 
  PenTool, Smartphone,
  Type, Tag, AlignLeft, Wand2, Palette
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { PhoneMockup, ChatBubble } from '../../components/dashboard/PhoneMockup';

interface SavedSMS {
  id: string;
  subject: string;
  text: string;
  description: string;
  tags: string[];
  tone: string;
  date: string;
}

const TONES = [
  { id: 'friendly', label: 'صمیمی', icon: '😊', color: 'from-orange-400 to-pink-500' },
  { id: 'formal', label: 'رسمی', icon: '👔', color: 'from-blue-500 to-blue-700' },
  { id: 'sales', label: 'فروش', icon: '🔥', color: 'from-red-500 to-orange-500' },
  { id: 'urgent', label: 'فوری', icon: '⚠️', color: 'from-amber-400 to-orange-500' },
  { id: 'poetic', label: 'ادبی', icon: '✒️', color: 'from-violet-500 to-purple-600' },
];

export const DashboardSmsBuilder: React.FC = () => {
  // AI State
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('friendly');
  const [isLoading, setIsLoading] = useState(false);

  // Form State (Manual Entry)
  const [formData, setFormData] = useState({
    subject: '',
    text: '',
    description: '',
    tags: ''
  });

  const [savedMessages, setSavedMessages] = useState<SavedSMS[]>([]);
  const [copyStatus, setCopyStatus] = useState(false);

  // Load saved messages on mount
  useEffect(() => {
    const saved = localStorage.getItem('peiksa_saved_sms');
    if (saved) {
      try {
        setSavedMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved SMS', e);
      }
    }
  }, []);

  // Save messages when updated
  useEffect(() => {
    localStorage.setItem('peiksa_saved_sms', JSON.stringify(savedMessages));
  }, [savedMessages]);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `Act as a world-class Persian (Farsi) copywriter for SMS marketing.
      Your task is to generate a complete SMS campaign package based on the user's input.
      
      Return ONLY a raw JSON object (no markdown formatting) with the following structure:
      {
        "subject": "A short, internal title for this campaign (e.g., 'جشنواره یلدا')",
        "smsText": "The actual SMS content. Strict limit: under 134 chars. Use emojis if appropriate.",
        "description": "A brief explanation of the strategy or target audience (optional)",
        "tags": ["tag1", "tag2"]
      }
      
      Rules:
      1. 'smsText' must be persuasive and include a Call to Action (CTA) if needed.
      2. Use the requested Tone.
      3. Do NOT include any text outside the JSON object.`;

      const userPrompt = `Request: "${prompt}". 
      Tone: ${TONES.find(t => t.id === tone)?.label}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: { 
            systemInstruction,
            responseMimeType: "application/json"
        }
      });

      if (response.text) {
        try {
            const data = JSON.parse(response.text);
            setFormData({
                subject: data.subject || '',
                text: data.smsText || '',
                description: data.description || '',
                tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || '')
            });
        } catch (e) {
            console.error("JSON Parse Error", e);
            // Fallback for plain text response if JSON fails
            setFormData(prev => ({ ...prev, text: response.text || '' }));
        }
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("متاسفانه در ارتباط با هوش مصنوعی مشکلی پیش آمد.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!formData.text) return;
    const newMessage: SavedSMS = {
      id: Date.now().toString(),
      subject: formData.subject || 'بدون عنوان',
      text: formData.text,
      description: formData.description,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      tone,
      date: new Date().toLocaleDateString('fa-IR')
    };
    setSavedMessages([newMessage, ...savedMessages]);
  };

  const loadTemplate = (msg: SavedSMS) => {
      setFormData({
          subject: msg.subject,
          text: msg.text,
          description: msg.description,
          tags: msg.tags.join(', ')
      });
      setTone(msg.tone);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedMessages(savedMessages.filter(m => m.id !== id));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formData.text);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const charCount = formData.text.length;
  const segmentCount = charCount <= 70 ? 1 : Math.ceil((charCount - 70) / 67) + 1;

  return (
    <div className="h-full flex gap-8 overflow-hidden p-2">
      
      {/* --- Left Panel: Builder & AI --- */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar min-w-0">
        
        {/* 1. New AI Assistant UI */}
        <div className="relative overflow-hidden rounded-[2rem] bg-white border border-indigo-100 shadow-xl shadow-indigo-100/50 group transition-all shrink-0">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20 opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="relative z-10 p-6 lg:p-8">
            <div className="grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-8 items-center xl:items-start">
              
              {/* Left Side: Avatar & Description */}
              <div className="flex xl:flex-col items-center xl:items-start gap-4 xl:w-48 w-full justify-center xl:justify-start text-center xl:text-right border-b xl:border-b-0 xl:border-l border-indigo-50 xl:pl-8 pb-6 xl:pb-0">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 ring-4 ring-white">
                    <Wand2 size={32} className="animate-pulse" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 border-2 border-white text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    AI Beta
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">نویسنده هوشمند</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                    ایده کمپین را بنویسید،<br className="hidden xl:block"/> ما متن جذاب را می‌سازیم.
                  </p>
                </div>
              </div>

              {/* Right Side: Inputs */}
              <div className="w-full space-y-6 min-w-0">
                
                {/* Input Field */}
                <div className="relative group/input w-full">
                  {/* Glowing Border Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl opacity-20 group-hover/input:opacity-40 transition duration-500 blur-md"></div>
                  
                  {/* Main Container */}
                  <div className="relative bg-white border border-slate-200 group-hover/input:border-indigo-300 rounded-2xl p-1.5 flex flex-col sm:flex-row items-center gap-2 shadow-lg shadow-slate-200/50 transition-all">
                    
                    {/* Text Input */}
                    <input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      placeholder="مثال: تخفیف ویژه شب یلدا برای کفش‌های ورزشی..."
                      className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm md:text-base text-slate-800 placeholder:text-slate-400 w-full h-12 min-w-0"
                    />
                    
                    {/* Action Button */}
                    <Button 
                      onClick={handleGenerate} 
                      disabled={isLoading || !prompt}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-500/20 rounded-xl px-6 h-12 shrink-0 sm:w-auto w-full flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 whitespace-nowrap"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          <span className="whitespace-nowrap">تولید...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          <span className="whitespace-nowrap">تولید متن</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Tone Selector */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-1">
                  <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1.5 ml-2">
                    <Palette size={14} />
                    لحن پیام:
                  </span>
                  <div className="flex flex-wrap gap-2 w-full">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={`relative group/tone px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 overflow-hidden border cursor-pointer select-none ${
                          tone === t.id 
                            ? 'border-transparent text-white shadow-md ring-2 ring-indigo-500/30 ring-offset-1' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-white'
                        }`}
                      >
                        {tone === t.id && (
                          <motion.div 
                            layoutId="activeToneBg"
                            className={`absolute inset-0 bg-gradient-to-r ${t.color}`}
                            initial={false}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <span className="relative z-10 text-base">{t.icon}</span>
                        <span className="relative z-10">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* 2. Manual Editor Form */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 relative">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <PenTool size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">ویرایشگر پیامک</h2>
                <p className="text-xs text-slate-500">متن نهایی را بررسی و ویرایش کنید</p>
              </div>
           </div>

           <div className="space-y-6">
              {/* Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                    <label className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                       <Type size={14} className="text-blue-500" />
                       عنوان پیام (داخلی)
                    </label>
                    <input 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="مثال: کمپین بازگشت مشتری"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-900"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                       <Tag size={14} className="text-purple-500" />
                       برچسب‌ها (اختیاری)
                    </label>
                    <input 
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="مثال: vip, تخفیف, قدیمی"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-900"
                    />
                 </div>
              </div>

              {/* Main Text */}
              <div>
                 <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                       <Smartphone size={14} className="text-green-500" />
                       متن پیامک
                    </label>
                    <div className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${charCount > 140 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                       <span>{charCount} کاراکتر</span>
                       <span className="w-px h-3 bg-current opacity-30"></span>
                       <span>{segmentCount} پیامک</span>
                    </div>
                 </div>
                 <div className="relative">
                    <textarea 
                      value={formData.text}
                      onChange={(e) => setFormData({...formData, text: e.target.value})}
                      className="w-full h-40 p-4 rounded-2xl bg-white border-2 border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none text-sm leading-relaxed text-slate-900 shadow-sm"
                      placeholder="متن پیامک خود را اینجا بنویسید..."
                    />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                       <button onClick={handleCopy} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all" title="کپی متن">
                          {copyStatus ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                       </button>
                    </div>
                 </div>
              </div>

              {/* Description */}
              <div>
                 <label className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                    <AlignLeft size={14} className="text-slate-400" />
                    توضیحات استراتژی (اختیاری)
                 </label>
                 <textarea 
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   rows={2}
                   className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-900 resize-none"
                   placeholder="یادداشت برای هم‌تیمی‌ها..."
                 />
              </div>

              {/* Actions */}
              <div className="pt-2">
                  <Button onClick={handleSave} fullWidth className="bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-600/20 text-white h-12 text-sm">
                     <Save size={18} className="mr-2" />
                     ذخیره در لیست قالب‌ها
                  </Button>
               </div>
           </div>
        </div>

        {/* 3. Saved Templates List */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col min-h-[300px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                 <Save size={16} />
              </div>
              قالب‌های ذخیره شده
            </h3>
            <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full">{savedMessages.length}</span>
          </div>
          <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar flex-1 bg-slate-50/30">
            {savedMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                   <Save size={24} className="opacity-40" />
                </div>
                <span className="text-xs font-medium">هنوز قالبی ذخیره نکرده‌اید.</span>
              </div>
            ) : (
              savedMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => loadTemplate(msg)}
                  className="group bg-white border border-slate-200 p-4 rounded-2xl hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all relative cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-slate-800 text-xs mb-1.5 flex items-center gap-2">
                           {msg.subject}
                           {msg.tone && (
                              <span className={`text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r ${TONES.find(t => t.id === msg.tone)?.color || 'from-slate-100 to-slate-200'} text-white`}>
                                 {TONES.find(t => t.id === msg.tone)?.label}
                              </span>
                           )}
                        </h4>
                        <div className="flex gap-1">
                            {msg.tags?.map((tag, i) => (
                                <span key={i} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">{tag}</span>
                            ))}
                        </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed pl-8 line-clamp-2 border-r-2 border-slate-100 pr-3 mr-1">
                      {msg.text}
                  </p>
                  
                  <button 
                    onClick={(e) => handleDelete(msg.id, e)}
                    className="absolute bottom-4 left-4 p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 border border-slate-200 hover:border-rose-200"
                    title="حذف"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- Right Panel: Realistic Mobile Preview (Component) --- */}
      <div className="hidden 2xl:flex w-[400px] flex-col items-center justify-center relative shrink-0 py-6">
        <div className="sticky top-6">
           <PhoneMockup>
              <ChatBubble isSender={false}>
                 سلام! به پنل پیامکی پیکسا خوش آمدید. 👋
                 <br/>
                 چطور می‌تونم کمکتون کنم؟
              </ChatBubble>

              <AnimatePresence>
                {formData.text && (
                  <ChatBubble isSender={true} status="Delivered">
                     {formData.text}
                  </ChatBubble>
                )}
              </AnimatePresence>

              {isLoading && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 self-end" dir="rtl">
                    <div className="bg-[#E9E9EB] px-4 py-3 rounded-2xl flex items-center justify-center gap-1.5">
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                 </motion.div>
              )}
           </PhoneMockup>
        </div>
      </div>

    </div>
  );
};

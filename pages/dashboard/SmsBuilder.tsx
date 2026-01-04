
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Save, Trash2, 
  Copy, CheckCircle, RefreshCw, 
  PenTool, Smartphone,
  Type, Tag, AlignLeft
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
  { id: 'friendly', label: 'صمیمی', icon: '😊' },
  { id: 'formal', label: 'رسمی', icon: '👔' },
  { id: 'sales', label: 'فروش', icon: '🔥' },
  { id: 'urgent', label: 'فوری', icon: '⚠️' },
  { id: 'poetic', label: 'ادبی', icon: '✒️' },
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
    <div className="h-[calc(100vh-100px)] flex gap-8 overflow-hidden p-2">
      
      {/* --- Left Panel: Builder & AI --- */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* 1. AI Assistant */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 shadow-sm p-5 relative overflow-hidden">
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
               <Sparkles size={20} />
            </div>
            <div className="flex-1">
               <h3 className="text-sm font-bold text-indigo-900 mb-1">دستیار هوشمند</h3>
               <p className="text-xs text-indigo-700/70 mb-4">موضوع را بنویسید، هوش مصنوعی تمام فیلدها را پر می‌کند.</p>
               
               <div className="flex gap-2 mb-3">
                  <input 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="مثال: تخفیف شب یلدا برای کفش ورزشی..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-indigo-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm placeholder:text-indigo-300 text-indigo-900"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  />
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isLoading || !prompt}
                    className="bg-indigo-600 hover:bg-indigo-700 border-none text-white shadow-lg shadow-indigo-600/20 px-6 shrink-0"
                  >
                    {isLoading ? <RefreshCw size={18} className="animate-spin" /> : 'تولید خودکار'}
                  </Button>
               </div>

               <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  <span className="text-[10px] font-bold text-indigo-400 pl-2">لحن:</span>
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all text-[10px] font-bold ${
                        tone === t.id 
                          ? 'border-indigo-500 bg-indigo-500 text-white shadow-md' 
                          : 'border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* 2. Manual Editor Form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 relative">
           <div className="flex items-center gap-2 mb-6 text-slate-800">
              <PenTool size={18} className="text-blue-600" />
              <h2 className="text-lg font-bold">ویرایش پیامک</h2>
           </div>

           <div className="space-y-5">
              {/* Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                       <Type size={14} />
                       عنوان پیام (داخلی)
                    </label>
                    <input 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="مثال: کمپین بازگشت مشتری"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-900"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                       <Tag size={14} />
                       برچسب‌ها (اختیاری)
                    </label>
                    <input 
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="مثال: vip, تخفیف, قدیمی"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-900"
                    />
                 </div>
              </div>

              {/* Main Text */}
              <div>
                 <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                       <Smartphone size={14} />
                       متن پیامک
                    </label>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${charCount > 140 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                       {charCount} کاراکتر / {segmentCount} بخش
                    </div>
                 </div>
                 <textarea 
                   value={formData.text}
                   onChange={(e) => setFormData({...formData, text: e.target.value})}
                   className="w-full h-32 p-4 rounded-xl bg-white border-2 border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-sm leading-relaxed text-slate-900 shadow-sm"
                   placeholder="متن پیامک خود را اینجا بنویسید..."
                 />
              </div>

              {/* Description */}
              <div>
                 <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <AlignLeft size={14} />
                    توضیحات استراتژی (اختیاری)
                 </label>
                 <textarea 
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   rows={2}
                   className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-900 resize-none"
                   placeholder="یادداشت برای هم‌تیمی‌ها..."
                 />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                  <Button onClick={handleCopy} variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50">
                     {copyStatus ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
                     <span className="mr-2">{copyStatus ? 'کپی شد' : 'کپی متن'}</span>
                  </Button>
                  <Button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-600/20 text-white">
                     <Save size={16} />
                     <span className="mr-2">ذخیره در لیست</span>
                  </Button>
               </div>
           </div>
        </div>

        {/* 3. Saved Templates List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col min-h-[250px]">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Save size={16} className="text-slate-400" />
              قالب‌های ذخیره شده
            </h3>
            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-mono">{savedMessages.length}</span>
          </div>
          <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar flex-1">
            {savedMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                   <Save size={20} className="opacity-50" />
                </div>
                <span className="text-xs">هنوز قالبی ذخیره نکرده‌اید.</span>
              </div>
            ) : (
              savedMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => loadTemplate(msg)}
                  className="group bg-white border border-slate-200 p-4 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all relative cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-slate-800 text-xs mb-1">{msg.subject}</h4>
                        <div className="flex gap-1">
                            {msg.tags?.map((tag, i) => (
                                <span key={i} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{tag}</span>
                            ))}
                        </div>
                    </div>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                      {TONES.find(t => t.id === msg.tone)?.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed pl-8 line-clamp-2 border-r-2 border-slate-100 pr-2 mr-1">
                      {msg.text}
                  </p>
                  
                  <button 
                    onClick={(e) => handleDelete(msg.id, e)}
                    className="absolute bottom-3 left-3 p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
      <div className="w-[400px] flex flex-col items-center justify-center relative shrink-0 py-10">
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
  );
};

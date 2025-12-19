
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, Eye, Copy, RefreshCw, PenTool, Mail, Save, FolderOpen, Trash2, X, Image as ImageIcon, Link as LinkIcon, Check, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface SavedTemplate {
  id: string;
  name: string;
  content: string;
  date: string;
}

interface DetectedImage {
  index: number;
  src: string;
  alt: string;
}

export const DashboardEmailBuilder: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  
  // Image Management State
  const [detectedImages, setDetectedImages] = useState<DetectedImage[]>([]);
  
  // Save/Load State
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('peiksa_email_templates');
    if (saved) {
      setSavedTemplates(JSON.parse(saved));
    }
  }, []);

  // Detect images whenever HTML content changes
  useEffect(() => {
    if (!htmlContent) {
      setDetectedImages([]);
      return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const imgs = doc.getElementsByTagName('img');
    const imagesList: DetectedImage[] = [];
    
    for (let i = 0; i < imgs.length; i++) {
      imagesList.push({
        index: i,
        src: imgs[i].src,
        alt: imgs[i].alt || `Image ${i + 1}`
      });
    }
    setDetectedImages(imagesList);
  }, [htmlContent]);

  const saveToLocalStorage = (templates: SavedTemplate[]) => {
    localStorage.setItem('peiksa_email_templates', JSON.stringify(templates));
    setSavedTemplates(templates);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName || !htmlContent) return;
    
    const newTemplate: SavedTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      content: htmlContent,
      date: new Date().toLocaleDateString('fa-IR')
    };

    const updated = [newTemplate, ...savedTemplates];
    saveToLocalStorage(updated);
    setShowSaveModal(false);
    setNewTemplateName('');
    alert('قالب با موفقیت ذخیره شد.');
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = savedTemplates.filter(t => t.id !== id);
    saveToLocalStorage(updated);
  };

  const handleLoadTemplate = (template: SavedTemplate) => {
    setHtmlContent(template.content);
    setShowLoadModal(false);
  };

  const handleUpdateImage = (index: number, newUrl: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const imgs = doc.getElementsByTagName('img');
    
    if (imgs[index]) {
      imgs[index].src = newUrl;
      // We serialize the documentElement to get the full HTML
      setHtmlContent(doc.documentElement.outerHTML);
    }
  };

  const handleImageUpload = (index: number, file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newUrl = e.target?.result as string;
        handleUpdateImage(index, newUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateTemplate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a world-class email developer.
        Create a modern, responsive HTML email template based on this request: "${prompt}".
        
        CRITICAL RULES:
        1. **FONT**: You MUST include this link in <head>: <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;900&display=swap" rel="stylesheet">
           Apply "font-family: 'Vazirmatn', sans-serif;" to the body, tables, tds, ps, and ALL text elements.
        2. **IMAGES**: Use "https://dummyimage.com" for placeholders as it is robust.
           - Banner example: "https://dummyimage.com/600x300/2563eb/fff&text=Banner"
           - Product example: "https://dummyimage.com/200x200/e2e8f0/475569&text=Product"
           - Do NOT use spaces in URLs.
        3. **DIRECTION**: Set <html dir="rtl" lang="fa">.
        4. **DESIGN**: Use a centered layout (max-width: 600px). White container on a gray background (#f3f4f6). Use inline CSS for compatibility.
        
        Return ONLY the raw HTML code. No markdown, no explanations.`,
      });
      
      let cleanHtml = response.text || '';
      cleanHtml = cleanHtml.replace(/```html/g, '').replace(/```/g, '');
      
      // --- FORCE INJECT FONT & STYLES ---
      const fontInjection = `
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;900&display=swap');
          body, table, td, p, a, li, blockquote, div, span, h1, h2, h3, h4 {
            font-family: 'Vazirmatn', Tahoma, Arial, sans-serif !important;
          }
        </style>
      `;
      
      if (cleanHtml.includes('</head>')) {
        cleanHtml = cleanHtml.replace('</head>', `${fontInjection}</head>`);
      } else {
        cleanHtml = fontInjection + cleanHtml;
      }

      setHtmlContent(cleanHtml);
    } catch (error) {
      console.error("Error generating email:", error);
      alert("متاسفانه مشکلی در تولید قالب پیش آمد. لطفا مجدد تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlContent);
    alert('کد HTML در حافظه کپی شد!');
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between shrink-0 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
            <PenTool size={18} />
          </div>
          ایمیل ساز هوشمند
        </h1>
        <div className="flex gap-2">
           <Button 
             variant="outline" 
             size="sm" 
             onClick={() => setShowLoadModal(true)}
             className="text-slate-600 border-slate-300 hover:bg-slate-50"
           >
             <FolderOpen size={16} className="mr-2" />
             قالب‌های ذخیره شده
           </Button>
           <Button 
             size="sm" 
             onClick={() => setShowSaveModal(true)}
             disabled={!htmlContent}
             className="bg-green-600 hover:bg-green-700 border-none"
           >
             <Save size={16} className="mr-2" />
             ذخیره قالب
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Control Panel */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          
          {/* Top Section: Input & Generate */}
          <div className="p-4 border-b border-slate-100 shrink-0">
            <h3 className="font-bold text-slate-900 mb-3 text-sm">دستورات هوش مصنوعی</h3>
            <div className="space-y-3">
              <div className="relative">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="مثال: ایمیل فروش ویژه یلدا با تم قرمز..."
                  className="w-full h-32 p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-slate-900 text-sm leading-relaxed placeholder:text-slate-400"
                ></textarea>
                <div className="absolute bottom-3 left-3 text-blue-500">
                   <Sparkles size={16} />
                </div>
              </div>

              <Button 
                fullWidth 
                onClick={generateTemplate}
                disabled={isLoading || !prompt}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                     <RefreshCw size={18} className="animate-spin" />
                     در حال پردازش...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                     <Sparkles size={18} />
                     تولید قالب جدید
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Bottom Section: Image Manager (Fills the gap) */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ImageIcon size={16} className="text-slate-500" />
                مدیریت تصاویر
              </h3>
              <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {detectedImages.length} تصویر یافت شد
              </span>
            </div>

            {detectedImages.length === 0 ? (
              <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                 <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                 <p className="text-xs">پس از تولید قالب، تصاویر اینجا نمایش داده می‌شوند.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {detectedImages.map((img) => (
                   <div key={img.index} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex gap-3 mb-2">
                         <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                            <img src={img.src} alt="thumbnail" className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-700 truncate mb-1">تصویر #{img.index + 1}</div>
                            <div className="text-[10px] text-slate-400 truncate" dir="ltr">
                               {img.src.startsWith('data:') ? '(تصویر آپلود شده)' : img.src}
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                           <input 
                             type="text" 
                             value={img.src.startsWith('data:') ? '' : img.src}
                             placeholder={img.src.startsWith('data:') ? "تصویر آپلود شده (غیرقابل ویرایش متنی)" : "لینک تصویر..."}
                             readOnly={img.src.startsWith('data:')}
                             className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none text-left dir-ltr"
                             dir="ltr"
                             onChange={(e) => handleUpdateImage(img.index, e.target.value)}
                           />
                           <LinkIcon size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        
                        <input
                           type="file"
                           id={`upload-${img.index}`}
                           className="hidden"
                           accept="image/*"
                           onChange={(e) => {
                               if (e.target.files?.[0]) handleImageUpload(img.index, e.target.files[0]);
                           }}
                        />
                        <label 
                           htmlFor={`upload-${img.index}`}
                           className="p-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors border border-blue-100"
                           title="آپلود تصویر جایگزین"
                        >
                           <Upload size={16} />
                        </label>
                      </div>
                   </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="border-b border-slate-100 p-2 flex items-center justify-between bg-slate-50/50 shrink-0">
            <div className="flex bg-slate-200/50 p-0.5 rounded-lg">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Eye size={14} />
                پیش‌نمایش
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'code' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Code size={14} />
                کد HTML
              </button>
            </div>

            {htmlContent && (
              <button 
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 hover:bg-blue-50 rounded-lg"
                title="کپی کد"
              >
                <Copy size={16} />
              </button>
            )}
          </div>

          <div className="flex-1 bg-slate-100 relative overflow-hidden">
            {htmlContent ? (
              activeTab === 'preview' ? (
                <iframe 
                  title="Preview"
                  srcDoc={htmlContent}
                  className="w-full h-full border-none bg-white"
                />
              ) : (
                <div className="w-full h-full overflow-auto p-4 bg-[#1e1e1e] text-slate-300 font-mono text-xs leading-relaxed" dir="ltr">
                  <pre>{htmlContent}</pre>
                </div>
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center rotate-3">
                  <Mail size={32} className="-rotate-3" />
                </div>
                <p className="text-sm font-medium">هنوز قالبی تولید نشده است</p>
                <p className="text-xs text-slate-400 max-w-xs text-center">توضیحات خود را در پنل سمت راست بنویسید و دکمه تولید را بزنید</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
               onClick={() => setShowSaveModal(false)}
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6"
             >
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-lg text-slate-900">ذخیره قالب</h3>
                   <button onClick={() => setShowSaveModal(false)}><X className="text-slate-400" /></button>
                </div>
                
                <div className="mb-6">
                   <label className="block text-sm font-bold text-slate-700 mb-2">نام قالب</label>
                   <input 
                     type="text" 
                     autoFocus
                     placeholder="مثال: خبرنامه یلدا ۱۴۰۳"
                     value={newTemplateName}
                     onChange={(e) => setNewTemplateName(e.target.value)}
                     className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none transition-all"
                   />
                </div>

                <div className="flex gap-3">
                   <Button variant="ghost" onClick={() => setShowSaveModal(false)} fullWidth>انصراف</Button>
                   <Button onClick={handleSaveTemplate} disabled={!newTemplateName} fullWidth>ذخیره</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Load Modal */}
      <AnimatePresence>
        {showLoadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
               onClick={() => setShowLoadModal(false)}
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 flex flex-col max-h-[80vh]"
             >
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                   <h3 className="font-bold text-lg text-slate-900">قالب‌های ذخیره شده</h3>
                   <button onClick={() => setShowLoadModal(false)}><X className="text-slate-400" /></button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                   {savedTemplates.length === 0 ? (
                      <div className="text-center text-slate-500 py-10">
                         <FolderOpen size={48} className="mx-auto mb-4 opacity-20" />
                         <p>هیچ قالبی ذخیره نشده است.</p>
                      </div>
                   ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {savedTemplates.map((template) => (
                            <div key={template.id} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors group relative bg-slate-50 hover:bg-white">
                               <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-slate-800">{template.name}</h4>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.id); }}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                  >
                                     <Trash2 size={16} />
                                  </button>
                               </div>
                               <div className="text-xs text-slate-500 mb-4">{template.date}</div>
                               <Button size="sm" fullWidth variant="outline" onClick={() => handleLoadTemplate(template)}>
                                  انتخاب و ویرایش
                               </Button>
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

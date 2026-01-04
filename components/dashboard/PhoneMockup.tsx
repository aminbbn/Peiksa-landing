
import React, { useState } from 'react';
import { Wifi, Signal, ChevronLeft, User, Info, Video, Plus, Mic, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Types ---
interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  contactName?: string;
  avatarColor?: string;
}

interface ChatBubbleProps {
  children: React.ReactNode;
  isSender?: boolean;
  status?: string;
  showTail?: boolean;
}

// --- Components ---

const IOSBattery = () => (
  <div className="relative w-[27px] h-[13px] border-[1px] border-black/35 rounded-[4px] p-[1.5px] mr-1 opacity-80 mix-blend-multiply">
    <div className="h-full w-full bg-black rounded-[2px]" />
    <div className="absolute top-1/2 -right-[3.5px] -translate-y-1/2 w-[2px] h-[4px] bg-black/35 rounded-r-[1px]" />
  </div>
);

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  children, 
  isSender = false, 
  status,
  showTail = true 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`flex flex-col gap-1 max-w-[85%] ${isSender ? 'items-end self-end' : 'items-start self-start'}`}
    >
       <div 
         className={`relative px-[18px] py-[10px] text-[17px] leading-[1.35] shadow-sm
           ${isSender 
             ? 'bg-[#007AFF] text-white' 
             : 'bg-[#E9E9EB] text-black'}
           ${isSender 
             ? 'rounded-[20px] rounded-br-[4px]' 
             : 'rounded-[20px] rounded-bl-[4px]'}
         `}
       >
         <p className="relative z-10 whitespace-pre-wrap break-words text-right" dir="rtl">{children}</p>
       </div>
       
       {isSender && status && (
         <span className="text-[11px] text-slate-400 font-medium px-1 -mt-0.5 opacity-0 animate-[fadeIn_0.5s_ease-in_forwards]">{status}</span>
       )}
    </motion.div>
  );
};

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ 
  children, 
  className = '',
  contactName = 'Peiksa Bot',
  avatarColor = 'from-indigo-300 to-indigo-400'
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    // Outer Frame: 380px x 780px
    <div className={`relative w-[380px] h-[780px] bg-black rounded-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] z-10 ring-[1px] ring-white/10 ${className}`} dir="ltr">
      
      {/* --- Hardware Frame Overlay --- */}
      <div className="absolute inset-0 rounded-[50px] border-[6px] border-[#2b2b2b] shadow-[inset_0_0_4px_2px_rgba(0,0,0,0.5)] z-20 pointer-events-none"></div>
      <div className="absolute inset-0 rounded-[50px] border-[1px] border-white/20 z-20 pointer-events-none mix-blend-overlay"></div>

      {/* --- Physical Buttons --- */}
      {/* Action Button */}
      <div className="absolute top-[68px] -left-[4px] w-[4px] h-7 bg-[#2a2a2a] rounded-l-[2px] z-[-1] shadow-[inset_-1px_0_1px_rgba(255,255,255,0.1)]"></div> 
      {/* Volume Up */}
      <div className="absolute top-[112px] -left-[4px] w-[4px] h-14 bg-[#2a2a2a] rounded-l-[2px] z-[-1] shadow-[inset_-1px_0_1px_rgba(255,255,255,0.1)]"></div> 
      {/* Volume Down */}
      <div className="absolute top-[178px] -left-[4px] w-[4px] h-14 bg-[#2a2a2a] rounded-l-[2px] z-[-1] shadow-[inset_-1px_0_1px_rgba(255,255,255,0.1)]"></div> 
      {/* Power Button */}
      <div className="absolute top-[112px] -right-[4px] w-[4px] h-24 bg-[#2a2a2a] rounded-r-[2px] z-[-1] shadow-[inset_1px_0_1px_rgba(255,255,255,0.1)]"></div>   

         {/* --- Screen Content --- */}
      <div className="absolute top-[9px] left-[9px] right-[9px] bottom-[9px] bg-white rounded-[40px] overflow-hidden flex flex-col z-10 font-sans isolate ring-4 ring-black">
         
         <style>{`
           .no-scrollbar::-webkit-scrollbar { display: none; }
           .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
         `}</style>

         {/* --- Chat Scroll Area --- */}
         <div className="absolute inset-0 overflow-y-auto flex flex-col bg-white no-scrollbar pt-[135px] pb-[90px]">
             <div className="px-5 py-4 space-y-3 flex flex-col w-full min-h-full justify-end">
                <div className="w-full flex justify-center pb-4">
                    <span className="text-[#86868a] text-[11px] font-medium">Today 9:41 AM</span>
                </div>
                {children}
             </div>
         </div>

         {/* --- Top Bar --- */}
         <div className="absolute top-0 left-0 right-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/60 transition-all">
             
             {/* Status Bar */}
             {/* Height increased to 58px and padding adjusted to center content vertically with the lower Dynamic Island */}
             <div className="h-[58px] w-full flex justify-between items-end pb-[12px] px-7 text-black font-semibold text-[16px]">
                 <span className="tracking-tight w-12 text-center relative left-2 leading-none">9:41</span>
                 <div className="flex items-center gap-1.5 w-[70px] justify-center relative right-2">
                    <Signal size={19} className="fill-black stroke-black" strokeWidth={1} />
                    <Wifi size={19} strokeWidth={2.5} className="mr-0.5" />
                    <IOSBattery />
                 </div>
             </div>
             
             {/* Header */}
             <div className="w-full flex items-center justify-between px-4 pb-4 mt-1">
                 <button className="flex items-center text-[#007AFF] active:opacity-50 transition-opacity pl-1 pr-1 gap-1 min-w-[70px]">
                     <ChevronLeft size={26} strokeWidth={2.5} className="-ml-1.5" />
                     <span className="text-[17px] leading-none pb-[1px] font-medium">85</span>
                 </button>
                 
                 <div className="flex flex-col items-center justify-center cursor-pointer hover:opacity-70 transition-opacity transform translate-y-[2px]">
                    <div className={`w-8 h-8 bg-gradient-to-b ${avatarColor} rounded-full flex items-center justify-center text-white/90 shadow-sm mb-[3px] ring-1 ring-black/5`}>
                       <User size={16} fill="currentColor" strokeWidth={2} />
                    </div>
                    <span className="text-[11px] text-black font-medium flex items-center gap-0.5 leading-none">
                       {contactName} <ChevronLeft size={8} className="rotate-180 text-slate-300 stroke-[3px]" />
                    </span>
                 </div>
                 
                 <div className="flex items-center justify-end gap-5 min-w-[70px]">
                    <button className="text-[#007AFF] active:opacity-50">
                       <Video size={24} className="stroke-[1.5px]" /> 
                    </button>
                    <button className="text-[#007AFF] active:opacity-50">
                       <Info size={22} className="stroke-[2px]" />
                    </button>
                 </div>
             </div>
         </div>

         {/* --- Bottom Input --- */}
         <div className="absolute bottom-0 left-0 right-0 z-30 bg-[#F9F9F9]/90 backdrop-blur-xl border-t border-[#B2B2B2]/30 w-full pb-8 pt-2.5 px-4">
             <div className="flex items-end gap-3">
                <button className="w-[34px] h-[34px] bg-[#C5C5C7] rounded-full flex items-center justify-center text-white cursor-pointer active:bg-slate-400 transition-colors shrink-0 mb-[3px]">
                    <Plus size={20} strokeWidth={2.5} /> 
                </button>
                <div className="flex-1 min-h-[36px] border border-[#C6C6C6]/60 rounded-[18px] flex items-center bg-white px-3 py-1 shadow-sm cursor-text relative mb-[1px]">
                   <input 
                      type="text"
                      placeholder="iMessage"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full bg-transparent outline-none text-[17px] text-black placeholder:text-slate-400 leading-5 pt-0.5 pl-1"
                      dir="auto" 
                   />
                   {inputValue.length > 0 && (
                      <button className="absolute right-1 w-[28px] h-[28px] bg-[#007AFF] rounded-full flex items-center justify-center text-white animate-in zoom-in-50 duration-200">
                          <ArrowUp size={18} strokeWidth={3} />
                      </button>
                   )}
                </div>
                {inputValue.length === 0 && (
                   <button className="w-[36px] h-[36px] flex items-center justify-center text-slate-500 active:text-slate-700 transition-colors shrink-0 mb-[1px]">
                       <Mic size={24} fill="currentColor" className="stroke-none" /> 
                   </button>
                )}
             </div>
         </div>

         {/* Home Indicator */}
         <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[135px] h-[5px] bg-black rounded-full z-40 pointer-events-none"></div>

      </div>

      {/* --- Dynamic Island --- */}
      <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-[24px] z-40 flex items-center justify-center pointer-events-none shadow-md">
         <div className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-[#1a1b26] ring-[0.5px] ring-white/20 flex items-center justify-center overflow-hidden">
            <div className="w-[4px] h-[4px] bg-[#4a5b75] rounded-full blur-[1px]"></div>
            <div className="absolute top-[2px] right-[2px] w-[2px] h-[2px] bg-white/40 rounded-full blur-[0.5px]"></div>
         </div>
      </div>

    </div>
  );
};

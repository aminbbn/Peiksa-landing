
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, FileText, Image as ImageIcon, MoreVertical, Search, Plus, 
  Upload, Home, ChevronLeft, Grid, List, Trash2, FolderPlus, 
  Copy, Scissors, ClipboardPaste, Tag, Edit3, CheckCircle, File, Film, X,
  HardDrive, Clock, Star, Cloud, Info, Download, ChevronRight, Eye, RefreshCw, AlertTriangle, Lock, Code, Check, FileCode
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SavedTemplate, generateHtmlFromBlocks } from '../../utils/emailGenerator';

// --- Types ---
type FileType = 'folder' | 'image' | 'document' | 'video' | 'audio' | 'email-template' | 'other';

interface FileSystemItem {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  size?: string;
  date: string;
  tags: string[];
  color?: string; // For folders
  thumbnail?: string; // For images
  isStarred?: boolean;
  isDeleted?: boolean;
  isLocked?: boolean;
  templateData?: SavedTemplate;
}

const TEMPLATE_FOLDER_ID = 'email_templates_folder';

// --- Mock Initial Data ---
const initialFileSystem: FileSystemItem[] = [
  { id: '1', name: 'تصاویر کمپین', type: 'folder', parentId: null, date: '1402/09/01', tags: ['مهم'], color: 'blue', isStarred: true, isDeleted: false },
  { id: '2', name: 'اسناد اداری', type: 'folder', parentId: null, date: '1402/08/15', tags: [], color: 'slate', isStarred: false, isDeleted: false },
  { id: '3', name: 'ویدیوهای آموزشی', type: 'folder', parentId: null, date: '1402/09/10', tags: ['ویدیو'], color: 'red', isStarred: false, isDeleted: false },
  { id: TEMPLATE_FOLDER_ID, name: 'قالب‌های ایمیل شما', type: 'folder', parentId: null, date: '1402/10/01', tags: ['سیستمی'], color: 'purple', isStarred: false, isDeleted: false, isLocked: true },
  { id: '4', name: 'logo_v1.png', type: 'image', parentId: '1', size: '2.4 MB', date: '1402/09/02', tags: ['برندینگ'], isStarred: false, isDeleted: false },
  { id: '5', name: 'banner_yalda.jpg', type: 'image', parentId: '1', size: '1.1 MB', date: '1402/09/20', tags: ['یلدا'], isStarred: true, isDeleted: false },
  { id: '6', name: 'contract_template.pdf', type: 'document', parentId: '2', size: '450 KB', date: '1402/08/20', tags: ['قرارداد'], isStarred: false, isDeleted: false },
  { id: '7', name: 'intro_course.mp4', type: 'video', parentId: '3', size: '120 MB', date: '1402/09/11', tags: [], isStarred: false, isDeleted: false },
  { id: '8', name: 'report_2024.docx', type: 'document', parentId: null, size: '22 KB', date: '1402/10/01', tags: [], isStarred: false, isDeleted: false },
];

const FOLDER_COLORS = [
  { name: 'آبی', value: 'blue', class: 'bg-blue-500 text-white' },
  { name: 'قرمز', value: 'red', class: 'bg-red-500 text-white' },
  { name: 'سبز', value: 'green', class: 'bg-green-500 text-white' },
  { name: 'زرد', value: 'amber', class: 'bg-amber-500 text-white' },
  { name: 'بنفش', value: 'purple', class: 'bg-purple-500 text-white' },
  { name: 'خاکستری', value: 'slate', class: 'bg-slate-500 text-white' },
];

// --- Sub-components ---

const FolderIcon = ({ color = 'blue', className = '', isLocked = false }: { color?: string, className?: string, isLocked?: boolean }) => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500 fill-blue-500',
    red: 'text-red-500 fill-red-500',
    green: 'text-green-500 fill-green-500',
    amber: 'text-amber-500 fill-amber-500',
    purple: 'text-purple-500 fill-purple-500',
    slate: 'text-slate-500 fill-slate-500',
  };
  return (
    <div className="relative">
       <Folder className={`${colorMap[color] || colorMap['blue']} ${className}`} />
       {isLocked && <Lock size={12} className="absolute bottom-1 right-1 text-white bg-black/20 rounded-full p-0.5" />}
    </div>
  );
};

const FileIcon = ({ type, className = '' }: { type: FileType, className?: string }) => {
  if (type === 'image') return <ImageIcon className={`text-purple-500 ${className}`} />;
  if (type === 'video') return <Film className={`text-red-500 ${className}`} />;
  if (type === 'document') return <FileText className={`text-blue-500 ${className}`} />;
  if (type === 'email-template') return <FileCode className={`text-orange-500 ${className}`} />;
  return <File className={`text-slate-400 ${className}`} />;
};

const FilePreview = ({ item, className = "" }: { item: FileSystemItem, className?: string }) => {
  if (item.type === 'email-template') {
     return (
        <div className={`w-full h-full bg-gradient-to-br from-orange-50 to-orange-100/50 flex flex-col items-center justify-center text-orange-500 ${className}`}>
           <div className="bg-white p-3 rounded-2xl shadow-sm border border-orange-100 mb-2">
              <FileCode size={32} />
           </div>
           <span className="text-[10px] font-bold text-orange-700/70 tracking-wider uppercase">HTML Template</span>
        </div>
     );
  }
  
  if (item.type === 'image') {
     return (
        <div className={`w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 ${className}`}>
           <ImageIcon size={32} />
        </div>
     );
  }

  if (item.type === 'folder') {
     return (
       <div className={`w-full h-full flex items-center justify-center ${className}`}>
          <FolderIcon color={item.color} className="w-16 h-16" isLocked={item.isLocked} />
       </div>
     );
  }

  return (
     <div className={`w-full h-full bg-slate-50 flex items-center justify-center text-slate-400 ${className}`}>
        <FileIcon type={item.type} className="w-12 h-12" />
     </div>
  );
};

export const DashboardFileManager: React.FC = () => {
  const [items, setItems] = useState<FileSystemItem[]>(initialFileSystem);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [navSection, setNavSection] = useState<'all' | 'recent' | 'favorites' | 'trash'>('all');
  
  // Clipboard
  const [clipboard, setClipboard] = useState<{ action: 'copy' | 'cut', items: string[] } | null>(null);

  // Modals
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('blue');
  const [tagInput, setTagInput] = useState('');

  // Preview & Copy
  const [previewItem, setPreviewItem] = useState<FileSystemItem | null>(null);
  const [showCodeCopied, setShowCodeCopied] = useState(false);

  // Upload Simulation
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    // Sync with localStorage email templates
    const syncTemplates = () => {
      const savedTemplates: SavedTemplate[] = JSON.parse(localStorage.getItem('peiksa_email_templates') || '[]');
      
      setItems(prevItems => {
        // Remove existing templates to avoid duplicates during re-sync
        const nonTemplateItems = prevItems.filter(item => item.parentId !== TEMPLATE_FOLDER_ID);
        
        // Ensure the folder exists
        const hasFolder = nonTemplateItems.find(i => i.id === TEMPLATE_FOLDER_ID);
        if (!hasFolder) {
           nonTemplateItems.push({ id: TEMPLATE_FOLDER_ID, name: 'قالب‌های ایمیل شما', type: 'folder', parentId: null, date: '1402/10/01', tags: ['سیستمی'], color: 'purple', isStarred: false, isDeleted: false, isLocked: true });
        }

        const templateItems: FileSystemItem[] = savedTemplates.map(t => ({
          id: `template-${t.id}`,
          name: t.name,
          type: 'email-template',
          parentId: TEMPLATE_FOLDER_ID,
          date: t.date,
          tags: ['قالب'],
          isStarred: false,
          isDeleted: false,
          templateData: t
        }));

        return [...nonTemplateItems, ...templateItems];
      });
    };

    syncTemplates();
  }, []);

  // --- Derived State ---
  const currentFolder = items.find(i => i.id === currentFolderId);
  
  const breadcrumbs = [];
  let tempId = currentFolderId;
  while (tempId) {
    const folder = items.find(i => i.id === tempId);
    if (folder) {
      breadcrumbs.unshift(folder);
      tempId = folder.parentId;
    } else {
      break;
    }
  }

  const filteredItems = items.filter(item => {
    if (navSection === 'trash') return item.isDeleted;
    if (item.isDeleted) return false;
    if (navSection === 'favorites') return item.isStarred;
    if (navSection === 'recent') return true; 
    
    const isParentMatch = searchQuery ? true : item.parentId === currentFolderId;
    const isNameMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return isParentMatch && isNameMatch;
  });

  const folders = filteredItems.filter(i => i.type === 'folder');
  const files = filteredItems.filter(i => i.type !== 'folder');

  const selectedItemDetails = selectedItems.length === 1 
    ? items.find(i => i.id === selectedItems[0]) 
    : null;

  // --- Handlers ---

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName) return;
    
    const newFolder: FileSystemItem = {
      id: Date.now().toString(),
      name: newFolderName,
      type: 'folder',
      parentId: currentFolderId,
      date: new Date().toLocaleDateString('fa-IR'),
      tags: [],
      color: newFolderColor,
      isStarred: false,
      isDeleted: false
    };
    
    setItems([...items, newFolder]);
    setShowCreateFolder(false);
    setNewFolderName('');
    setNewFolderColor('blue');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      const filesArray = Array.from(e.target.files);
      setTimeout(() => {
        const newFiles: FileSystemItem[] = filesArray.map((f: File) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: f.name,
          type: f.type.includes('image') ? 'image' : f.type.includes('video') ? 'video' : 'document',
          parentId: currentFolderId,
          size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
          date: new Date().toLocaleDateString('fa-IR'),
          tags: [],
          isStarred: false,
          isDeleted: false
        }));
        setItems(prev => [...prev, ...newFiles]);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleRename = (newName: string) => {
    if (!selectedItemDetails) return;
    if (selectedItemDetails.isLocked) {
      alert('این آیتم قابل تغییر نام نیست.');
      return;
    }
    setItems(items.map(i => i.id === selectedItemDetails.id ? { ...i, name: newName } : i));
  };

  const handleDelete = () => {
    const hasLocked = selectedItems.some(id => items.find(i => i.id === id)?.isLocked);
    if (hasLocked) {
      alert('برخی از آیتم‌های انتخاب شده سیستمی هستند و قابل حذف نیستند.');
      return;
    }

    if (navSection === 'trash') {
      if (confirm('آیا از حذف دائمی این موارد اطمینان دارید؟ این عملیات قابل بازگشت نیست.')) {
        const idsToDelete = new Set(selectedItems);
        // Also remove from localStorage if it's a template
        const templatesToDelete = items.filter(i => idsToDelete.has(i.id) && i.type === 'email-template');
        if (templatesToDelete.length > 0) {
           const savedTemplates: SavedTemplate[] = JSON.parse(localStorage.getItem('peiksa_email_templates') || '[]');
           const newSaved = savedTemplates.filter(t => !templatesToDelete.some(del => del.templateData?.id === t.id));
           localStorage.setItem('peiksa_email_templates', JSON.stringify(newSaved));
        }
        setItems(items.filter(i => !idsToDelete.has(i.id)));
        setSelectedItems([]);
      }
    } else {
      const idsToDelete = new Set(selectedItems);
      setItems(items.map(i => idsToDelete.has(i.id) ? { ...i, isDeleted: true } : i));
      setSelectedItems([]);
    }
  };

  const handleRestore = () => {
    const idsToRestore = new Set(selectedItems);
    setItems(items.map(i => idsToRestore.has(i.id) ? { ...i, isDeleted: false } : i));
    setSelectedItems([]);
  };

  const toggleStar = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setItems(items.map(i => i.id === id ? { ...i, isStarred: !i.isStarred } : i));
  };

  const handleCopy = () => {
    setClipboard({ action: 'copy', items: [...selectedItems] });
    setSelectedItems([]);
  };

  const handleCut = () => {
    const hasLocked = selectedItems.some(id => items.find(i => i.id === id)?.isLocked);
    if (hasLocked) return;
    setClipboard({ action: 'cut', items: [...selectedItems] });
    setSelectedItems([]);
  };

  const handlePaste = () => {
    if (!clipboard) return;
    if (currentFolderId === TEMPLATE_FOLDER_ID) {
       alert('نمی‌توانید در این پوشه فایل اضافه کنید.');
       return;
    }
    
    if (clipboard.action === 'cut') {
      setItems(items.map(i => clipboard.items.includes(i.id) ? { ...i, parentId: currentFolderId } : i));
      setClipboard(null);
    } else {
      const itemsToCopy = items.filter(i => clipboard.items.includes(i.id));
      const newItems = itemsToCopy.map(i => ({
        ...i,
        id: Math.random().toString(36).substr(2, 9),
        parentId: currentFolderId,
        name: `${i.name} (کپی)`
      }));
      setItems([...items, ...newItems]);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput || !selectedItemDetails) return;
    setItems(items.map(i => i.id === selectedItemDetails.id ? { ...i, tags: [...i.tags, tagInput] } : i));
    setTagInput('');
  };

  const removeTag = (itemId: string, tagToRemove: string) => {
    setItems(items.map(i => i.id === itemId ? { ...i, tags: i.tags.filter(t => t !== tagToRemove) } : i));
  };

  const handleCopyCode = (template: SavedTemplate) => {
    const html = generateHtmlFromBlocks(template.blocks);
    navigator.clipboard.writeText(html);
    setShowCodeCopied(true);
    setTimeout(() => setShowCodeCopied(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-slate-50 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      
      {/* --- Left Sidebar --- */}
      <div className="w-64 bg-white border-l border-slate-200 flex flex-col shrink-0">
        <div className="p-6">
          <Button 
            fullWidth 
            className="shadow-lg shadow-blue-500/20 mb-6"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                در حال آپلود...
              </span>
            ) : (
              <>
                <Upload size={18} className="ml-2" />
                آپلود فایل جدید
              </>
            )}
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleUpload} />

          <div className="space-y-1">
            <button 
              onClick={() => { setNavSection('all'); setCurrentFolderId(null); setSelectedItems([]); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${navSection === 'all' && !currentFolderId ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <HardDrive size={18} />
              فایل‌های من
            </button>
            <button 
              onClick={() => { setNavSection('recent'); setSelectedItems([]); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${navSection === 'recent' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Clock size={18} />
              اخیر
            </button>
            <button 
              onClick={() => { setNavSection('favorites'); setSelectedItems([]); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${navSection === 'favorites' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Star size={18} />
              نشان‌ شده‌ها
            </button>
            <button 
              onClick={() => { setNavSection('trash'); setSelectedItems([]); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${navSection === 'trash' ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Trash2 size={18} />
              سطل زباله
            </button>
          </div>

          <div className="mt-8">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 px-2">دسته‌بندی‌ها</h4>
            <div className="space-y-1">
              {['تصاویر', 'ویدیوها', 'اسناد', 'صوتی', 'قالب‌ها'].map((cat) => (
                <button key={cat} className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <span>{cat}</span>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-md text-slate-500">24</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
              <Cloud size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">فضای ابری</div>
              <div className="text-xs text-slate-500">7.5 گیگابایت از 10 گیگابایت</div>
            </div>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-[75%] rounded-full"></div>
          </div>
          <button className="text-xs text-blue-600 font-bold mt-3 hover:underline">ارتقای فضای ذخیره‌سازی</button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Toolbar */}
        <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 overflow-hidden">
             {navSection === 'trash' ? (
                <span className="text-lg font-bold text-red-600 flex items-center gap-2">
                   <Trash2 size={20} />
                   سطل زباله
                </span>
             ) : navSection === 'favorites' ? (
                <span className="text-lg font-bold text-amber-500 flex items-center gap-2">
                   <Star size={20} fill="currentColor" />
                   نشان‌ شده‌ها
                </span>
             ) : (
                <>
                   <button onClick={() => setCurrentFolderId(null)} className={`hover:bg-slate-100 p-1.5 rounded-lg transition-colors ${!currentFolderId ? 'text-slate-900' : 'text-slate-500'}`}>
                     <Home size={18} />
                   </button>
                   {breadcrumbs.map((folder, idx) => (
                      <React.Fragment key={folder.id}>
                         <ChevronLeft size={16} className="text-slate-300" />
                         <button 
                           onClick={() => setCurrentFolderId(folder.id)}
                           className={`text-sm font-bold truncate hover:bg-slate-100 px-2 py-1 rounded-lg transition-colors ${idx === breadcrumbs.length - 1 ? 'text-slate-900' : 'text-slate-500'}`}
                         >
                            {folder.name}
                         </button>
                      </React.Fragment>
                   ))}
                </>
             )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
             {selectedItems.length > 0 && (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg mr-4 animate-in fade-in slide-in-from-top-2">
                   {navSection === 'trash' && (
                      <button onClick={handleRestore} className="p-2 hover:bg-white text-green-600 rounded-md shadow-sm transition-all" title="بازیابی"><RefreshCw size={16} /></button>
                   )}
                   <button onClick={handleDelete} className="p-2 hover:bg-white text-red-500 rounded-md shadow-sm transition-all" title={navSection === 'trash' ? 'حذف دائمی' : 'حذف'}>
                      <Trash2 size={16} />
                   </button>
                   {navSection !== 'trash' && (
                      <>
                         <button onClick={handleCopy} className="p-2 hover:bg-white text-slate-600 rounded-md shadow-sm transition-all" title="کپی"><Copy size={16} /></button>
                         <button onClick={handleCut} className="p-2 hover:bg-white text-slate-600 rounded-md shadow-sm transition-all" title="برش"><Scissors size={16} /></button>
                      </>
                   )}
                </div>
             )}
             
             {clipboard && (
               <button onClick={handlePaste} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                 <ClipboardPaste size={14} />
                 جایگذاری ({clipboard.items.length})
               </button>
             )}

             <div className="h-6 w-px bg-slate-200 mx-2"></div>

             <div className="relative">
               <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="جستجو..." 
                 className="w-48 bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-9 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
               />
             </div>

             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><Grid size={16} /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><List size={16} /></button>
             </div>
             
             {navSection !== 'trash' && (
                <button 
                  onClick={() => setShowCreateFolder(true)}
                  className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  <FolderPlus size={18} />
                </button>
             )}
          </div>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto p-6 scroll-smooth relative" 
          onClick={() => setSelectedItems([])}
          onContextMenu={(e) => e.preventDefault()}
        >
           {navSection === 'trash' && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6 flex items-center gap-3 text-red-700 text-sm">
                 <AlertTriangle size={18} />
                 <span>فایل‌های حذف شده تا ۳۰ روز در سطل زباله باقی می‌مانند و سپس به طور خودکار حذف می‌شوند.</span>
              </div>
           )}

           {folders.length === 0 && files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                 <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    {navSection === 'trash' ? <Trash2 size={48} className="text-slate-300" /> : <Folder size={48} className="text-slate-300" />}
                 </div>
                 <p className="text-lg font-bold text-slate-600">
                    {navSection === 'trash' ? 'سطل زباله خالی است' : 'پوشه خالی است'}
                 </p>
                 {navSection !== 'trash' && <p className="text-sm mt-1">فایل‌های خود را اینجا بکشید و رها کنید</p>}
              </div>
           ) : (
             <div className="space-y-8">
               {/* Folders Section */}
               {folders.length > 0 && (
                 <div>
                   <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 px-1">پوشه‌ها</h3>
                   <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
                     {folders.map(folder => (
                       <div
                         key={folder.id}
                         onClick={(e) => {
                           e.stopPropagation();
                           if (e.metaKey || e.ctrlKey) {
                             setSelectedItems(prev => prev.includes(folder.id) ? prev.filter(id => id !== folder.id) : [...prev, folder.id]);
                           } else {
                             setSelectedItems([folder.id]);
                           }
                         }}
                         onDoubleClick={(e) => {
                           e.stopPropagation();
                           if (navSection !== 'trash') {
                              setCurrentFolderId(folder.id);
                              setSelectedItems([]);
                              setSearchQuery('');
                           }
                         }}
                         className={`group relative bg-white p-4 rounded-xl border transition-all cursor-pointer select-none ${
                           selectedItems.includes(folder.id) 
                             ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500 shadow-sm' 
                             : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                         }`}
                       >
                         <button 
                           onClick={(e) => toggleStar(folder.id, e)}
                           className={`absolute top-2 right-2 p-1 rounded-full hover:bg-slate-100 transition-colors z-10 ${folder.isStarred ? 'text-amber-400 opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`}
                         >
                            <Star size={14} fill={folder.isStarred ? "currentColor" : "none"} />
                         </button>

                         <div className="flex items-center justify-between mb-3 mt-2">
                           <FolderIcon color={folder.color} className="w-10 h-10" isLocked={folder.isLocked} />
                           {selectedItems.includes(folder.id) && <CheckCircle size={16} className="text-blue-500" />}
                         </div>
                         <div className="font-bold text-slate-700 text-sm truncate">{folder.name}</div>
                         <div className="text-[10px] text-slate-400 mt-1">{folder.date}</div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Files Section */}
               {files.length > 0 && (
                 <div>
                   <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 px-1">فایل‌ها</h3>
                   {viewMode === 'grid' ? (
                     <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
                       {files.map(file => (
                         <div
                           key={file.id}
                           onClick={(e) => {
                             e.stopPropagation();
                             if (e.metaKey || e.ctrlKey) {
                               setSelectedItems(prev => prev.includes(file.id) ? prev.filter(id => id !== file.id) : [...prev, file.id]);
                             } else {
                               setSelectedItems([file.id]);
                             }
                           }}
                           className={`group relative bg-white p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col ${
                             selectedItems.includes(file.id) 
                               ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500 shadow-sm' 
                               : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                           } ${clipboard?.items.includes(file.id) && clipboard.action === 'cut' ? 'opacity-50' : ''}`}
                         >
                           <button 
                             onClick={(e) => toggleStar(file.id, e)}
                             className={`absolute top-2 left-2 p-1 rounded-full hover:bg-white/80 transition-colors z-20 ${file.isStarred ? 'text-amber-400 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}
                           >
                              <Star size={14} fill={file.isStarred ? "currentColor" : "none"} />
                           </button>

                           <div className="aspect-square bg-slate-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                             <FilePreview item={file} />
                             {selectedItems.includes(file.id) && (
                               <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-0.5 shadow-sm z-10">
                                 <CheckCircle size={12} />
                               </div>
                             )}
                           </div>
                           <div className="font-bold text-slate-700 text-sm truncate mt-auto">{file.name}</div>
                           <div className="flex justify-between items-center mt-1">
                             <span className="text-[10px] text-slate-400" dir="ltr">{file.size}</span>
                             <span className="text-[10px] text-slate-400">{file.date}</span>
                           </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                       <table className="w-full text-right text-sm">
                         <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                           <tr>
                             <th className="px-4 py-3 font-bold">نام</th>
                             <th className="px-4 py-3 font-bold">تاریخ</th>
                             <th className="px-4 py-3 font-bold">حجم</th>
                             <th className="px-4 py-3 font-bold">نوع</th>
                             <th className="px-4 py-3"></th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                           {files.map(file => (
                             <tr 
                               key={file.id}
                               onClick={(e) => {
                                 e.stopPropagation();
                                 if (e.metaKey || e.ctrlKey) {
                                   setSelectedItems(prev => prev.includes(file.id) ? prev.filter(id => id !== file.id) : [...prev, file.id]);
                                 } else {
                                   setSelectedItems([file.id]);
                                 }
                               }}
                               className={`cursor-pointer transition-colors ${selectedItems.includes(file.id) ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                             >
                               <td className="px-4 py-3 flex items-center gap-3">
                                 <button onClick={(e) => toggleStar(file.id, e)} className={`${file.isStarred ? 'text-amber-400' : 'text-slate-300 hover:text-slate-400'}`}>
                                    <Star size={16} fill={file.isStarred ? "currentColor" : "none"} />
                                 </button>
                                 <FileIcon type={file.type} className="w-5 h-5" />
                                 <span className="text-slate-900 font-medium">{file.name}</span>
                               </td>
                               <td className="px-4 py-3 text-slate-500">{file.date}</td>
                               <td className="px-4 py-3 text-slate-500" dir="ltr">{file.size}</td>
                               <td className="px-4 py-3 text-slate-500 capitalize">{file.type}</td>
                               <td className="px-4 py-3 text-left">
                                 <button className="p-1 hover:bg-slate-200 rounded text-slate-400">
                                   <MoreVertical size={16} />
                                 </button>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   )}
                 </div>
               )}
             </div>
           )}
        </div>
      </div>

      {/* --- Right Sidebar (Inspector) --- */}
      <AnimatePresence>
        {selectedItemDetails && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden"
          >
            <div className="w-[320px] h-full flex flex-col overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="font-bold text-slate-900">جزئیات</h3>
                <button onClick={() => setSelectedItems([])} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                {/* Preview */}
                <div className="aspect-square bg-slate-50 rounded-xl mb-6 flex items-center justify-center border border-slate-100 shadow-inner relative overflow-hidden group">
                  <FilePreview item={selectedItemDetails} />
                  
                  {/* Star Toggle in Inspector */}
                  <button 
                    onClick={(e) => toggleStar(selectedItemDetails.id, e)}
                    className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors z-20 ${selectedItemDetails.isStarred ? 'text-amber-400' : 'text-slate-300'}`}
                  >
                     <Star size={18} fill={selectedItemDetails.isStarred ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Basic Info */}
                <div className="mb-6">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">نام</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={selectedItemDetails.name}
                      onChange={(e) => handleRename(e.target.value)}
                      disabled={navSection === 'trash' || selectedItemDetails.isLocked}
                      className="w-full font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none py-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {navSection !== 'trash' && !selectedItemDetails.isLocked && <Edit3 size={14} className="text-slate-400" />}
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">نوع</span>
                    <span className="text-sm font-medium text-slate-900 capitalize">{selectedItemDetails.type}</span>
                  </div>
                  {selectedItemDetails.size && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">حجم</span>
                      <span className="text-sm font-medium text-slate-900" dir="ltr">{selectedItemDetails.size}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">تاریخ ایجاد</span>
                    <span className="text-sm font-medium text-slate-900">{selectedItemDetails.date}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">مسیر</span>
                    <span className="text-sm font-medium text-slate-900 truncate max-w-[150px] text-left" dir="ltr">
                      /{currentFolder?.name || 'Home'}/
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-8">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">برچسب‌ها</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedItemDetails.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
                        {tag}
                        {navSection !== 'trash' && !selectedItemDetails.isLocked && <button onClick={() => removeTag(selectedItemDetails.id, tag)} className="hover:text-red-500"><X size={10} /></button>}
                      </span>
                    ))}
                    {selectedItemDetails.tags.length === 0 && <span className="text-xs text-slate-400 italic">بدون برچسب</span>}
                  </div>
                  {navSection !== 'trash' && (
                    <form onSubmit={handleAddTag} className="relative">
                      <Tag size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="افزودن برچسب..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pr-8 pl-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </form>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  {navSection === 'trash' ? (
                     <>
                        <Button variant="outline" size="sm" className="w-full text-xs border-green-200 text-green-700 hover:bg-green-50" onClick={handleRestore}>
                           <RefreshCw size={14} className="ml-2" />
                           بازیابی
                        </Button>
                        <Button variant="outline" size="sm" className="w-full text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete}>
                           <Trash2 size={14} className="ml-2" />
                           حذف دائمی
                        </Button>
                     </>
                  ) : (
                     <>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                           <Download size={14} className="ml-2" />
                           دانلود
                        </Button>
                        <Button variant="outline" size="sm" className="w-full text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete} disabled={selectedItemDetails.isLocked}>
                           <Trash2 size={14} className="ml-2" />
                           حذف
                        </Button>
                        
                        {/* Custom Actions for Email Template */}
                        {selectedItemDetails.type === 'email-template' && selectedItemDetails.templateData ? (
                           <div className="col-span-2 grid grid-cols-2 gap-3 mt-1">
                              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => handleCopyCode(selectedItemDetails.templateData!)}>
                                 {showCodeCopied ? <Check size={14} className="ml-2 text-green-600" /> : <Code size={14} className="ml-2" />}
                                 {showCodeCopied ? 'کپی شد' : 'کپی کد HTML'}
                              </Button>
                              <Button fullWidth size="sm" className="text-xs shadow-none bg-blue-600 text-white hover:bg-blue-700 border-none" onClick={() => setPreviewItem(selectedItemDetails)}>
                                 <Eye size={14} className="ml-2" />
                                 پیش‌نمایش کامل
                              </Button>
                           </div>
                        ) : (
                           <Button fullWidth size="sm" className="col-span-2 text-xs shadow-none">
                              <Eye size={14} className="ml-2" />
                              پیش‌نمایش
                           </Button>
                        )}
                     </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Modals --- */}
      <AnimatePresence>
         {showCreateFolder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
               >
                  <h3 className="text-lg font-bold text-slate-900 mb-4">ایجاد پوشه جدید</h3>
                  <input 
                     autoFocus
                     type="text" 
                     placeholder="نام پوشه..." 
                     value={newFolderName}
                     onChange={(e) => setNewFolderName(e.target.value)}
                     className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 mb-4 outline-none transition-all text-slate-900"
                  />
                  <div className="mb-6">
                     <label className="text-xs font-bold text-slate-500 block mb-2">رنگ پوشه</label>
                     <div className="flex gap-2">
                        {FOLDER_COLORS.map(color => (
                           <button 
                              key={color.value}
                              onClick={() => setNewFolderColor(color.value)}
                              className={`w-8 h-8 rounded-full ${color.class} flex items-center justify-center transition-transform ${newFolderColor === color.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`}
                           >
                              {newFolderColor === color.value && <CheckCircle size={14} />}
                           </button>
                        ))}
                     </div>
                  </div>
                  <div className="flex gap-3">
                     <Button variant="ghost" fullWidth onClick={() => setShowCreateFolder(false)}>انصراف</Button>
                     <Button fullWidth onClick={handleCreateFolder}>ایجاد</Button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* --- Preview Modal --- */}
      <AnimatePresence>
        {previewItem && previewItem.templateData && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-slate-900/80 backdrop-blur-sm" onClick={() => setPreviewItem(null)}>
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white w-full max-w-4xl h-full max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
               onClick={(e) => e.stopPropagation()}
             >
                <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 bg-slate-50">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Eye size={18} className="text-blue-600" />
                      پیش‌نمایش: {previewItem.name}
                   </h3>
                   <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleCopyCode(previewItem.templateData!)}>
                         {showCodeCopied ? <Check size={16} /> : <Code size={16} />}
                         {showCodeCopied ? 'کپی شد' : 'کپی کد'}
                      </Button>
                      <button onClick={() => setPreviewItem(null)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                         <X size={20} className="text-slate-500" />
                      </button>
                   </div>
                </div>
                <div className="flex-1 bg-slate-100 relative">
                   <iframe 
                      srcDoc={generateHtmlFromBlocks(previewItem.templateData.blocks)}
                      className="w-full h-full border-none"
                      title="Full Preview"
                   />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

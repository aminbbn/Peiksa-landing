
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Sparkles, Code, Eye, Copy, RefreshCw, PenTool, Mail, Save, 
  FolderOpen, Trash2, X, Image as ImageIcon, Link as LinkIcon, 
  Check, Upload, GripVertical, Plus, Minus, Type, LayoutTemplate, 
  MousePointer2, Palette, AlignCenter, AlignRight, AlignLeft, AlignJustify,
  MoveUp, MoveDown, Settings, Globe, Sliders, BoxSelect, Sun, Droplet, Monitor, Grid,
  Maximize, Minimize, Crop, ArrowLeftRight, Square, Circle,
  Bold, Italic, Underline as UnderlineIcon, Highlighter, Layers
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

// --- Types ---

type BlockType = 'header' | 'text' | 'button' | 'image' | 'footer' | 'spacer';

interface EmailBlock {
  id: string;
  type: BlockType;
  content: any;
  styles: any;
}

interface SavedTemplate {
  id: string;
  name: string;
  blocks: EmailBlock[];
  date: string;
}

// --- Helpers ---

const hexToRgba = (hex: string, alpha: number) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// --- Custom Fonts Data ---
const CUSTOM_FONTS = [
  {
    name: 'Vazirmatn',
    label: 'وزیر متن (پیش‌فرض)',
    weights: {} // Loaded via Google Fonts
  },
  {
    name: 'Alibaba',
    label: 'علی‌بابا',
    weights: {
      300: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWkf5gVfoBlTIYdxai4rQEHcnsA2U9h6GjuS0O',
      400: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWZRqaQHFcPkY6GDrEfWdIMTjSs0Kpob9aQ1iX',
      700: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWgO3X5PspDO4ASPxof0THbtuFG2MZhqzaInkL',
      900: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWJ0C7t3fqam3lisx10HfzQyVevtoFgcOWrZ6h'
    }
  },
  {
    name: 'IranSansX',
    label: 'ایران سنس X',
    weights: {
      300: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWlXpawZELwJUzf2FbD8KRWXCtsdEMiuAgH46h',
      400: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWVbuU7CWM5zho2G1wWpDkVltmeUsidASavyZb',
      700: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWdXBm0zcYb9TX2i40Gw7yNtgknEQAPWJhYCO8',
      900: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWcJ1aqLoBVpdvf7Fh5uzkeqXcwij9AGrOJSNP'
    }
  },
  {
    name: 'IranYekanX',
    label: 'ایران یکان X',
    weights: {
      300: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWBGLtYsJKAFX4yvLPVJuZIR32w0NtCHDQUWn9',
      400: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWa2f79QpV7nKCWNQtX5A9MYsSFDeirbP10oRI',
      700: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWZRZhxYFcPkY6GDrEfWdIMTjSs0Kpob9aQ1iX',
      900: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWfs65mC8DY5ZCS1wzthlRpLQNXIym98rOcGAU'
    }
  },
  {
    name: 'Kalameh',
    label: 'کلمه',
    weights: {
      300: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWVT3sOoWM5zho2G1wWpDkVltmeUsidASavyZb',
      400: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCW29LkvUeny6Ogrl37EXKGYBT5h0IWMd2FZi8q',
      700: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWa2xFW0V7nKCWNQtX5A9MYsSFDeirbP10oRIw',
      900: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWVeJ0dbeWM5zho2G1wWpDkVltmeUsidASavyZ'
    }
  },
  {
    name: 'Morabba',
    label: 'مربع',
    weights: {
      300: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWjtbzDcv6CiBJP01qH5eQ2bfsWrEmvoOgzyuU',
      400: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWiclVLz0cJxTw0VOF6pMD4zCgrRudNkyf9Pet',
      700: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWxQohWCu4WLq4h6ZbegtSl8A7Xw2YKRnmpcVy',
      900: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWU7ab5DqXzDcqJVGl0CnyekP8EL1HwAjtImBs'
    }
  },
  {
    name: 'YekanBakh',
    label: 'یکان بخ',
    weights: {
      300: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCW9LVCq3lpBbjpnwL8W2sqZM5VekAc1RuxdJgy',
      400: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWQpSGduaDupy5oitI9YSWV8a6NAL0mXBzjlRH',
      700: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCW38IF3VLITClFo7fpPkWUuzGtn9BSM1EvXdHA',
      900: 'https://famjljl5gg.ufs.sh/f/aej4FOV7nKCWMRRD5XDyP1TFSZvyopzXDRIbfcB5tC9nrKWw'
    }
  },
];

const generateFontCss = () => {
  return CUSTOM_FONTS.filter(f => Object.keys(f.weights).length > 0).map(font => {
    return Object.entries(font.weights).map(([weight, url]) => `
      @font-face {
        font-family: '${font.name}';
        src: url('${url}') format('woff2');
        font-weight: ${weight};
        font-style: normal;
        font-display: swap;
      }
    `).join('');
  }).join('');
};

// --- Patterns (CSS Based) ---
const PATTERNS = [
  { 
    id: 'none', 
    name: 'ساده', 
    preview: { background: '#f8fafc' }, 
    css: 'background-color: #f8fafc;' 
  },
  { 
    id: 'grid', 
    name: 'گرید', 
    preview: { 
      backgroundColor: '#ffffff', 
      backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', 
      backgroundSize: '20px 20px' 
    },
    css: 'background-color: #ffffff; background-image: linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px); background-size: 20px 20px;'
  },
  { 
    id: 'dots', 
    name: 'نقطه‌ها', 
    preview: { 
      backgroundColor: '#ffffff', 
      backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', 
      backgroundSize: '12px 12px' 
    },
    css: 'background-color: #ffffff; background-image: radial-gradient(#cbd5e1 1.5px, transparent 1.5px); background-size: 12px 12px;'
  },
  { 
    id: 'diagonal', 
    name: 'مورب', 
    preview: { 
      backgroundColor: '#ffffff', 
      backgroundImage: 'repeating-linear-gradient(45deg, #f1f5f9 0px, #f1f5f9 10px, #ffffff 10px, #ffffff 20px)' 
    },
    css: 'background-color: #ffffff; background-image: repeating-linear-gradient(45deg, #f1f5f9 0px, #f1f5f9 10px, #ffffff 10px, #ffffff 20px);'
  },
  { 
    id: 'checker', 
    name: 'شطرنجی', 
    preview: { 
        backgroundColor: '#ffffff',
        backgroundImage: 'conic-gradient(#f1f5f9 90deg, transparent 90deg 180deg, #f1f5f9 180deg 270deg, transparent 270deg)',
        backgroundSize: '20px 20px'
    },
    css: 'background-color: #ffffff; background-image: conic-gradient(#f1f5f9 90deg, transparent 90deg 180deg, #f1f5f9 180deg 270deg, transparent 270deg); background-size: 20px 20px;'
  }
];

// --- Default Props for Blocks ---

const defaultBlocks: Record<BlockType, Omit<EmailBlock, 'id'>> = {
  header: {
    type: 'header',
    content: { 
      logoUrl: 'https://via.placeholder.com/150x50?text=LOGO', 
      patternId: 'none',
      alt: 'Logo', 
      link: '#',
      sourceType: 'url', // 'url' | 'upload' | 'pattern'
    },
    styles: { 
      backgroundColor: '#ffffff', 
      padding: '20px', 
      align: 'center',
      objectFit: 'contain', 
      width: '200px',
      height: 'auto',
      filter: {
        brightness: 100,
        contrast: 100,
        saturate: 100,
      },
      dropShadow: {
        enabled: false,
        color: '#000000',
        blur: 5,
        x: 0,
        y: 4,
        opacity: 0.3
      }
    }
  },
  text: {
    type: 'text',
    content: { 
      text: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.', 
      link: '' 
    },
    styles: { 
      backgroundColor: '#ffffff', 
      color: '#1e293b', 
      fontSize: '16', // px
      fontWeight: '400',
      fontFamily: 'Vazirmatn',
      align: 'right', 
      padding: '24px',
      lineHeight: '1.6',
      fontStyle: 'normal',
      textDecoration: 'none',
      dropShadow: {
        enabled: false,
        color: '#000000',
        blur: 2,
        x: 1,
        y: 1,
        opacity: 0.2
      },
      stroke: {
        enabled: false,
        color: '#000000',
        width: 1
      }
    }
  },
  button: {
    type: 'button',
    content: { text: 'کلیک کنید', link: '#' },
    styles: { backgroundColor: '#ffffff', buttonColor: '#2563eb', textColor: '#ffffff', align: 'center', padding: '20px', borderRadius: '8px' }
  },
  image: {
    type: 'image',
    content: { imageUrl: 'https://via.placeholder.com/600x200', alt: 'Image', link: '#' },
    styles: { padding: '20px', backgroundColor: '#ffffff' }
  },
  footer: {
    type: 'footer',
    content: { text: '© ۱۴۰۳ تمامی حقوق محفوظ است.', unsubscribeText: 'لغو اشتراک', unsubscribeLink: '#', link: '' },
    styles: { backgroundColor: '#f1f5f9', color: '#64748b', padding: '32px' }
  },
  spacer: {
    type: 'spacer',
    content: { link: '' },
    styles: { height: '32px', backgroundColor: 'transparent' }
  }
};

// --- HTML Generator Helper ---

const generateHtmlFromBlocks = (blocks: EmailBlock[]) => {
  const fontCss = generateFontCss();
  
  const bodyContent = blocks.map(block => {
    const { type, content, styles } = block;
    
    switch (type) {
      case 'header':
        // Build Filter String
        let filterString = `brightness(${styles.filter?.brightness || 100}%) contrast(${styles.filter?.contrast || 100}%) saturate(${styles.filter?.saturate || 100}%)`;
        if (styles.dropShadow?.enabled) {
          const shadowColor = hexToRgba(styles.dropShadow.color, styles.dropShadow.opacity ?? 1);
          filterString += ` drop-shadow(${styles.dropShadow.x}px ${styles.dropShadow.y}px ${styles.dropShadow.blur}px ${shadowColor})`;
        }

        // Handle Pattern vs Image
        const headerInner = content.sourceType === 'pattern' ? `
           <div style="
             width: ${styles.width || '100%'}; 
             height: ${styles.height === 'auto' ? '150px' : styles.height}; 
             display: inline-block;
             border-radius: 8px;
             ${PATTERNS.find(p => p.id === content.patternId)?.css || ''}
             filter: ${filterString};
             -webkit-filter: ${filterString};
           "></div>` : `
           <img src="${content.logoUrl}" alt="${content.alt}" 
             style="
               width: ${styles.width || '200px'}; 
               height: ${styles.height || 'auto'}; 
               object-fit: ${styles.objectFit || 'contain'};
               display: inline-block; 
               border: 0;
               filter: ${filterString};
               -webkit-filter: ${filterString};
             " 
           />`;

        // Always wrap header in link if provided
        const headerContent = content.link ? `<a href="${content.link}" target="_blank" style="text-decoration: none; display: inline-block; width: ${styles.width === '100%' ? '100%' : 'auto'};">${headerInner}</a>` : headerInner;

        return `
          <div style="background-color: ${styles.backgroundColor}; padding: ${styles.padding}; text-align: ${styles.align};">
            ${headerContent}
          </div>`;

      case 'text':
        let textShadow = '';
        if (styles.dropShadow?.enabled) {
          const shadowColor = hexToRgba(styles.dropShadow.color, styles.dropShadow.opacity ?? 1);
          textShadow = `text-shadow: ${styles.dropShadow.x}px ${styles.dropShadow.y}px ${styles.dropShadow.blur}px ${shadowColor};`;
        }

        let textStroke = '';
        if (styles.stroke?.enabled) {
          textStroke = `-webkit-text-stroke: ${styles.stroke.width}px ${styles.stroke.color};`;
        }

        const textStyle = `
          margin: 0;
          color: ${styles.color};
          font-size: ${styles.fontSize}px;
          font-weight: ${styles.fontWeight};
          font-family: '${styles.fontFamily}', sans-serif;
          line-height: ${styles.lineHeight};
          font-style: ${styles.fontStyle};
          text-decoration: ${styles.textDecoration};
          text-align: ${styles.align};
          white-space: pre-line;
          ${textShadow}
          ${textStroke}
        `;
        const textInner = `<div style="${textStyle}">${content.text}</div>`;
        return `
          <div style="background-color: ${styles.backgroundColor}; padding: ${styles.padding}; direction: rtl;">
            ${content.link ? `<a href="${content.link}" style="text-decoration: none; display: block; color: inherit;">${textInner}</a>` : textInner}
          </div>`;

      case 'button':
        return `
          <div style="background-color: ${styles.backgroundColor}; padding: ${styles.padding}; text-align: ${styles.align};">
            <a href="${content.link}" style="display: inline-block; background-color: ${styles.buttonColor}; color: ${styles.textColor}; padding: 12px 32px; text-decoration: none; border-radius: ${styles.borderRadius}; font-weight: bold; font-family: 'Vazirmatn', sans-serif;">
              ${content.text}
            </a>
          </div>`;

      case 'image':
        return `
          <div style="background-color: ${styles.backgroundColor}; padding: ${styles.padding}; text-align: center;">
            <a href="${content.link}" target="_blank" style="display: block;">
              <img src="${content.imageUrl}" alt="${content.alt}" style="max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 8px;" />
            </a>
          </div>`;

      case 'footer':
        const footerText = `<p style="margin: 0 0 12px 0; color: ${styles.color}; font-size: 14px; font-family: 'Vazirmatn', sans-serif;">${content.text}</p>`;
        return `
          <div style="background-color: ${styles.backgroundColor}; padding: ${styles.padding}; text-align: center; direction: rtl;">
            ${content.link ? `<a href="${content.link}" style="text-decoration: none; display: block; color: inherit;">${footerText}</a>` : footerText}
            <a href="${content.unsubscribeLink}" style="color: ${styles.color}; text-decoration: underline; font-size: 12px; font-family: 'Vazirmatn', sans-serif;">${content.unsubscribeText}</a>
          </div>`;

      case 'spacer':
        const spacerInner = `<div style="height: ${styles.height}; background-color: ${styles.backgroundColor};"></div>`;
        return content.link ? `<a href="${content.link}" style="display: block; text-decoration: none;">${spacerInner}</a>` : spacerInner;

      default:
        return '';
    }
  }).join('');

  return `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;700;900&display=swap" rel="stylesheet">
<style>
  ${fontCss}
  body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Vazirmatn', sans-serif; }
  * { box-sizing: border-box; }
  .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; overflow: hidden; }
  a { text-decoration: none; }
</style>
</head>
<body>
  <div class="email-container">
    ${bodyContent}
  </div>
</body>
</html>`;
};


export const DashboardEmailBuilder: React.FC = () => {
  // --- State ---
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'design' | 'code'>('design');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);

  // Drag and Drop State
  const dragItem = useRef<BlockType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    const saved = localStorage.getItem('peiksa_email_templates');
    if (saved) setSavedTemplates(JSON.parse(saved));
  }, []);

  // --- Handlers ---

  const addBlock = (type: BlockType, index?: number) => {
    const newBlock: EmailBlock = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...JSON.parse(JSON.stringify(defaultBlocks[type])) // Deep copy
    };

    if (index !== undefined) {
      const newBlocks = [...blocks];
      newBlocks.splice(index, 0, newBlock);
      setBlocks(newBlocks);
    } else {
      setBlocks([...blocks, newBlock]);
    }
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<EmailBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const updateBlockContent = (id: string, field: string, value: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: { ...b.content, [field]: value } } : b));
  };

  const updateBlockStyle = (id: string, field: string, value: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, styles: { ...b.styles, [field]: value } } : b));
  };

  const updateBlockNestedStyle = (id: string, category: string, field: string, value: any) => {
    setBlocks(blocks.map(b => 
      b.id === id ? { 
        ...b, 
        styles: { 
          ...b.styles, 
          [category]: { ...b.styles[category], [field]: value } 
        } 
      } : b
    ));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if (index < 0) return;
    if (direction === 'up' && index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      setBlocks(newBlocks);
    } else if (direction === 'down' && index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
      setBlocks(newBlocks);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedBlockId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
           updateBlockContent(selectedBlockId, 'logoUrl', event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSourceTypeChange = (type: string) => {
    if (!selectedBlock) return;
    
    // Create new styles object to avoid mutation
    const newStyles = { ...selectedBlock.styles };
    const newContent = { ...selectedBlock.content, sourceType: type };

    if (type === 'pattern') {
      // Auto-configure for full-width pattern
      newStyles.width = '100%';
      newStyles.height = '150px';
      newStyles.padding = '0px'; // Remove padding to fill section
      newStyles.objectFit = 'cover';
    } else if (type === 'url' || type === 'upload') {
      // Restore logo defaults if values match pattern defaults
      if (newStyles.width === '100%') newStyles.width = '200px';
      if (newStyles.height === '150px') newStyles.height = 'auto';
      if (newStyles.padding === '0px') newStyles.padding = '20px';
      newStyles.objectFit = 'contain';
    }

    updateBlock(selectedBlock.id, {
      content: newContent,
      styles: newStyles
    });
  };

  const handleDisplayModeChange = (mode: 'contain' | 'cover' | 'fill') => {
    if (!selectedBlock) return;
    const newStyles = { ...selectedBlock.styles, objectFit: mode };
    
    // Auto-adjust dimensions for better UX based on mode
    if (mode === 'fill' || mode === 'cover') { // Stretch or Fill
        newStyles.width = '100%';
        if (newStyles.height === 'auto') newStyles.height = '200px';
        newStyles.padding = '0px';
    } else { // Fit
        newStyles.width = '200px';
        newStyles.height = 'auto';
        newStyles.padding = '20px';
    }
    
    updateBlock(selectedBlock.id, { styles: newStyles });
  };

  const handleGenerateAi = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Structured JSON Prompt
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create an email template for: "${aiPrompt}".
        
        Return a JSON OBJECT with a key "blocks". The value must be an array of objects matching this structure:
        { "type": "header" | "text" | "button" | "image" | "footer", "content": { ... }, "styles": { ... } }

        Content fields per type:
        - header: { logoUrl, alt, link }
        - text: { text, link }
        - button: { text, link }
        - image: { imageUrl, alt, link }
        - footer: { text, unsubscribeText, unsubscribeLink }

        Style fields (optional but recommended): backgroundColor, color, align (right/center/left), padding.

        IMPORTANT:
        - Use Persian language for text.
        - Ensure "text" blocks are aligned "right" (RTL).
        
        Return ONLY valid JSON.`,
        config: { responseMimeType: "application/json" }
      });

      const json = JSON.parse(response.text || '{}');
      if (json.blocks && Array.isArray(json.blocks)) {
        // Add IDs to blocks
        const newBlocks = json.blocks.map((b: any) => ({
          ...b,
          id: Date.now().toString() + Math.random().toString(),
          // Merge with default styles to ensure nothing breaks
          styles: { ...defaultBlocks[b.type as BlockType]?.styles, ...b.styles }
        }));
        setBlocks(newBlocks);
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("خطا در تولید هوشمند.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const saveTemplate = () => {
    if (!templateName) return;
    const newTemplate: SavedTemplate = {
      id: Date.now().toString(),
      name: templateName,
      blocks: blocks,
      date: new Date().toLocaleDateString('fa-IR')
    };
    const updated = [newTemplate, ...savedTemplates];
    setSavedTemplates(updated);
    localStorage.setItem('peiksa_email_templates', JSON.stringify(updated));
    setShowSaveModal(false);
    setTemplateName('');
  };

  const loadTemplate = (template: SavedTemplate) => {
    setBlocks(template.blocks);
    setShowLoadModal(false);
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // --- HTML for Code View ---
  const rawHtml = generateHtmlFromBlocks(blocks);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
      
      {/* Inject Custom Fonts for Preview (Design View) */}
      <style>{generateFontCss()}</style>

      {/* --- Top Bar --- */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
               <PenTool size={18} />
             </div>
             <h1 className="text-lg font-bold text-slate-900">ایمیل ساز</h1>
           </div>
           
           <div className="h-6 w-px bg-slate-200 mx-2"></div>

           <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
               onClick={() => setActiveTab('design')}
               className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${activeTab === 'design' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <LayoutTemplate size={14} />
               طراحی بصری
             </button>
             <button 
               onClick={() => setActiveTab('code')}
               className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${activeTab === 'code' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <Code size={14} />
               کد خروجی
             </button>
           </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowLoadModal(true)}>
            <FolderOpen size={16} className="mr-2" />
            قالب‌ها
          </Button>
          <Button size="sm" onClick={() => setShowSaveModal(true)} disabled={blocks.length === 0} className="bg-green-600 hover:bg-green-700 border-none">
            <Save size={16} className="mr-2" />
            ذخیره
          </Button>
        </div>
      </div>

      {/* --- Main Workspace --- */}
      <div className="flex-1 min-h-0 flex gap-4 overflow-hidden">
        
        {/* --- Left: Properties Panel (Contextual) --- */}
        <AnimatePresence mode="wait">
          {selectedBlock ? (
             <motion.div 
               key="properties"
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: 320, opacity: 1 }}
               exit={{ width: 0, opacity: 0 }}
               className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden"
             >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                   <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <Settings size={16} />
                      تنظیمات بلوک
                   </h3>
                   <button onClick={() => setSelectedBlockId(null)}><X size={16} className="text-slate-400" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                   
                   {/* HEADER SPECIFIC SETTINGS */}
                   {selectedBlock.type === 'header' && (
                     <>
                      {/* Image Source Selection */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">منبع تصویر</div>
                        <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
                           {['url', 'upload', 'pattern'].map((type) => (
                             <button
                               key={type}
                               onClick={() => handleSourceTypeChange(type)}
                               className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${selectedBlock.content.sourceType === type ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                             >
                               {type === 'url' ? 'لینک' : type === 'upload' ? 'آپلود' : 'پترن'}
                             </button>
                           ))}
                        </div>

                        {selectedBlock.content.sourceType === 'url' && (
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1 block">آدرس تصویر</label>
                            <div className="flex gap-2">
                               <input 
                                 type="text" dir="ltr"
                                 value={selectedBlock.content.logoUrl}
                                 onChange={(e) => updateBlockContent(selectedBlock.id, 'logoUrl', e.target.value)}
                                 className="flex-1 p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white text-slate-900"
                               />
                               <button className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                 <Upload size={16} onClick={() => fileInputRef.current?.click()} />
                               </button>
                            </div>
                          </div>
                        )}

                        {selectedBlock.content.sourceType === 'upload' && (
                          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                             <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                             <p className="text-xs text-slate-500">برای آپلود کلیک کنید</p>
                             <input 
                               ref={fileInputRef}
                               type="file" 
                               accept="image/*" 
                               className="hidden" 
                               onChange={handleFileUpload}
                             />
                          </div>
                        )}

                        {selectedBlock.content.sourceType === 'pattern' && (
                          <div className="grid grid-cols-2 gap-2">
                            {PATTERNS.map((pat) => (
                              <button 
                                key={pat.id}
                                onClick={() => updateBlockContent(selectedBlock.id, 'patternId', pat.id)}
                                className={`h-16 rounded-lg border-2 overflow-hidden relative transition-all ${selectedBlock.content.patternId === pat.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-100 hover:border-slate-300'}`}
                                style={pat.preview}
                              >
                                <span className="absolute bottom-0 left-0 right-0 bg-white/80 text-[9px] text-center py-0.5 text-slate-600 font-bold backdrop-blur-sm">
                                  {pat.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {/* Link Input for Header */}
                        <div className="mt-2">
                           <label className="text-xs font-bold text-slate-700 mb-1 block">لینک مقصد (اختیاری)</label>
                           <input 
                             type="text" dir="ltr"
                             value={selectedBlock.content.link}
                             onChange={(e) => updateBlockContent(selectedBlock.id, 'link', e.target.value)}
                             className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white text-left text-slate-900"
                             placeholder="https://"
                           />
                        </div>
                      </div>

                      <div className="h-px bg-slate-100 my-4"></div>

                      {/* Drop Shadow for Header */}
                      <div className="space-y-3">
                         <div className="flex items-center justify-between">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">سایه (PNG)</div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={selectedBlock.styles.dropShadow?.enabled || false}
                                onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'enabled', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                         </div>

                         {selectedBlock.styles.dropShadow?.enabled && (
                           <div className="bg-slate-50 p-3 rounded-xl space-y-3">
                              {/* Reuse Header Shadow Controls */}
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-lg border border-slate-200 overflow-hidden shrink-0">
                                   <input 
                                     type="color" 
                                     value={selectedBlock.styles.dropShadow?.color || '#000000'}
                                     onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'color', e.target.value)}
                                     className="w-full h-full p-0 border-none cursor-pointer scale-150"
                                   />
                                 </div>
                                 <div className="flex-1 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-600">محوی (Blur)</label>
                                    <input 
                                      type="range" min="0" max="20" 
                                      value={selectedBlock.styles.dropShadow?.blur || 0}
                                      onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'blur', e.target.value)}
                                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                                    />
                                 </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                 <div>
                                    <label className="text-[10px] font-bold text-slate-600 block mb-1">افقی X</label>
                                    <input 
                                      type="number" 
                                      value={selectedBlock.styles.dropShadow?.x || 0}
                                      onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'x', e.target.value)}
                                      className="w-full p-1 text-center text-xs border border-slate-200 rounded bg-white text-slate-900"
                                    />
                                 </div>
                                 <div>
                                    <label className="text-[10px] font-bold text-slate-600 block mb-1">عمودی Y</label>
                                    <input 
                                      type="number" 
                                      value={selectedBlock.styles.dropShadow?.y || 0}
                                      onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'y', e.target.value)}
                                      className="w-full p-1 text-center text-xs border border-slate-200 rounded bg-white text-slate-900"
                                    />
                                 </div>
                              </div>
                              <div>
                                 <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-bold text-slate-600 block">شفافیت (Opacity)</label>
                                    <span className="text-[10px] text-slate-400">{Math.round((selectedBlock.styles.dropShadow?.opacity ?? 0.3) * 100)}%</span>
                                 </div>
                                 <input 
                                   type="range" min="0" max="1" step="0.01"
                                   value={selectedBlock.styles.dropShadow?.opacity ?? 0.3}
                                   onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'opacity', parseFloat(e.target.value))}
                                   className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                                 />
                              </div>
                           </div>
                         )}
                      </div>
                     </>
                   )}
                   {/* END HEADER SETTINGS */}


                   {/* COMMON CONTENT FIELDS (Non-Header) */}
                   {selectedBlock.type !== 'header' && (
                     <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">محتوا</div>
                        
                        {selectedBlock.type === 'text' && (
                          <div className="space-y-3">
                             <div>
                               <label className="text-xs font-bold text-slate-700 mb-1 block">متن</label>
                               <textarea 
                                 value={selectedBlock.content.text}
                                 onChange={(e) => updateBlockContent(selectedBlock.id, 'text', e.target.value)}
                                 rows={5}
                                 className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white text-slate-900 resize-none"
                                 placeholder="متن خود را اینجا بنویسید..."
                               />
                             </div>
                             
                             {/* TEXT SPECIFIC STYLES */}
                             <div className="pt-2 border-t border-slate-100">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">تایپوگرافی</label>
                                
                                <div className="space-y-3">
                                   <div className="grid grid-cols-2 gap-2">
                                      <div>
                                         <label className="text-[10px] font-bold text-slate-600 block mb-1">فونت</label>
                                         <select 
                                           value={selectedBlock.styles.fontFamily}
                                           onChange={(e) => updateBlockStyle(selectedBlock.id, 'fontFamily', e.target.value)}
                                           className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white text-slate-900"
                                         >
                                            {CUSTOM_FONTS.map(font => (
                                              <option key={font.name} value={font.name}>{font.label}</option>
                                            ))}
                                         </select>
                                      </div>
                                      <div>
                                         <label className="text-[10px] font-bold text-slate-600 block mb-1">سایز (px)</label>
                                         <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden relative">
                                            <button 
                                                onClick={() => updateBlockStyle(selectedBlock.id, 'fontSize', Math.max(8, parseInt(selectedBlock.styles.fontSize) - 1))}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors border-l border-slate-100"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <input 
                                                type="text" 
                                                dir="ltr"
                                                value={selectedBlock.styles.fontSize}
                                                onChange={(e) => updateBlockStyle(selectedBlock.id, 'fontSize', e.target.value.replace(/[^0-9]/g, ''))}
                                                className="flex-1 w-full h-8 text-xs text-center border-none focus:ring-0 text-slate-900 font-medium"
                                            />
                                            <button 
                                                onClick={() => updateBlockStyle(selectedBlock.id, 'fontSize', parseInt(selectedBlock.styles.fontSize) + 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors border-r border-slate-100"
                                            >
                                                <Plus size={14} />
                                            </button>
                                         </div>
                                      </div>
                                   </div>

                                   <div className="flex gap-2">
                                      <div className="flex-1">
                                         <label className="text-[10px] font-bold text-slate-600 block mb-1">وزن</label>
                                         <select 
                                           value={selectedBlock.styles.fontWeight}
                                           onChange={(e) => updateBlockStyle(selectedBlock.id, 'fontWeight', e.target.value)}
                                           className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white text-slate-900"
                                         >
                                            <option value="300">نازک (Light)</option>
                                            <option value="400">عادی (Normal)</option>
                                            <option value="700">ضخیم (Bold)</option>
                                            <option value="900">خیلی ضخیم (Heavy)</option>
                                         </select>
                                      </div>
                                      <div className="flex-1">
                                         <label className="text-[10px] font-bold text-slate-600 block mb-1">ارتفاع خط</label>
                                         <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden relative">
                                            <button 
                                                onClick={() => updateBlockStyle(selectedBlock.id, 'lineHeight', (parseFloat(selectedBlock.styles.lineHeight) - 0.1).toFixed(1))}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors border-l border-slate-100"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <input 
                                                type="text" 
                                                dir="ltr"
                                                value={selectedBlock.styles.lineHeight}
                                                onChange={(e) => updateBlockStyle(selectedBlock.id, 'lineHeight', e.target.value)}
                                                className="flex-1 w-full h-8 text-xs text-center border-none focus:ring-0 text-slate-900 font-medium"
                                            />
                                            <button 
                                                onClick={() => updateBlockStyle(selectedBlock.id, 'lineHeight', (parseFloat(selectedBlock.styles.lineHeight) + 0.1).toFixed(1))}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors border-r border-slate-100"
                                            >
                                                <Plus size={14} />
                                            </button>
                                         </div>
                                      </div>
                                   </div>

                                   <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                                      <button 
                                        onClick={() => updateBlockStyle(selectedBlock.id, 'fontWeight', selectedBlock.styles.fontWeight === '700' ? '400' : '700')}
                                        className={`flex-1 py-1.5 rounded flex items-center justify-center transition-all ${selectedBlock.styles.fontWeight === '700' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                                        title="Bold"
                                      >
                                         <Bold size={14} />
                                      </button>
                                      <button 
                                        onClick={() => updateBlockStyle(selectedBlock.id, 'fontStyle', selectedBlock.styles.fontStyle === 'italic' ? 'normal' : 'italic')}
                                        className={`flex-1 py-1.5 rounded flex items-center justify-center transition-all ${selectedBlock.styles.fontStyle === 'italic' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                                        title="Italic"
                                      >
                                         <Italic size={14} />
                                      </button>
                                      <button 
                                        onClick={() => updateBlockStyle(selectedBlock.id, 'textDecoration', selectedBlock.styles.textDecoration === 'underline' ? 'none' : 'underline')}
                                        className={`flex-1 py-1.5 rounded flex items-center justify-center transition-all ${selectedBlock.styles.textDecoration === 'underline' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                                        title="Underline"
                                      >
                                         <UnderlineIcon size={14} />
                                      </button>
                                   </div>
                                </div>
                             </div>

                             {/* TEXT SHADOW & STROKE */}
                             <div className="space-y-4 pt-4 border-t border-slate-100">
                                {/* Stroke */}
                                <div className="space-y-2">
                                   <div className="flex items-center justify-between">
                                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <Highlighter size={12} />
                                        استروک (Stroke)
                                      </div>
                                      <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={selectedBlock.styles.stroke?.enabled || false}
                                          onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'stroke', 'enabled', e.target.checked)}
                                          className="sr-only peer"
                                        />
                                        <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                                      </label>
                                   </div>
                                   {selectedBlock.styles.stroke?.enabled && (
                                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                         <div className="w-6 h-6 rounded border border-slate-200 overflow-hidden shrink-0">
                                            <input 
                                              type="color" 
                                              value={selectedBlock.styles.stroke?.color || '#000000'}
                                              onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'stroke', 'color', e.target.value)}
                                              className="w-full h-full p-0 border-none cursor-pointer scale-150"
                                            />
                                         </div>
                                         <div className="flex-1 flex items-center gap-2">
                                            <span className="text-[10px] text-slate-500">ضخامت:</span>
                                            <input 
                                              type="range" min="0.5" max="5" step="0.5"
                                              value={selectedBlock.styles.stroke?.width || 1}
                                              onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'stroke', 'width', parseFloat(e.target.value))}
                                              className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                            <span className="text-[10px] text-slate-500 w-4 text-center">{selectedBlock.styles.stroke?.width || 1}</span>
                                         </div>
                                      </div>
                                   )}
                                </div>

                                {/* Drop Shadow */}
                                <div className="space-y-3">
                                   <div className="flex items-center justify-between">
                                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <Layers size={12} />
                                        سایه متن
                                      </div>
                                      <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={selectedBlock.styles.dropShadow?.enabled || false}
                                          onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'enabled', e.target.checked)}
                                          className="sr-only peer"
                                        />
                                        <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                                      </label>
                                   </div>

                                   {selectedBlock.styles.dropShadow?.enabled && (
                                     <div className="bg-slate-50 p-3 rounded-xl space-y-3">
                                        <div className="flex items-center gap-2">
                                           <div className="w-8 h-8 rounded-lg border border-slate-200 overflow-hidden shrink-0">
                                             <input 
                                               type="color" 
                                               value={selectedBlock.styles.dropShadow?.color || '#000000'}
                                               onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'color', e.target.value)}
                                               className="w-full h-full p-0 border-none cursor-pointer scale-150"
                                             />
                                           </div>
                                           <div className="flex-1 space-y-1">
                                              <label className="text-[10px] font-bold text-slate-600">محوی (Blur)</label>
                                              <input 
                                                type="range" min="0" max="20" 
                                                value={selectedBlock.styles.dropShadow?.blur || 0}
                                                onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'blur', e.target.value)}
                                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                                              />
                                           </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                           <div>
                                              <label className="text-[10px] font-bold text-slate-600 block mb-1">افقی X</label>
                                              <input 
                                                type="number" 
                                                value={selectedBlock.styles.dropShadow?.x || 0}
                                                onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'x', e.target.value)}
                                                className="w-full p-1 text-center text-xs border border-slate-200 rounded bg-white text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                              />
                                           </div>
                                           <div>
                                              <label className="text-[10px] font-bold text-slate-600 block mb-1">عمودی Y</label>
                                              <input 
                                                type="number" 
                                                value={selectedBlock.styles.dropShadow?.y || 0}
                                                onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'y', e.target.value)}
                                                className="w-full p-1 text-center text-xs border border-slate-200 rounded bg-white text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                              />
                                           </div>
                                        </div>
                                        <div>
                                           <div className="flex justify-between items-center mb-1">
                                              <label className="text-[10px] font-bold text-slate-600 block">شفافیت (Opacity)</label>
                                              <span className="text-[10px] text-slate-400">{Math.round((selectedBlock.styles.dropShadow?.opacity ?? 0.3) * 100)}%</span>
                                           </div>
                                           <input 
                                             type="range" min="0" max="1" step="0.01"
                                             value={selectedBlock.styles.dropShadow?.opacity ?? 0.3}
                                             onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'opacity', parseFloat(e.target.value))}
                                             className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                                           />
                                        </div>
                                     </div>
                                   )}
                                </div>
                             </div>
                          </div>
                        )}

                        {(selectedBlock.type === 'image') && (
                          <>
                             <div>
                               <label className="text-xs font-bold text-slate-700 mb-1 block">آدرس تصویر</label>
                               <input 
                                 type="text" dir="ltr"
                                 value={selectedBlock.content.imageUrl}
                                 onChange={(e) => updateBlockContent(selectedBlock.id, 'imageUrl', e.target.value)}
                                 className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white text-left text-slate-900"
                               />
                             </div>
                          </>
                        )}

                        {selectedBlock.type === 'button' && (
                          <>
                             <div>
                               <label className="text-xs font-bold text-slate-700 mb-1 block">متن دکمه</label>
                               <input 
                                 type="text" 
                                 value={selectedBlock.content.text}
                                 onChange={(e) => updateBlockContent(selectedBlock.id, 'text', e.target.value)}
                                 className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white text-slate-900"
                               />
                             </div>
                          </>
                        )}

                        {/* General Link Field for All Non-Header Blocks */}
                        <div>
                           <label className="text-xs font-bold text-slate-700 mb-1 block">
                             {selectedBlock.type === 'footer' ? 'لینک عمومی (اختیاری)' : 'لینک مقصد'}
                           </label>
                           <input 
                             type="text" dir="ltr"
                             value={selectedBlock.content.link}
                             onChange={(e) => updateBlockContent(selectedBlock.id, 'link', e.target.value)}
                             className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white text-left text-slate-900"
                             placeholder="https://"
                           />
                        </div>
                     </div>
                   )}

                   {/* COMMON STYLE FIELDS */}
                   <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ظاهر</div>
                      
                      <div className="grid grid-cols-2 gap-2">
                         <div>
                            <label className="text-xs font-bold text-slate-700 mb-1 block">پس‌زمینه</label>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                               <input 
                                 type="color" 
                                 value={selectedBlock.styles.backgroundColor}
                                 onChange={(e) => updateBlockStyle(selectedBlock.id, 'backgroundColor', e.target.value)}
                                 className="w-6 h-6 rounded cursor-pointer border-none p-0"
                               />
                               <span className="text-[10px] text-slate-500 font-mono" dir="ltr">{selectedBlock.styles.backgroundColor}</span>
                            </div>
                         </div>
                         {selectedBlock.styles.color && (
                           <div>
                              <label className="text-xs font-bold text-slate-700 mb-1 block">رنگ متن</label>
                              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                                 <input 
                                   type="color" 
                                   value={selectedBlock.styles.color}
                                   onChange={(e) => updateBlockStyle(selectedBlock.id, 'color', e.target.value)}
                                   className="w-6 h-6 rounded cursor-pointer border-none p-0"
                                 />
                              </div>
                           </div>
                         )}
                      </div>

                      {selectedBlock.styles.align && (
                        <div>
                           <label className="text-xs font-bold text-slate-700 mb-1 block">چیدمان</label>
                           <div className="flex bg-slate-100 p-1 rounded-lg">
                              {['right', 'center', 'left', 'justify'].map(align => (
                                 <button
                                   key={align}
                                   onClick={() => updateBlockStyle(selectedBlock.id, 'align', align)}
                                   className={`flex-1 py-1 rounded flex items-center justify-center transition-all ${selectedBlock.styles.align === align ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
                                 >
                                    {align === 'right' ? <AlignRight size={16} /> : 
                                     align === 'center' ? <AlignCenter size={16} /> : 
                                     align === 'left' ? <AlignLeft size={16} /> : <AlignJustify size={16} />}
                                 </button>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50">
                   <button 
                     onClick={() => removeBlock(selectedBlock.id)}
                     className="w-full flex items-center justify-center gap-2 text-red-600 bg-white border border-red-100 hover:bg-red-50 py-2 rounded-lg text-xs font-bold transition-colors"
                   >
                      <Trash2 size={14} />
                      حذف این بلوک
                   </button>
                </div>
             </motion.div>
          ) : (
             <motion.div 
               key="ai-panel"
               initial={{ width: 320, opacity: 1 }}
               exit={{ width: 0, opacity: 0 }}
               className="w-80 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden"
             >
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                   <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <Sparkles size={16} className="text-purple-600" />
                      تولید هوشمند (AI)
                   </h3>
                </div>
                <div className="p-4 flex-1">
                   <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      هوش مصنوعی ساختار ایمیل شما را با استفاده از کامپوننت‌های موجود می‌سازد. سپس می‌توانید هر بخش را ویرایش کنید.
                   </p>
                   <textarea
                     value={aiPrompt}
                     onChange={(e) => setAiPrompt(e.target.value)}
                     placeholder="مثال: ایمیل خوش‌آمدگویی برای فروشگاه لباس با کد تخفیف..."
                     className="w-full h-32 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500/20 resize-none mb-4 text-slate-900"
                   />
                   <Button 
                     fullWidth 
                     onClick={handleGenerateAi} 
                     disabled={isAiLoading || !aiPrompt}
                     className="bg-purple-600 hover:bg-purple-700 border-none"
                   >
                      {isAiLoading ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <>
                          <Sparkles size={16} className="mr-2" />
                          تولید قالب
                        </>
                      )}
                   </Button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* --- Center: Canvas --- */}
        <div className="flex-1 bg-slate-100 rounded-xl overflow-hidden shadow-inner relative flex flex-col">
           {activeTab === 'code' ? (
              <div className="flex-1 overflow-auto bg-[#1e1e1e] p-6 text-slate-300 font-mono text-xs leading-relaxed" dir="ltr">
                 <pre>{rawHtml}</pre>
              </div>
           ) : (
              <div 
                className="flex-1 overflow-y-auto p-8 flex justify-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragItem.current) {
                    addBlock(dragItem.current);
                    dragItem.current = null;
                  }
                }}
              >
                 <div className="w-full max-w-[600px] min-h-[500px] bg-white shadow-2xl shadow-slate-300/50 flex flex-col" style={{ direction: 'rtl' }}>
                    {blocks.length === 0 ? (
                       <div className="flex-1 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 m-4 rounded-xl">
                          <MousePointer2 size={48} className="mb-4 opacity-50" />
                          <p className="text-sm font-bold">المان‌ها را اینجا رها کنید</p>
                          <p className="text-xs mt-2">یا از هوش مصنوعی کمک بگیرید</p>
                       </div>
                    ) : (
                       <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="flex flex-col h-full">
                          {blocks.map((block) => (
                             <Reorder.Item key={block.id} value={block}>
                                <div 
                                  onClick={() => setSelectedBlockId(block.id)}
                                  className={`relative group cursor-pointer transition-all ${selectedBlockId === block.id ? 'ring-2 ring-blue-500 z-10' : 'hover:ring-1 hover:ring-blue-300'}`}
                                >
                                   {/* Block Actions Overlay */}
                                   <div className={`absolute top-0 right-[-32px] flex flex-col gap-1 opacity-0 group-hover:opacity-100 ${selectedBlockId === block.id ? 'opacity-100' : ''}`}>
                                      <button onClick={(e) => {e.stopPropagation(); moveBlock(block.id, 'up')}} className="p-1 bg-white border border-slate-200 rounded text-slate-500 hover:text-blue-600"><MoveUp size={14} /></button>
                                      <button onClick={(e) => {e.stopPropagation(); moveBlock(block.id, 'down')}} className="p-1 bg-white border border-slate-200 rounded text-slate-500 hover:text-blue-600"><MoveDown size={14} /></button>
                                   </div>

                                   {/* Render Block Content (Simplified Preview) */}
                                   <div className="pointer-events-none" dangerouslySetInnerHTML={{ __html: generateHtmlFromBlocks([block]).match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] || '' }} />
                                </div>
                             </Reorder.Item>
                          ))}
                       </Reorder.Group>
                    )}
                 </div>
              </div>
           )}
        </div>

        {/* --- Right: Component Library --- */}
        <div className="w-64 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
           <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                 <LayoutTemplate size={16} />
                 کتابخانه المان‌ها
              </h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 gap-3 content-start">
              {[
                { type: 'header', label: 'هدر / لوگو', icon: LayoutTemplate },
                { type: 'text', label: 'متن', icon: Type },
                { type: 'button', label: 'دکمه', icon: MousePointer2 },
                { type: 'image', label: 'تصویر', icon: ImageIcon },
                { type: 'spacer', label: 'فاصله', icon: GripVertical },
                { type: 'footer', label: 'پاورقی', icon: Globe },
              ].map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={() => { dragItem.current = item.type as BlockType }}
                  onClick={() => addBlock(item.type as BlockType)}
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md rounded-xl cursor-grab active:cursor-grabbing transition-all group"
                >
                   <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors">
                      <item.icon size={16} />
                   </div>
                   <span className="text-sm font-medium text-slate-700">{item.label}</span>
                   <Plus size={14} className="mr-auto text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))}
           </div>
        </div>

      </div>

      {/* --- Modals (Save/Load) --- */}
      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowSaveModal(false)} />
             <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-lg">ذخیره قالب</h3>
                   <button onClick={() => setShowSaveModal(false)}><X className="text-slate-400" /></button>
                </div>
                <input type="text" placeholder="نام قالب..." value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-slate-900" />
                <Button onClick={saveTemplate} disabled={!templateName} fullWidth>ذخیره</Button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Load Modal */}
      <AnimatePresence>
        {showLoadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowLoadModal(false)} />
             <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                   <h3 className="font-bold text-lg">قالب‌های من</h3>
                   <button onClick={() => setShowLoadModal(false)}><X className="text-slate-400" /></button>
                </div>
                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                   {savedTemplates.map(t => (
                      <div key={t.id} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:bg-slate-50 cursor-pointer transition-all" onClick={() => loadTemplate(t)}>
                         <h4 className="font-bold text-slate-800 mb-1">{t.name}</h4>
                         <p className="text-xs text-slate-500">{t.date} • {t.blocks.length} بلوک</p>
                      </div>
                   ))}
                   {savedTemplates.length === 0 && <p className="text-slate-500 text-center col-span-2">قالبی یافت نشد.</p>}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};


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
  Bold, Italic, Underline as UnderlineIcon, Highlighter, Layers, Box,
  Filter, Smartphone, Laptop, Columns
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

// --- Types ---

type BlockType = 'header' | 'text' | 'button' | 'image' | 'footer' | 'spacer' | 'product-grid';

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

const hexToRgba = (hex: string = '#000000', alpha: number) => {
  // Guard against undefined or short hex codes
  if (!hex || (hex.length !== 4 && hex.length !== 7)) {
      return `rgba(0, 0, 0, ${alpha})`;
  }

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

// --- Constants & Data ---

const ICON_MAP: Record<string, string | null> = {
  none: null,
  arrowLeft: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  cart: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  play: '<polygon points="5 3 19 12 5 21 5 3"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  twitter: '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-12.7 12.5 4 1.7 8.3-2.3 9-6.3-3.6 1.1-6.1-3.1-3.6-5.9 4.3 2.1 7.2.1 8-2.3z"/>', // X/Twitter simplified
  telegram: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  whatsapp: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>'
};

// Safe default for dropShadow to prevent crashes
const defaultDropShadow = { enabled: false, color: '#000000', blur: 0, x: 0, y: 0, opacity: 0 };

const BUTTON_PRESETS = [
  { name: 'ساده آبی', styles: { buttonBackgroundColor: '#2563eb', textColor: '#ffffff', borderRadius: '8px', border: { enabled: false }, buttonGradient: { enabled: false }, dropShadow: { ...defaultDropShadow }, buttonPadding: '12px 32px' } },
  { name: 'سایه نرم', styles: { buttonBackgroundColor: '#ffffff', textColor: '#2563eb', borderRadius: '12px', border: { enabled: false }, dropShadow: { enabled: true, color: '#2563eb', blur: 15, x: 0, y: 4, opacity: 0.15 }, buttonGradient: { enabled: false }, buttonPadding: '14px 36px' } },
  { name: 'گرادینت قرصی', styles: { buttonBackgroundColor: '#8b5cf6', textColor: '#ffffff', borderRadius: '9999px', border: { enabled: false }, buttonGradient: { enabled: true, from: '#8b5cf6', to: '#ec4899', direction: 'to right' }, dropShadow: { enabled: true, color: '#8b5cf6', blur: 10, x: 0, y: 4, opacity: 0.3 }, buttonPadding: '12px 40px' } },
  { name: 'خط دور (Outline)', styles: { buttonBackgroundColor: 'transparent', textColor: '#1e293b', borderRadius: '6px', border: { enabled: true, color: '#cbd5e1', width: 2, style: 'solid' }, buttonGradient: { enabled: false }, dropShadow: { ...defaultDropShadow }, buttonPadding: '10px 30px' } },
  { name: 'بروتالیسم', styles: { buttonBackgroundColor: '#facc15', textColor: '#000000', borderRadius: '0px', border: { enabled: true, color: '#000000', width: 3, style: 'solid' }, dropShadow: { enabled: true, color: '#000000', blur: 0, x: 4, y: 4, opacity: 1 }, buttonGradient: { enabled: false }, buttonPadding: '14px 32px' } },
  { name: 'نئون تیره', styles: { buttonBackgroundColor: '#0f172a', textColor: '#4ade80', borderRadius: '4px', border: { enabled: true, color: '#4ade80', width: 1, style: 'solid' }, dropShadow: { enabled: true, color: '#4ade80', blur: 12, x: 0, y: 0, opacity: 0.4 }, buttonGradient: { enabled: false }, buttonPadding: '12px 32px' } },
  { name: 'شیشه‌ای', styles: { buttonBackgroundColor: '#ffffff', textColor: '#1e293b', borderRadius: '16px', border: { enabled: true, color: '#e2e8f0', width: 1, style: 'solid' }, buttonGradient: { enabled: true, from: '#f8fafc', to: '#e2e8f0', direction: 'to bottom' }, dropShadow: { enabled: true, color: '#94a3b8', blur: 4, x: 0, y: 2, opacity: 0.1 }, buttonPadding: '12px 32px' } },
  { name: 'مینیمال', styles: { buttonBackgroundColor: '#f1f5f9', textColor: '#64748b', borderRadius: '6px', border: { enabled: false }, buttonGradient: { enabled: false }, dropShadow: { ...defaultDropShadow }, buttonPadding: '10px 24px' } },
  { name: 'غروب', styles: { buttonBackgroundColor: '#f97316', textColor: '#ffffff', borderRadius: '12px', border: { enabled: false }, buttonGradient: { enabled: true, from: '#f97316', to: '#fbbf24', direction: 'to bottom right' }, dropShadow: { enabled: true, color: '#f97316', blur: 8, x: 0, y: 4, opacity: 0.3 }, buttonPadding: '14px 36px' } },
  { name: 'سایبر', styles: { buttonBackgroundColor: '#000000', textColor: '#06b6d4', borderRadius: '2px', border: { enabled: true, color: '#06b6d4', width: 1, style: 'solid' }, buttonGradient: { enabled: false }, dropShadow: { enabled: true, color: '#06b6d4', blur: 0, x: -3, y: 3, opacity: 1 }, buttonPadding: '12px 32px' } },
];

const CUSTOM_FONTS = [
  {
    name: 'Vazirmatn',
    label: 'وزیر متن (پیش‌فرض)',
    weights: {} 
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
    content: { 
      text: 'کلیک کنید', 
      link: '#', 
      icon: 'none',
      iconPosition: 'right'
    },
    styles: { 
      backgroundColor: '#ffffff', // Container bg
      buttonBackgroundColor: '#2563eb', // Button bg
      buttonGradient: { enabled: false, from: '#2563eb', to: '#1d4ed8', direction: 'to right' },
      textColor: '#ffffff', 
      align: 'center', 
      padding: '20px', // Container padding
      buttonPadding: '12px 32px', // Inner padding
      borderRadius: '8px',
      width: 'auto', // 'auto' | 'full'
      border: { enabled: false, color: '#000000', width: 1, style: 'solid' },
      dropShadow: { ...defaultDropShadow },
      fontFamily: 'Vazirmatn',
      fontSize: '16',
      fontWeight: '700'
    }
  },
  image: {
    type: 'image',
    content: { 
      imageUrl: 'https://via.placeholder.com/600x300?text=Image', 
      alt: 'Image', 
      link: '#',
      sourceType: 'url'
    },
    styles: { 
      padding: '20px', 
      backgroundColor: '#ffffff',
      align: 'center',
      width: '100%',
      height: 'auto',
      borderRadius: '8px',
      objectFit: 'cover',
      filter: {
        brightness: 100,
        contrast: 100,
        saturate: 100,
      },
      border: {
        enabled: false,
        color: '#000000',
        width: 1,
        style: 'solid'
      },
      dropShadow: { ...defaultDropShadow }
    }
  },
  'product-grid': {
    type: 'product-grid',
    content: {
      columns: 2,
      items: [
        { imageUrl: 'https://via.placeholder.com/300x300?text=Product+1', link: '#', text: 'محصول شماره ۱ - ۵۰۰,۰۰۰ تومان', alt: 'Product 1' },
        { imageUrl: 'https://via.placeholder.com/300x300?text=Product+2', link: '#', text: 'محصول شماره ۲ - ۴۵۰,۰۰۰ تومان', alt: 'Product 2' }
      ]
    },
    styles: {
      backgroundColor: '#ffffff',
      padding: '20px',
      gap: '16', // px
      
      // Card specific styles
      cardBackgroundColor: 'transparent',
      cardPadding: '0px',
      cardBorderRadius: '0px',
      cardBorder: { enabled: false, color: '#e2e8f0', width: 1 },
      cardShadow: { ...defaultDropShadow },

      // Image Styles (Shared)
      imageAspectRatio: '1/1', // or 'auto'
      imageObjectFit: 'cover',
      imageBorderRadius: '8px',
      imageFilter: { brightness: 100, contrast: 100, saturate: 100 },
      imageBorder: { enabled: false, color: '#000000', width: 1 },
      imageShadow: { ...defaultDropShadow },

      // Text Styles (Shared)
      textColor: '#1e293b',
      fontSize: '14',
      fontWeight: '700',
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
      textPadding: '12px 0 0 0', // top right bottom left
    }
  },
  footer: {
    type: 'footer',
    content: { text: '© ۱۴۰۳ تمامی حقوق محفوظ است.', unsubscribeText: 'لغو اشتراک', unsubscribeLink: '#', link: '' },
    styles: { backgroundColor: '#f1f5f9', color: '#64748b', padding: '32px', fontFamily: 'Vazirmatn', fontSize: '14' }
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
        const btnStyle = styles.buttonGradient?.enabled 
            ? `background-image: linear-gradient(${styles.buttonGradient.direction === 'to right' ? '90deg' : '180deg'}, ${styles.buttonGradient.from}, ${styles.buttonGradient.to});`
            : `background-color: ${styles.buttonBackgroundColor || styles.buttonColor};`;
        
        let btnShadow = '';
        if (styles.dropShadow?.enabled) {
            const shadowColor = hexToRgba(styles.dropShadow.color, styles.dropShadow.opacity);
            btnShadow = `box-shadow: ${styles.dropShadow.x}px ${styles.dropShadow.y}px ${styles.dropShadow.blur}px ${shadowColor};`;
        }

        let btnBorder = '';
        if (styles.border?.enabled) {
            btnBorder = `border: ${styles.border.width}px ${styles.border.style} ${styles.border.color};`;
        } else {
            btnBorder = 'border: none;';
        }

        const isRightIcon = content.iconPosition === 'right';
        const iconSvg = content.icon && ICON_MAP[content.icon] 
            ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-${isRightIcon ? 'left' : 'right'}: 12px;">${ICON_MAP[content.icon]}</svg>` 
            : '';

        return `
          <div style="background-color: ${styles.backgroundColor}; padding: ${styles.padding}; text-align: ${styles.align};">
            <a href="${content.link}" style="
                display: inline-block; 
                width: ${styles.width === 'full' ? '100%' : 'auto'};
                box-sizing: border-box;
                text-align: center;
                text-decoration: none;
                color: ${styles.textColor};
                font-family: '${styles.fontFamily}', sans-serif;
                font-size: ${styles.fontSize}px;
                font-weight: ${styles.fontWeight};
                padding: ${styles.buttonPadding || '12px 32px'};
                border-radius: ${styles.borderRadius};
                ${btnStyle}
                ${btnShadow}
                ${btnBorder}
            ">
              ${isRightIcon ? iconSvg + content.text : content.text + iconSvg}
            </a>
          </div>`;

      case 'image':
        let imgFilter = `brightness(${styles.filter?.brightness || 100}%) contrast(${styles.filter?.contrast || 100}%) saturate(${styles.filter?.saturate || 100}%)`;
        if (styles.dropShadow?.enabled) {
           const shadowColor = hexToRgba(styles.dropShadow.color, styles.dropShadow.opacity);
           imgFilter += ` drop-shadow(${styles.dropShadow.x}px ${styles.dropShadow.y}px ${styles.dropShadow.blur}px ${shadowColor})`;
        }

        let imgBorder = '';
        if (styles.border?.enabled) {
            imgBorder = `border: ${styles.border.width}px ${styles.border.style} ${styles.border.color};`;
        } else {
            imgBorder = 'border: none;';
        }

        return `
          <div style="background-color: ${styles.backgroundColor}; padding: ${styles.padding}; text-align: ${styles.align};">
            <a href="${content.link}" target="_blank" style="display: inline-block; width: ${styles.width === '100%' ? '100%' : 'auto'};">
              <img src="${content.imageUrl}" alt="${content.alt}" 
                style="
                  max-width: 100%; 
                  width: ${styles.width || '100%'}; 
                  height: ${styles.height || 'auto'}; 
                  object-fit: ${styles.objectFit || 'cover'};
                  display: block; 
                  margin: 0 auto; 
                  border-radius: ${styles.borderRadius || '0px'};
                  filter: ${imgFilter};
                  -webkit-filter: ${imgFilter};
                  ${imgBorder}
                " 
              />
            </a>
          </div>`;

      case 'product-grid':
        const columns = content.columns || 2;
        const colWidth = 100 / columns;
        
        // Grid Image Styles
        let gridImgFilter = `brightness(${styles.imageFilter?.brightness || 100}%) contrast(${styles.imageFilter?.contrast || 100}%) saturate(${styles.imageFilter?.saturate || 100}%)`;
        if (styles.imageShadow?.enabled) {
           const shadowColor = hexToRgba(styles.imageShadow.color, styles.imageShadow.opacity);
           gridImgFilter += ` drop-shadow(${styles.imageShadow.x}px ${styles.imageShadow.y}px ${styles.imageShadow.blur}px ${shadowColor})`;
        }
        let gridImgBorder = '';
        if (styles.imageBorder?.enabled) {
            gridImgBorder = `border: ${styles.imageBorder.width}px solid ${styles.imageBorder.color};`;
        }

        // Card Styles
        let cardStyle = `background-color: ${styles.cardBackgroundColor || 'transparent'}; padding: ${styles.cardPadding || '0px'}; border-radius: ${styles.cardBorderRadius || '0px'};`;
        if (styles.cardBorder?.enabled) {
            cardStyle += ` border: ${styles.cardBorder.width}px solid ${styles.cardBorder.color};`;
        }
        if (styles.cardShadow?.enabled) {
            const shadowColor = hexToRgba(styles.cardShadow.color, styles.cardShadow.opacity);
            cardStyle += ` box-shadow: ${styles.cardShadow.x}px ${styles.cardShadow.y}px ${styles.cardShadow.blur}px ${shadowColor};`;
        }

        const itemsHtml = content.items.map((item: any, idx: number) => {
           return `
             <div style="display: inline-block; width: ${colWidth}%; vertical-align: top; box-sizing: border-box; padding: ${styles.gap ? parseInt(styles.gap) / 2 : 8}px;">
                <div style="text-align: ${styles.textAlign}; ${cardStyle} height: 100%;">
                   <a href="${item.link}" style="text-decoration: none; display: block;">
                      <img src="${item.imageUrl}" alt="${item.alt}" style="
                         width: 100%; 
                         height: auto; 
                         aspect-ratio: ${styles.imageAspectRatio || 'auto'}; 
                         object-fit: ${styles.imageObjectFit || 'cover'}; 
                         border-radius: ${styles.imageBorderRadius || '0px'};
                         display: block;
                         filter: ${gridImgFilter};
                         -webkit-filter: ${gridImgFilter};
                         ${gridImgBorder}
                      " />
                   </a>
                   ${item.text ? `
                   <div style="
                      margin: 0;
                      padding: ${styles.textPadding};
                      color: ${styles.textColor};
                      font-size: ${styles.fontSize}px;
                      font-weight: ${styles.fontWeight};
                      font-family: '${styles.fontFamily}', sans-serif;
                      text-align: ${styles.textAlign};
                      direction: rtl;
                   ">
                      <a href="${item.link}" style="text-decoration: none; color: inherit;">${item.text}</a>
                   </div>` : ''}
                </div>
             </div>
           `;
        }).join('');

        return `
          <div style="background-color: ${styles.backgroundColor}; padding: ${styles.padding}; text-align: center; direction: rtl; font-size: 0;">
             <!--[if mso]>
             <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
             <tr>
             <![endif]-->
             ${itemsHtml}
             <!--[if mso]>
             </tr>
             </table>
             <![endif]-->
          </div>
        `;

      case 'footer':
        const fFont = styles.fontFamily || 'Vazirmatn';
        const fSize = styles.fontSize || '14';
        const fText = `<p style="margin: 0 0 12px 0; color: ${styles.color}; font-size: ${fSize}px; font-family: '${fFont}', sans-serif;">${content.text}</p>`;
        return `
          <div style="background-color: ${styles.backgroundColor}; padding: ${styles.padding}; text-align: ${styles.align || 'center'}; direction: rtl;">
            ${content.link ? `<a href="${content.link}" style="text-decoration: none; display: block; color: inherit;">${fText}</a>` : fText}
            <a href="${content.unsubscribeLink}" style="color: ${styles.color}; text-decoration: underline; font-size: ${Math.max(10, parseInt(fSize) - 2)}px; font-family: '${fFont}', sans-serif; opacity: 0.8;">${content.unsubscribeText}</a>
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
  
  // State for tracking which grid item is being edited (for Product Grid)
  const [activeGridItemIndex, setActiveGridItemIndex] = useState<number>(0);

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

  // Specific for Product Grid Item updates
  const updateGridItem = (blockId: string, itemIndex: number, field: string, value: any) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    
    const newItems = [...block.content.items];
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
    
    updateBlockContent(blockId, 'items', newItems);
  };

  // Change columns for Product Grid
  const updateGridColumns = (blockId: string, count: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    let newItems = [...block.content.items];
    if (count > newItems.length) {
       // Add items
       const needed = count - newItems.length;
       for (let i=0; i<needed; i++) {
          newItems.push({ imageUrl: 'https://via.placeholder.com/300x300?text=New', link: '#', text: `محصول ${newItems.length + 1}`, alt: 'Product' });
       }
    } else if (count < newItems.length) {
       // Remove items
       newItems = newItems.slice(0, count);
    }
    
    updateBlock(blockId, {
       content: { ...block.content, columns: count, items: newItems }
    });
  };

  const applyPreset = (id: string, presetStyles: any) => {
    setBlocks(blocks.map(b => {
      if (b.id !== id) return b;
      return {
        ...b,
        styles: {
          ...b.styles,
          ...presetStyles,
          backgroundColor: b.styles.backgroundColor,
          align: b.styles.align,
          padding: b.styles.padding,
        }
      };
    }));
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
           const block = blocks.find(b => b.id === selectedBlockId);
           if (!block) return;

           if (block.type === 'header') {
              updateBlockContent(selectedBlockId, 'logoUrl', event.target.result);
           } else if (block.type === 'image') {
              updateBlockContent(selectedBlockId, 'imageUrl', event.target.result);
           } else if (block.type === 'product-grid') {
              updateGridItem(selectedBlockId, activeGridItemIndex, 'imageUrl', event.target.result);
           }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSourceTypeChange = (type: string) => {
    if (!selectedBlock) return;
    
    const newStyles = { ...selectedBlock.styles };
    const newContent = { ...selectedBlock.content, sourceType: type };

    if (selectedBlock.type === 'header') {
        if (type === 'pattern') {
          newStyles.width = '100%';
          newStyles.height = '150px';
          newStyles.padding = '0px';
          newStyles.objectFit = 'cover';
        } else if (type === 'url' || type === 'upload') {
          if (newStyles.width === '100%') newStyles.width = '200px';
          if (newStyles.height === '150px') newStyles.height = 'auto';
          if (newStyles.padding === '0px') newStyles.padding = '20px';
          newStyles.objectFit = 'contain';
        }
    } 

    updateBlock(selectedBlock.id, {
      content: newContent,
      styles: newStyles
    });
  };

  const handleGenerateAi = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create an email template for: "${aiPrompt}".
        Return a JSON OBJECT with a key "blocks". The value must be an array of objects matching this structure:
        { "type": "header" | "text" | "button" | "image" | "footer", "content": { ... }, "styles": { ... } }
        Return ONLY valid JSON.`,
        config: { responseMimeType: "application/json" }
      });

      const json = JSON.parse(response.text || '{}');
      if (json.blocks && Array.isArray(json.blocks)) {
        const newBlocks = json.blocks.map((b: any) => ({
          ...b,
          id: Date.now().toString() + Math.random().toString(),
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
  const rawHtml = generateHtmlFromBlocks(blocks);

  // Tab State for Product Grid Settings
  const [gridTab, setGridTab] = useState<'layout' | 'items' | 'imgStyle' | 'txtStyle'>('layout');

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
      <style>{generateFontCss()}</style>

      {/* --- Top Bar --- */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
           {/* ... Header Content ... */}
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
            <FolderOpen size={16} className="ml-2" />
            قالب‌ها
          </Button>
          <Button size="sm" onClick={() => setShowSaveModal(true)} disabled={blocks.length === 0} className="bg-blue-600 hover:bg-blue-700 border-none">
            <Save size={16} className="ml-2" />
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
                   
                   {/* BUTTON SETTINGS */}
                   {selectedBlock.type === 'button' && (
                     /* ... (Button Settings Code - Kept Same) ... */
                     <div className="space-y-6">
                        {/* 1. Presets */}
                        <div className="space-y-2">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">استایل‌های آماده</div>
                           <div className="grid grid-cols-2 gap-2 p-1">
                              {BUTTON_PRESETS.map((preset, idx) => (
                                 <button
                                   key={idx}
                                   onClick={() => applyPreset(selectedBlock.id, preset.styles)}
                                   className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all text-center text-slate-700 font-medium truncate"
                                 >
                                    {preset.name}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* 2. Content */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">محتوا</div>
                           
                           <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1">متن دکمه</label>
                              <input 
                                type="text" 
                                value={selectedBlock.content.text}
                                onChange={(e) => updateBlockContent(selectedBlock.id, 'text', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-blue-500 text-slate-900"
                              />
                           </div>
                           
                           <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1">لینک مقصد</label>
                              <input 
                                type="text" dir="ltr"
                                value={selectedBlock.content.link}
                                onChange={(e) => updateBlockContent(selectedBlock.id, 'link', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-blue-500 text-left text-slate-900"
                              />
                           </div>

                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-600 block mb-1">آیکون دکمه</label>
                              
                              {/* Visual Icon Grid */}
                              <div className="grid grid-cols-5 gap-2">
                                <button
                                    onClick={() => updateBlockContent(selectedBlock.id, 'icon', 'none')}
                                    className={`aspect-square rounded-lg border flex items-center justify-center transition-all ${selectedBlock.content.icon === 'none' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-400 hover:border-blue-200'}`}
                                    title="بدون آیکون"
                                >
                                    <X size={14} />
                                </button>
                                {Object.keys(ICON_MAP).filter(k => k !== 'none').map(k => (
                                    <button
                                        key={k}
                                        onClick={() => updateBlockContent(selectedBlock.id, 'icon', k)}
                                        className={`aspect-square rounded-lg border flex items-center justify-center transition-all ${selectedBlock.content.icon === k ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'}`}
                                        title={k}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" dangerouslySetInnerHTML={{ __html: ICON_MAP[k] || '' }} />
                                    </button>
                                ))}
                              </div>

                              {selectedBlock.content.icon !== 'none' && (
                                <div className="mt-2">
                                   <label className="text-[10px] font-bold text-slate-600 block mb-1">موقعیت آیکون</label>
                                   <div className="flex bg-slate-100 p-1 rounded-lg">
                                      <button 
                                        onClick={() => updateBlockContent(selectedBlock.id, 'iconPosition', 'right')}
                                        className={`flex-1 py-1 text-[10px] rounded transition-all ${selectedBlock.content.iconPosition === 'right' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                                      >راست</button>
                                      <button 
                                        onClick={() => updateBlockContent(selectedBlock.id, 'iconPosition', 'left')}
                                        className={`flex-1 py-1 text-[10px] rounded transition-all ${selectedBlock.content.iconPosition === 'left' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                                      >چپ</button>
                                   </div>
                                </div>
                              )}
                           </div>
                        </div>

                        {/* 3. Typography */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">تایپوگرافی</div>
                           
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
                                        className="flex-1 w-full h-8 text-xs text-center border-none focus:ring-0 text-slate-900 font-medium bg-white"
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

                           <div>
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
                        </div>

                        {/* 4. Appearance */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ظاهر دکمه</div>

                           {/* Custom Tabs for Style Type */}
                           <div className="bg-slate-100 p-1 rounded-lg flex mb-4">
                              <button 
                                onClick={() => updateBlockNestedStyle(selectedBlock.id, 'buttonGradient', 'enabled', false)}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${!selectedBlock.styles.buttonGradient?.enabled ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                              >
                                تک رنگ
                              </button>
                              <button 
                                onClick={() => updateBlockNestedStyle(selectedBlock.id, 'buttonGradient', 'enabled', true)}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${selectedBlock.styles.buttonGradient?.enabled ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500'}`}
                              >
                                گرادینت
                              </button>
                           </div>

                           <div className="space-y-3">
                              {/* Color/Gradient Controls */}
                              {!selectedBlock.styles.buttonGradient?.enabled ? (
                                 <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-600">رنگ پس‌زمینه</span>
                                    <div className="flex items-center gap-2">
                                       <div className="w-8 h-8 rounded-lg border border-slate-200 overflow-hidden shrink-0 relative">
                                          <input 
                                            type="color" 
                                            value={selectedBlock.styles.buttonBackgroundColor || '#2563eb'}
                                            onChange={(e) => updateBlockStyle(selectedBlock.id, 'buttonBackgroundColor', e.target.value)}
                                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-none"
                                          />
                                       </div>
                                       <span className="text-[10px] font-mono text-slate-400" dir="ltr">{selectedBlock.styles.buttonBackgroundColor}</span>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 space-y-3">
                                    <div className="flex items-center justify-between">
                                       <span className="text-[10px] font-bold text-purple-800">شروع و پایان</span>
                                       <select 
                                          value={selectedBlock.styles.buttonGradient?.direction || 'to right'}
                                          onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'buttonGradient', 'direction', e.target.value)}
                                          className="text-[10px] py-1 px-2 rounded border border-purple-200 bg-white text-slate-700"
                                       >
                                          <option value="to right">افقی</option>
                                          <option value="to bottom">عمودی</option>
                                          <option value="to bottom right">مورب</option>
                                       </select>
                                    </div>
                                    <div className="flex gap-2">
                                       <div className="flex-1 flex items-center gap-2 bg-white p-2 rounded-lg border border-purple-100">
                                          <input 
                                            type="color" 
                                            value={selectedBlock.styles.buttonGradient?.from || '#2563eb'}
                                            onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'buttonGradient', 'from', e.target.value)}
                                            className="w-6 h-6 rounded cursor-pointer border-none p-0"
                                          />
                                          <span className="text-[10px] text-slate-400">از</span>
                                       </div>
                                       <div className="flex-1 flex items-center gap-2 bg-white p-2 rounded-lg border border-purple-100">
                                          <input 
                                            type="color" 
                                            value={selectedBlock.styles.buttonGradient?.to || '#1d4ed8'}
                                            onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'buttonGradient', 'to', e.target.value)}
                                            className="w-6 h-6 rounded cursor-pointer border-none p-0"
                                          />
                                          <span className="text-[10px] text-slate-400">به</span>
                                       </div>
                                    </div>
                                 </div>
                              )}

                              {/* Text Color */}
                              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                                 <span className="text-[10px] font-bold text-slate-600">رنگ متن و آیکون</span>
                                 <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg border border-slate-200 overflow-hidden shrink-0 relative">
                                       <input 
                                         type="color" 
                                         value={selectedBlock.styles.textColor || '#ffffff'}
                                         onChange={(e) => updateBlockStyle(selectedBlock.id, 'textColor', e.target.value)}
                                         className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-none"
                                       />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400" dir="ltr">{selectedBlock.styles.textColor}</span>
                                 </div>
                              </div>
                           </div>

                           {/* Border Radius */}
                           <div className="pt-2">
                              <div className="flex justify-between mb-1">
                                 <label className="text-[10px] font-bold text-slate-600">گردی گوشه</label>
                                 <span className="text-[10px] text-slate-400">{selectedBlock.styles.borderRadius}</span>
                              </div>
                              <input 
                                type="range" min="0" max="50" 
                                value={parseInt(selectedBlock.styles.borderRadius) || 0}
                                onChange={(e) => updateBlockStyle(selectedBlock.id, 'borderRadius', `${e.target.value}px`)}
                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              />
                           </div>

                           {/* Border Control */}
                           <div className="pt-2 border-t border-slate-100">
                              <div className="flex items-center justify-between mb-2">
                                 <div className="text-[10px] font-bold text-slate-600">حاشیه (Border)</div>
                                 <label className="relative inline-flex items-center cursor-pointer">
                                   <input 
                                     type="checkbox" 
                                     checked={selectedBlock.styles.border?.enabled || false}
                                     onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'border', 'enabled', e.target.checked)}
                                     className="sr-only peer"
                                   />
                                   <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                                 </label>
                              </div>
                              {selectedBlock.styles.border?.enabled && (
                                 <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                                    <input 
                                      type="color" 
                                      value={selectedBlock.styles.border?.color || '#000000'}
                                      onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'border', 'color', e.target.value)}
                                      className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                                    />
                                    <input 
                                      type="number" min="1" max="10"
                                      value={selectedBlock.styles.border?.width || 1}
                                      onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'border', 'width', parseInt(e.target.value))}
                                      className="w-12 text-xs p-1 rounded border border-slate-200 text-center bg-white text-slate-900"
                                    />
                                    <select 
                                      value={selectedBlock.styles.border?.style || 'solid'}
                                      onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'border', 'style', e.target.value)}
                                      className="flex-1 text-xs p-1 rounded border border-slate-200 bg-white text-slate-900"
                                    >
                                       <option value="solid">Solid</option>
                                       <option value="dashed">Dashed</option>
                                       <option value="dotted">Dotted</option>
                                    </select>
                                 </div>
                              )}
                           </div>

                           {/* Shadow Control */}
                           <div className="pt-2 border-t border-slate-100">
                              <div className="flex items-center justify-between mb-2">
                                 <div className="text-[10px] font-bold text-slate-600">سایه دکمه</div>
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
                                 <div className="bg-slate-50 p-3 rounded-xl space-y-3 border border-slate-200">
                                    <div className="flex items-center gap-2">
                                       <input 
                                         type="color" 
                                         value={selectedBlock.styles.dropShadow?.color || '#000000'}
                                         onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'color', e.target.value)}
                                         className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                                       />
                                       <div className="flex-1">
                                          <label className="text-[9px] text-slate-500 block mb-1">Blur</label>
                                          <input 
                                            type="range" min="0" max="20" 
                                            value={selectedBlock.styles.dropShadow?.blur || 0}
                                            onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'blur', e.target.value)}
                                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                                          />
                                       </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                       <div>
                                          <label className="text-[9px] text-slate-500 block mb-1">X Offset</label>
                                          <input type="number" value={selectedBlock.styles.dropShadow?.x || 0} onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'x', e.target.value)} className="w-full text-xs p-1 border border-slate-200 rounded bg-white text-center text-slate-900" />
                                       </div>
                                       <div>
                                          <label className="text-[9px] text-slate-500 block mb-1">Y Offset</label>
                                          <input type="number" value={selectedBlock.styles.dropShadow?.y || 0} onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'dropShadow', 'y', e.target.value)} className="w-full text-xs p-1 border border-slate-200 rounded bg-white text-center text-slate-900" />
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* 5. Placement */}
                        <div className="space-y-2 pt-4 border-t border-slate-100">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">جایگذاری</div>
                           <div className="grid grid-cols-2 gap-2">
                              <div>
                                 <label className="text-[10px] font-bold text-slate-600 block mb-1">عرض دکمه</label>
                                 <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button onClick={() => updateBlockStyle(selectedBlock.id, 'width', 'auto')} className={`flex-1 py-1 text-[10px] rounded transition-all ${selectedBlock.styles.width !== 'full' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>خودکار</button>
                                    <button onClick={() => updateBlockStyle(selectedBlock.id, 'width', 'full')} className={`flex-1 py-1 text-[10px] rounded transition-all ${selectedBlock.styles.width === 'full' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>تمام عرض</button>
                                 </div>
                              </div>
                              <div>
                                 <label className="text-[10px] font-bold text-slate-600 block mb-1">چیدمان</label>
                                 <div className="flex bg-slate-100 p-1 rounded-lg">
                                    {['right', 'center', 'left'].map(align => (
                                       <button key={align} onClick={() => updateBlockStyle(selectedBlock.id, 'align', align)} className={`flex-1 py-1 rounded flex items-center justify-center transition-all ${selectedBlock.styles.align === align ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>
                                          {align === 'right' ? <AlignRight size={14} /> : align === 'center' ? <AlignCenter size={14} /> : <AlignLeft size={14} />}
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {/* HEADER SETTINGS */}
                   {selectedBlock.type === 'header' && (
                      <div className="space-y-6">
                         {/* Content Section */}
                         <div className="space-y-4">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">محتوای هدر</div>
                            
                            {/* Source Type */}
                            <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
                               <button onClick={() => handleSourceTypeChange('url')} className={`flex-1 py-1.5 text-[10px] font-medium rounded transition-all ${selectedBlock.content.sourceType === 'url' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>لینک</button>
                               <button onClick={() => handleSourceTypeChange('upload')} className={`flex-1 py-1.5 text-[10px] font-medium rounded transition-all ${selectedBlock.content.sourceType === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>آپلود</button>
                            </div>

                            {/* Input Area */}
                            {selectedBlock.content.sourceType === 'url' ? (
                               <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-600 block">آدرس لوگو</label>
                                  <div className="flex gap-2">
                                     <input 
                                       type="text" dir="ltr"
                                       value={selectedBlock.content.logoUrl}
                                       onChange={(e) => updateBlockContent(selectedBlock.id, 'logoUrl', e.target.value)}
                                       className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                       placeholder="https://..."
                                     />
                                  </div>
                               </div>
                            ) : (
                               <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-600 block">فایل لوگو</label>
                                  <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group"
                                  >
                                     {selectedBlock.content.logoUrl && !selectedBlock.content.logoUrl.includes('placeholder') ? (
                                        <img src={selectedBlock.content.logoUrl} className="h-12 object-contain mb-2 group-hover:scale-110 transition-transform" alt="Preview" />
                                     ) : (
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2 group-hover:bg-white group-hover:text-blue-500">
                                           <Upload size={18} />
                                        </div>
                                     )}
                                     <span className="text-[10px] text-slate-500 font-medium">برای انتخاب تصویر کلیک کنید</span>
                                  </div>
                                  {/* Hidden Input */}
                                  <input 
                                     type="file" 
                                     ref={fileInputRef} 
                                     className="hidden" 
                                     accept="image/*" 
                                     onChange={handleFileUpload}
                                  />
                               </div>
                            )}

                            {/* Meta Data */}
                            <div className="grid grid-cols-2 gap-3">
                               <div>
                                  <label className="text-[10px] font-bold text-slate-600 block mb-1">متن جایگزین (Alt)</label>
                                  <input 
                                    type="text"
                                    value={selectedBlock.content.alt}
                                    onChange={(e) => updateBlockContent(selectedBlock.id, 'alt', e.target.value)}
                                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-900"
                                  />
                               </div>
                               <div>
                                  <label className="text-[10px] font-bold text-slate-600 block mb-1">لینک لوگو</label>
                                  <input 
                                    type="text" dir="ltr"
                                    value={selectedBlock.content.link}
                                    onChange={(e) => updateBlockContent(selectedBlock.id, 'link', e.target.value)}
                                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-900"
                                    placeholder="#"
                                  />
                               </div>
                            </div>
                         </div>

                         {/* Style Section */}
                         <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ظاهر</div>
                            
                            {/* Width Slider */}
                            <div>
                               <div className="flex justify-between items-center mb-1">
                                  <label className="text-[10px] font-bold text-slate-600">عرض لوگو</label>
                                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{selectedBlock.styles.width}</span>
                               </div>
                               <input 
                                  type="range" min="50" max="600" step="10"
                                  value={parseInt(selectedBlock.styles.width) || 200}
                                  onChange={(e) => updateBlockStyle(selectedBlock.id, 'width', `${e.target.value}px`)}
                                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                               />
                            </div>

                            {/* Alignment */}
                            <div>
                               <label className="text-[10px] font-bold text-slate-600 block mb-1">چیدمان</label>
                               <div className="flex bg-slate-100 p-1 rounded-lg">
                                  {['right', 'center', 'left'].map(align => (
                                     <button
                                       key={align}
                                       onClick={() => updateBlockStyle(selectedBlock.id, 'align', align)}
                                       className={`flex-1 py-1.5 rounded flex items-center justify-center transition-all ${selectedBlock.styles.align === align ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
                                     >
                                        {align === 'right' ? <AlignRight size={16} /> : align === 'center' ? <AlignCenter size={16} /> : <AlignLeft size={16} />}
                                     </button>
                                  ))}
                               </div>
                            </div>

                            {/* Background & Padding */}
                            <div className="grid grid-cols-2 gap-3">
                               <div>
                                  <label className="text-[10px] font-bold text-slate-600 block mb-1">رنگ زمینه</label>
                                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-white">
                                     <input 
                                       type="color" 
                                       value={selectedBlock.styles.backgroundColor}
                                       onChange={(e) => updateBlockStyle(selectedBlock.id, 'backgroundColor', e.target.value)}
                                       className="w-6 h-6 rounded cursor-pointer border-none p-0"
                                     />
                                     <span className="text-[10px] text-slate-400 font-mono truncate" dir="ltr">{selectedBlock.styles.backgroundColor}</span>
                                  </div>
                               </div>
                               <div>
                                  <label className="text-[10px] font-bold text-slate-600 block mb-1">فاصله (Padding)</label>
                                  <input 
                                     type="text" dir="ltr"
                                     value={selectedBlock.styles.padding}
                                     onChange={(e) => updateBlockStyle(selectedBlock.id, 'padding', e.target.value)}
                                     className="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-900 text-center"
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                   )}

                   {/* IMAGE SETTINGS */}
                   {selectedBlock.type === 'image' && (
                      <div className="space-y-6">
                         {/* Image Content */}
                         <div className="space-y-4">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">تصویر</div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-slate-600 block">فایل تصویر</label>
                               <div 
                                 onClick={() => fileInputRef.current?.click()}
                                 className="border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group"
                               >
                                  {selectedBlock.content.imageUrl ? (
                                     <img src={selectedBlock.content.imageUrl} className="h-20 object-cover rounded-md mb-2" alt="Preview" />
                                  ) : (
                                     <ImageIcon size={24} className="text-slate-300 mb-2" />
                                  )}
                                  <span className="text-[10px] text-slate-500">تغییر تصویر</span>
                               </div>
                               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                               <div>
                                  <label className="text-[10px] font-bold text-slate-600 block mb-1">لینک تصویر</label>
                                  <input 
                                    type="text" dir="ltr"
                                    value={selectedBlock.content.link}
                                    onChange={(e) => updateBlockContent(selectedBlock.id, 'link', e.target.value)}
                                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-900"
                                    placeholder="#"
                                  />
                                </div>
                            </div>
                         </div>

                         {/* Image Styles */}
                         <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ظاهر</div>
                            
                            {/* Width */}
                            <div>
                               <div className="flex justify-between items-center mb-1">
                                  <label className="text-[10px] font-bold text-slate-600">عرض تصویر</label>
                                  <div className="flex gap-1">
                                     <button onClick={() => updateBlockStyle(selectedBlock.id, 'width', '100%')} className={`text-[9px] px-1.5 rounded ${selectedBlock.styles.width === '100%' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>Full</button>
                                     <span className="text-[10px] text-slate-400">{selectedBlock.styles.width}</span>
                                  </div>
                               </div>
                               {selectedBlock.styles.width !== '100%' && (
                                  <input 
                                     type="range" min="50" max="600" step="10"
                                     value={parseInt(selectedBlock.styles.width) || 600}
                                     onChange={(e) => updateBlockStyle(selectedBlock.id, 'width', `${e.target.value}px`)}
                                     className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                  />
                               )}
                            </div>

                            {/* Radius */}
                            <div>
                               <div className="flex justify-between items-center mb-1">
                                  <label className="text-[10px] font-bold text-slate-600">گردی گوشه</label>
                                  <span className="text-[10px] text-slate-400">{selectedBlock.styles.borderRadius}</span>
                               </div>
                               <input 
                                  type="range" min="0" max="50" 
                                  value={parseInt(selectedBlock.styles.borderRadius) || 0}
                                  onChange={(e) => updateBlockStyle(selectedBlock.id, 'borderRadius', `${e.target.value}px`)}
                                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                               />
                            </div>
                         </div>
                      </div>
                   )}

                   {/* --- PRODUCT GRID SETTINGS --- */}
                   {selectedBlock.type === 'product-grid' && (
                     <div className="space-y-6">
                        {/* Tab Navigation for Grid Settings */}
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                           {[
                             { id: 'layout', icon: Columns, label: 'چیدمان' },
                             { id: 'items', icon: Box, label: 'محتوا' },
                             { id: 'imgStyle', icon: ImageIcon, label: 'تصویر' },
                             { id: 'txtStyle', icon: Type, label: 'متن' },
                           ].map(tab => (
                             <button
                               key={tab.id}
                               onClick={() => setGridTab(tab.id as any)}
                               className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md text-[10px] font-bold transition-all ${gridTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                             >
                                <tab.icon size={12} />
                                {tab.label}
                             </button>
                           ))}
                        </div>

                        {/* 1. Layout Tab */}
                        {gridTab === 'layout' && (
                           <div className="space-y-6">
                              {/* Section 1: Grid Layout */}
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700">تعداد ستون‌ها</span>
                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                       {[2, 3, 4].map(n => (
                                          <button
                                             key={n}
                                             onClick={() => updateGridColumns(selectedBlock.id, n)}
                                             className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-bold transition-all ${selectedBlock.content.columns === n ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                          >
                                             {n}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                                 
                                 <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                       <span className="text-xs font-medium text-slate-600">فاصله (Gap)</span>
                                       <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{selectedBlock.styles.gap}px</span>
                                    </div>
                                    <input 
                                       type="range" min="0" max="40" step="4"
                                       value={parseInt(selectedBlock.styles.gap)}
                                       onChange={(e) => updateBlockStyle(selectedBlock.id, 'gap', e.target.value)}
                                       className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                 </div>
                              </div>

                              <div className="h-px bg-slate-100"></div>

                              {/* Section 2: Card Styling */}
                              <div className="space-y-4">
                                 <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                                    <span className="text-xs font-bold text-slate-800">استایل کارت‌ها</span>
                                 </div>

                                 {/* Card Background */}
                                 <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-600">رنگ کارت</span>
                                    <div className="flex items-center gap-2">
                                       <div className="relative w-6 h-6 rounded-full border border-slate-200 overflow-hidden shadow-sm">
                                          <input 
                                             type="color" 
                                             value={selectedBlock.styles.cardBackgroundColor || '#ffffff'}
                                             onChange={(e) => updateBlockStyle(selectedBlock.id, 'cardBackgroundColor', e.target.value)}
                                             className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-none"
                                          />
                                       </div>
                                       <span className="text-[10px] font-mono text-slate-400 uppercase">{selectedBlock.styles.cardBackgroundColor}</span>
                                    </div>
                                 </div>

                                 {/* Padding & Radius */}
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                       <label className="text-[10px] text-slate-500 block">فاصله داخلی</label>
                                       <div className="relative flex items-center">
                                          <input 
                                             type="number" 
                                             min="0" max="60"
                                             value={parseInt(selectedBlock.styles.cardPadding) || 0}
                                             onChange={(e) => updateBlockStyle(selectedBlock.id, 'cardPadding', `${e.target.value}px`)}
                                             className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg text-center bg-white text-slate-900"
                                          />
                                          <span className="absolute left-2 text-[9px] text-slate-400">px</span>
                                       </div>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] text-slate-500 block">گردی گوشه</label>
                                       <div className="relative flex items-center">
                                          <input 
                                             type="number" 
                                             min="0" max="50"
                                             value={parseInt(selectedBlock.styles.cardBorderRadius) || 0}
                                             onChange={(e) => updateBlockStyle(selectedBlock.id, 'cardBorderRadius', `${e.target.value}px`)}
                                             className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg text-center bg-white text-slate-900"
                                          />
                                          <span className="absolute left-2 text-[9px] text-slate-400">px</span>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Border Toggle */}
                                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3">
                                    <div className="flex items-center justify-between">
                                       <span className="text-xs font-medium text-slate-700">حاشیه (Border)</span>
                                       <label className="relative inline-flex items-center cursor-pointer">
                                          <input 
                                             type="checkbox" 
                                             checked={selectedBlock.styles.cardBorder?.enabled || false}
                                             onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'cardBorder', 'enabled', e.target.checked)}
                                             className="sr-only peer"
                                          />
                                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                       </label>
                                    </div>
                                    
                                    {selectedBlock.styles.cardBorder?.enabled && (
                                       <div className="flex gap-2 animate-in slide-in-from-top-1 fade-in duration-200">
                                          <div className="w-8 h-8 rounded-lg border border-slate-200 overflow-hidden relative shrink-0">
                                             <input 
                                                type="color" 
                                                value={selectedBlock.styles.cardBorder?.color || '#000000'}
                                                onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'cardBorder', 'color', e.target.value)}
                                                className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                                             />
                                          </div>
                                          <input 
                                             type="number" min="1" max="10"
                                             value={selectedBlock.styles.cardBorder?.width || 1}
                                             onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'cardBorder', 'width', parseInt(e.target.value))}
                                             className="flex-1 text-xs border border-slate-200 rounded-lg text-center bg-white text-slate-900"
                                             placeholder="Width"
                                          />
                                       </div>
                                    )}
                                 </div>

                                 {/* Shadow Toggle */}
                                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3">
                                    <div className="flex items-center justify-between">
                                       <span className="text-xs font-medium text-slate-700">سایه (Shadow)</span>
                                       <label className="relative inline-flex items-center cursor-pointer">
                                          <input 
                                             type="checkbox" 
                                             checked={selectedBlock.styles.cardShadow?.enabled || false}
                                             onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'cardShadow', 'enabled', e.target.checked)}
                                             className="sr-only peer"
                                          />
                                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                       </label>
                                    </div>

                                    {selectedBlock.styles.cardShadow?.enabled && (
                                       <div className="space-y-3 animate-in slide-in-from-top-1 fade-in duration-200">
                                          <div className="flex gap-2">
                                             <div className="w-8 h-8 rounded-lg border border-slate-200 overflow-hidden relative shrink-0">
                                                <input 
                                                   type="color" 
                                                   value={selectedBlock.styles.cardShadow?.color || '#000000'}
                                                   onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'cardShadow', 'color', e.target.value)}
                                                   className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                                                />
                                             </div>
                                             <div className="flex-1">
                                                <input 
                                                   type="range" min="0" max="50"
                                                   value={selectedBlock.styles.cardShadow?.blur || 0}
                                                   onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'cardShadow', 'blur', e.target.value)}
                                                   className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600 mt-3"
                                                />
                                             </div>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2">
                                             <div className="relative">
                                                <span className="absolute right-2 top-1.5 text-[9px] text-slate-400">X</span>
                                                <input 
                                                   type="number" 
                                                   value={selectedBlock.styles.cardShadow?.x || 0}
                                                   onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'cardShadow', 'x', e.target.value)}
                                                   className="w-full pl-2 pr-5 py-1 text-xs border border-slate-200 rounded-lg text-left bg-white text-slate-900"
                                                />
                                             </div>
                                             <div className="relative">
                                                <span className="absolute right-2 top-1.5 text-[9px] text-slate-400">Y</span>
                                                <input 
                                                   type="number" 
                                                   value={selectedBlock.styles.cardShadow?.y || 0}
                                                   onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'cardShadow', 'y', e.target.value)}
                                                   className="w-full pl-2 pr-5 py-1 text-xs border border-slate-200 rounded-lg text-left bg-white text-slate-900"
                                                />
                                             </div>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              </div>

                              <div className="h-px bg-slate-100"></div>

                              {/* Section 3: Container */}
                              <div className="flex items-center justify-between">
                                 <span className="text-xs text-slate-600">پس‌زمینه کل بخش</span>
                                 <div className="flex items-center gap-2">
                                    <div className="relative w-6 h-6 rounded-full border border-slate-200 overflow-hidden shadow-sm">
                                       <input 
                                          type="color" 
                                          value={selectedBlock.styles.backgroundColor}
                                          onChange={(e) => updateBlockStyle(selectedBlock.id, 'backgroundColor', e.target.value)}
                                          className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-none"
                                       />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 uppercase">{selectedBlock.styles.backgroundColor}</span>
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* 2. Items Content Tab */}
                        {gridTab === 'items' && (
                           <div className="space-y-4">
                              <div className="flex overflow-x-auto gap-2 pb-2 mb-2 no-scrollbar">
                                 {selectedBlock.content.items.map((item: any, idx: number) => (
                                    <button
                                       key={idx}
                                       onClick={() => setActiveGridItemIndex(idx)}
                                       className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden relative transition-all ${activeGridItemIndex === idx ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200 opacity-70'}`}
                                    >
                                       <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                       <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center">{idx + 1}</div>
                                    </button>
                                 ))}
                              </div>

                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                                 <div>
                                    <label className="text-[10px] font-bold text-slate-600 block mb-1">تصویر محصول {activeGridItemIndex + 1}</label>
                                    <div className="flex gap-2">
                                       <input 
                                          type="text" dir="ltr"
                                          value={selectedBlock.content.items[activeGridItemIndex].imageUrl}
                                          onChange={(e) => updateGridItem(selectedBlock.id, activeGridItemIndex, 'imageUrl', e.target.value)}
                                          className="flex-1 p-1.5 text-xs border border-slate-200 rounded bg-white text-slate-900"
                                       />
                                       <button className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100" title="Upload" onClick={() => fileInputRef.current?.click()}>
                                          <Upload size={14} />
                                       </button>
                                    </div>
                                 </div>

                                 <div>
                                    <label className="text-[10px] font-bold text-slate-600 block mb-1">لینک مقصد</label>
                                    <input 
                                       type="text" dir="ltr"
                                       value={selectedBlock.content.items[activeGridItemIndex].link}
                                       onChange={(e) => updateGridItem(selectedBlock.id, activeGridItemIndex, 'link', e.target.value)}
                                       className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white text-slate-900"
                                    />
                                 </div>

                                 <div>
                                    <label className="text-[10px] font-bold text-slate-600 block mb-1">متن زیر تصویر (اختیاری)</label>
                                    <textarea 
                                       rows={2}
                                       value={selectedBlock.content.items[activeGridItemIndex].text}
                                       onChange={(e) => updateGridItem(selectedBlock.id, activeGridItemIndex, 'text', e.target.value)}
                                       className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white text-slate-900 resize-none"
                                       placeholder="عنوان یا قیمت محصول..."
                                    />
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* 3. Image Style Tab */}
                        {gridTab === 'imgStyle' && (
                           <div className="space-y-4">
                              <div>
                                 <label className="text-[10px] font-bold text-slate-600 block mb-1">نسبت تصویر</label>
                                 <select 
                                    value={selectedBlock.styles.imageAspectRatio}
                                    onChange={(e) => updateBlockStyle(selectedBlock.id, 'imageAspectRatio', e.target.value)}
                                    className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white text-slate-900"
                                 >
                                    <option value="auto">خودکار (Auto)</option>
                                    <option value="1/1">مربع (1:1)</option>
                                    <option value="3/4">پرتره (3:4)</option>
                                    <option value="4/3">لنداسکیپ (4:3)</option>
                                 </select>
                              </div>

                              <div>
                                 <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-bold text-slate-600">گردی گوشه تصویر</label>
                                    <span className="text-[10px] text-slate-400">{selectedBlock.styles.imageBorderRadius}</span>
                                 </div>
                                 <input 
                                   type="range" min="0" max="50" 
                                   value={parseInt(selectedBlock.styles.imageBorderRadius) || 0}
                                   onChange={(e) => updateBlockStyle(selectedBlock.id, 'imageBorderRadius', `${e.target.value}px`)}
                                   className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                 />
                              </div>

                              {/* Border Control for Images */}
                              <div className="space-y-2 pt-2 border-t border-slate-100">
                                 <div className="flex items-center justify-between">
                                    <div className="text-[10px] font-bold text-slate-600">حاشیه تصویر</div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        checked={selectedBlock.styles.imageBorder?.enabled || false}
                                        onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'imageBorder', 'enabled', e.target.checked)}
                                        className="sr-only peer"
                                      />
                                      <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                 </div>
                                 {selectedBlock.styles.imageBorder?.enabled && (
                                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                       <input 
                                          type="color" 
                                          value={selectedBlock.styles.imageBorder?.color || '#000000'}
                                          onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'imageBorder', 'color', e.target.value)}
                                          className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                                       />
                                       <input 
                                          type="number" min="1" max="10"
                                          value={selectedBlock.styles.imageBorder?.width || 1}
                                          onChange={(e) => updateBlockNestedStyle(selectedBlock.id, 'imageBorder', 'width', parseInt(e.target.value))}
                                          className="w-12 text-xs p-1 rounded border border-slate-200 text-center bg-white text-slate-900"
                                       />
                                    </div>
                                 )}
                              </div>
                           </div>
                        )}

                        {/* 4. Text Style Tab */}
                        {gridTab === 'txtStyle' && (
                           <div className="space-y-4">
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
                                    <input 
                                        type="number" 
                                        value={selectedBlock.styles.fontSize}
                                        onChange={(e) => updateBlockStyle(selectedBlock.id, 'fontSize', e.target.value)}
                                        className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white text-slate-900 text-center"
                                    />
                                 </div>
                              </div>

                              <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                                 <span className="text-[10px] font-bold text-slate-600 flex-1">رنگ متن</span>
                                 <input 
                                   type="color" 
                                   value={selectedBlock.styles.textColor}
                                   onChange={(e) => updateBlockStyle(selectedBlock.id, 'textColor', e.target.value)}
                                   className="w-6 h-6 rounded cursor-pointer border-none p-0"
                                 />
                              </div>

                              <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                                 <button 
                                   onClick={() => updateBlockStyle(selectedBlock.id, 'fontWeight', selectedBlock.styles.fontWeight === '700' ? '400' : '700')}
                                   className={`flex-1 py-1.5 rounded flex items-center justify-center transition-all ${selectedBlock.styles.fontWeight === '700' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                                 >
                                    <Bold size={14} />
                                 </button>
                                 {['right', 'center', 'left'].map(align => (
                                    <button 
                                      key={align}
                                      onClick={() => updateBlockStyle(selectedBlock.id, 'textAlign', align)}
                                      className={`flex-1 py-1.5 rounded flex items-center justify-center transition-all ${selectedBlock.styles.textAlign === align ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                                    >
                                       {align === 'right' ? <AlignRight size={14} /> : align === 'center' ? <AlignCenter size={14} /> : <AlignLeft size={14} />}
                                    </button>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>
                   )}
                   {/* END PRODUCT GRID SETTINGS */}

                   {/* --- FOOTER SETTINGS (NEW) --- */}
                   {selectedBlock.type === 'footer' && (
                     <div className="space-y-6">
                        <div className="space-y-4">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">محتوای پاورقی</div>
                           
                           <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1">متن اصلی (کپی‌رایت)</label>
                              <textarea 
                                value={selectedBlock.content.text}
                                onChange={(e) => updateBlockContent(selectedBlock.id, 'text', e.target.value)}
                                rows={3}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 resize-none"
                              />
                           </div>

                           <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1">متن لغو اشتراک</label>
                              <input 
                                type="text"
                                value={selectedBlock.content.unsubscribeText}
                                onChange={(e) => updateBlockContent(selectedBlock.id, 'unsubscribeText', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900"
                              />
                           </div>

                           <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1">لینک لغو اشتراک</label>
                              <input 
                                type="text" dir="ltr"
                                value={selectedBlock.content.unsubscribeLink}
                                onChange={(e) => updateBlockContent(selectedBlock.id, 'unsubscribeLink', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 text-left"
                              />
                           </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">تایپوگرافی</div>
                           <div className="grid grid-cols-2 gap-2">
                              <div>
                                 <label className="text-[10px] font-bold text-slate-600 block mb-1">فونت</label>
                                 <select 
                                   value={selectedBlock.styles.fontFamily || 'Vazirmatn'}
                                   onChange={(e) => updateBlockStyle(selectedBlock.id, 'fontFamily', e.target.value)}
                                   className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white text-slate-900"
                                 >
                                    {CUSTOM_FONTS.map(font => (
                                      <option key={font.name} value={font.name}>{font.label}</option>
                                    ))}
                                 </select>
                              </div>
                              <div>
                                 <label className="text-[10px] font-bold text-slate-600 block mb-1">سایز متن (px)</label>
                                 <input 
                                     type="number" 
                                     value={selectedBlock.styles.fontSize || '14'}
                                     onChange={(e) => updateBlockStyle(selectedBlock.id, 'fontSize', e.target.value)}
                                     className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white text-slate-900 text-center"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                   )}
                   {/* END FOOTER SETTINGS */}


                   {/* COMMON CONTENT FIELDS (Non-Header & Non-Button & Non-Image & Non-Grid & Non-Footer) */}
                   {selectedBlock.type !== 'header' && selectedBlock.type !== 'button' && selectedBlock.type !== 'image' && selectedBlock.type !== 'product-grid' && selectedBlock.type !== 'footer' && (
                     <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">محتوا</div>
                        
                        {selectedBlock.type === 'text' && (
                          <div className="space-y-3">
                             {/* ... (Text Content Code - Kept Same) ... */}
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
                                {/* ... (Text Typography Code - Kept Same) ... */}
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
                                                className="flex-1 w-full h-8 text-xs text-center border-none focus:ring-0 text-slate-900 font-medium bg-white"
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
                                                className="flex-1 w-full h-8 text-xs text-center border-none focus:ring-0 text-slate-900 font-medium bg-white"
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
                                {/* ... (Text Shadow/Stroke Code - Kept Same) ... */}
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
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ظاهر کلی</div>
                      
                      <div className="grid grid-cols-2 gap-2">
                         <div>
                            <label className="text-xs font-bold text-slate-700 mb-1 block">پس‌زمینه بخش</label>
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

                      {selectedBlock.styles.align && selectedBlock.type !== 'button' && selectedBlock.type !== 'product-grid' && (
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
                          <Sparkles size={16} className="ml-2" />
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
                { type: 'product-grid', label: 'کارت‌لیست', icon: Grid },
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

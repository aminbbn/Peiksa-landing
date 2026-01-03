
// --- Types ---

export type BlockType = 'header' | 'text' | 'button' | 'image' | 'footer' | 'spacer' | 'product-grid' | 'countdown';

export interface EmailBlock {
  id: string;
  type: BlockType;
  content: any;
  styles: any;
}

export interface SavedTemplate {
  id: string;
  name: string;
  blocks: EmailBlock[];
  date: string;
}

export interface GlobalSettings {
  width: string;
  backgroundColor: string;
  backgroundType: 'solid' | 'gradient';
  gradient: { from: string; to: string; direction: string };
  pattern: 'none' | 'grid' | 'dots' | 'lines' | 'checker';
  patternOpacity: number;
  patternColor: string;
  noise: {
    enabled: boolean;
    amount: number;
    scale: number;
    blendMode: string;
  };
}

// --- Helpers ---

export const hexToRgba = (hex: string = '#000000', alpha: number) => {
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

export const getBackgroundStyle = (settings: GlobalSettings) => {
  let bg = settings.backgroundType === 'gradient' 
    ? `linear-gradient(${settings.gradient.direction}, ${settings.gradient.from}, ${settings.gradient.to})`
    : settings.backgroundColor;
  
  return bg;
};

export const getPatternStyle = (settings: GlobalSettings) => {
  if (settings.pattern === 'none') return '';
  
  const color = hexToRgba(settings.patternColor, settings.patternOpacity);
  
  switch (settings.pattern) {
    case 'grid':
      return `background-image: linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px); background-size: 20px 20px;`;
    case 'dots':
      return `background-image: radial-gradient(${color} 1px, transparent 1px); background-size: 20px 20px;`;
    case 'lines':
      return `background-image: repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 0, transparent 50%); background-size: 10px 10px;`;
    case 'checker':
      return `background-image: conic-gradient(${color} 90deg, transparent 90deg 180deg, ${color} 180deg 270deg, transparent 270deg); background-size: 20px 20px;`;
    default:
      return '';
  }
};

export const calculateTimeLeft = (targetDate: string, targetTime: string) => {
  const difference = +new Date(`${targetDate}T${targetTime}`) - +new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  return timeLeft;
};

// --- Constants & Data ---

export const ICON_MAP: Record<string, string | null> = {
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

export const defaultDropShadow = { enabled: false, color: '#000000', blur: 0, x: 0, y: 0, opacity: 0 };

export const CUSTOM_FONTS = [
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

export const generateFontCss = () => {
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

export const PATTERNS = [
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

export const generateHtmlFromBlocks = (blocks: EmailBlock[], globalSettings?: GlobalSettings) => {
  const fontCss = generateFontCss();
  
  // Background & Pattern Styles
  let containerStyle = `background-color: #f3f4f6; margin: 0; padding: 0; min-height: 100vh;`;
  let wrapperStyle = `max-width: 600px; margin: 0 auto; overflow: hidden;`;

  if (globalSettings) {
     const bgStyle = getBackgroundStyle(globalSettings);
     const patternStyle = getPatternStyle(globalSettings);
     containerStyle = `background: ${bgStyle}; ${patternStyle} margin: 0; padding: 20px 0; min-height: 100vh;`;
     wrapperStyle = `max-width: ${globalSettings.width || '600px'}; margin: 0 auto; overflow: hidden; background-color: transparent;`;
  }

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
        
        let gridImgFilter = `brightness(${styles.imageFilter?.brightness || 100}%) contrast(${styles.imageFilter?.contrast || 100}%) saturate(${styles.imageFilter?.saturate || 100}%)`;
        if (styles.imageShadow?.enabled) {
           const shadowColor = hexToRgba(styles.imageShadow.color, styles.imageShadow.opacity);
           gridImgFilter += ` drop-shadow(${styles.imageShadow.x}px ${styles.imageShadow.y}px ${styles.imageShadow.blur}px ${shadowColor})`;
        }
        let gridImgBorder = '';
        if (styles.imageBorder?.enabled) {
            gridImgBorder = `border: ${styles.imageBorder.width}px solid ${styles.imageBorder.color};`;
        }

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

      case 'countdown':
        const timeLeft = calculateTimeLeft(content.targetDate, content.targetTime);
        const { days, hours, minutes, seconds } = timeLeft;
        const boxPadding = styles.boxPadding || '10';
        const digitStyle = `display: inline-block; width: 60px; padding: ${boxPadding}px 0; background-color: ${styles.digitBgColor}; color: ${styles.digitColor}; border-radius: ${styles.borderRadius}px; font-size: ${styles.fontSize}px; font-weight: bold; font-family: '${styles.fontFamily}', sans-serif; text-align: center;`;
        const labelStyle = `display: block; font-size: 10px; color: ${styles.labelColor}; margin-top: 4px; font-family: '${styles.fontFamily}', sans-serif; text-align: center;`;
        
        return `
          <div style="background-color: ${styles.backgroundColor}; padding: ${styles.padding}; text-align: ${styles.align}; direction: ltr;">
             <!--[if mso]>
             <table role="presentation" align="${styles.align === 'center' ? 'center' : styles.align === 'left' ? 'left' : 'right'}" border="0" cellspacing="0" cellpadding="0">
             <tr>
             <![endif]-->
             
             <div style="display: inline-block; margin: 0 ${styles.gap ? parseInt(styles.gap) / 2 : 5}px;">
                <div style="${digitStyle}">${days}</div>
                <div style="${labelStyle}">روز</div>
             </div>
             <div style="display: inline-block; margin: 0 ${styles.gap ? parseInt(styles.gap) / 2 : 5}px;">
                <div style="${digitStyle}">${hours}</div>
                <div style="${labelStyle}">ساعت</div>
             </div>
             <div style="display: inline-block; margin: 0 ${styles.gap ? parseInt(styles.gap) / 2 : 5}px;">
                <div style="${digitStyle}">${minutes}</div>
                <div style="${labelStyle}">دقیقه</div>
             </div>
             <div style="display: inline-block; margin: 0 ${styles.gap ? parseInt(styles.gap) / 2 : 5}px;">
                <div style="${digitStyle}">${seconds}</div>
                <div style="${labelStyle}">ثانیه</div>
             </div>

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
  body { ${containerStyle} font-family: 'Vazirmatn', sans-serif; }
  * { box-sizing: border-box; }
  .email-container { ${wrapperStyle} }
  a { text-decoration: none; }
  ${globalSettings?.noise.enabled ? `
  .noise-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none;
    z-index: 9999;
    opacity: ${globalSettings.noise.amount};
    filter: url(#noiseFilter);
    mix-blend-mode: ${globalSettings.noise.blendMode};
  }` : ''}
</style>
</head>
<body>
  ${globalSettings?.noise.enabled ? `
  <svg style="display: none;">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="${globalSettings.noise.scale}" numOctaves="3" stitchTiles="stitch"/>
    </filter>
  </svg>
  <div class="noise-overlay"></div>
  ` : ''}
  <div class="email-container">
    ${bodyContent}
  </div>
</body>
</html>`;
};

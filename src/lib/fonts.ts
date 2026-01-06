import localFont from 'next/font/local';

// --- Configuration Helper ---
// Read enabled fonts from environment variable (e.g., "1,2" or "3")
const ENABLED_FONTS = process.env.NEXT_PUBLIC_ENABLED_FONTS || '';
const isEnabled = (id: string) => ENABLED_FONTS.includes(id);

// --- Core Fonts (Always Loaded) ---

export const montserrat = localFont({
  src: [
    { path: '../../public/fonts/Montserrat-Regular.otf', weight: '400', style: 'normal' },
  ],
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  variable: '--font-montserrat',
});

export const engravers = localFont({
  src: '../../public/fonts/EngraversOldEnglish.otf',
  display: 'swap',
  variable: '--font-engravers',
});

export const adorable = localFont({
  src: '../../public/fonts/SuperAdorable.ttf',
  display: 'swap',
  variable: '--font-adorable',
});

// --- Optional Fonts ---
// Must be defined at top level for Next.js loaders.
// Usage is controlled by environment variables in getLoadedFonts()
// and by conditional rendering in components.

export const xingkai = localFont({
  src: '../../public/fonts/STXingkai.ttf',
  display: 'swap',
  variable: '--font-xingkai',
});

export const nokia = localFont({
  src: '../../public/fonts/NokiaFont-GuYin.ttf',
  display: 'swap',
  variable: '--font-nokia',
});

export const fzxz = localFont({
  src: '../../public/fonts/FZXZTFW.ttf',
  display: 'swap',
  variable: '--font-fzxz',
});

export const hanyi = localFont({
  src: '../../public/fonts/Hanyi-Youran.ttf',
  display: 'swap',
  variable: '--font-hanyi',
});

export const liuJian = localFont({
  src: '../../public/fonts/LiuJianMaoCao-Regular.ttf',
  display: 'swap',
  variable: '--font-liujian',
});

export const alexBrush = localFont({
  src: '../../public/fonts/AlexBrush-Regular.ttf',
  display: 'swap',
  variable: '--font-alexbrush',
});

export const quicksand = localFont({
  src: '../../public/fonts/Quicksand-VariableFont_wght.ttf',
  display: 'swap',
  variable: '--font-quicksand',
});

// --- Usage Utilities ---

/**
 * Returns an object containing all loaded fonts based on environment config.
 * Useful for iterating or registering in global styles.
 * 
 * If a font is disabled via env, it returns the fallback (montserrat)
 * to prevent runtime errors in loops, but its variable won't be injected if filtered correctly.
 */
export const getLoadedFonts = () => {
  return {
    montserrat,
    engravers,
    adorable,
    hanyi: isEnabled('1') ? hanyi : montserrat,
    liuJian: isEnabled('2') ? liuJian : montserrat,
    alexBrush: isEnabled('3') ? alexBrush : montserrat,
    quicksand: isEnabled('4') ? quicksand : montserrat,
    xingkai: isEnabled('5') ? xingkai : montserrat,
    nokia: isEnabled('6') ? nokia : montserrat,
    fzxz: isEnabled('7') ? fzxz : montserrat,
  };
};


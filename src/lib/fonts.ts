import { Montserrat } from "next/font/google";
import localFont from 'next/font/local';

export const montserrat = Montserrat({
  weight: ['400'], // 400 is Regular
  subsets: ['latin'],
  display: 'swap',
})
export const engravers = localFont({
  src: '../../public/fonts/EngraversOldEnglish.otf',
  display: 'swap',
});

export const adorable = localFont({
  src: '../../public/fonts/SuperAdorable.ttf',
  display: 'swap',
});

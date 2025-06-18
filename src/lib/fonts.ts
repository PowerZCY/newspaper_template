import localFont from 'next/font/local';

export const montserrat = localFont({
  src: '../../public/fonts/MontserratRegular.otf',
  display: 'swap',
  // family: 'montserrat', // 可省略，默认用文件名
});

export const engravers = localFont({
  src: '../../public/fonts/EngraversOldEnglish.otf',
  display: 'swap',
});

export const adorable = localFont({
  src: '../../public/fonts/SuperAdorable.ttf',
  display: 'swap',
});

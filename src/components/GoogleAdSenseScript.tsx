import Script from 'next/script';

/**
 * Google AdSense 脚本组件
 * 需要在 .env.local 中配置 NEXT_PUBLIC_ADSENSE_ID
 */
export function GoogleAdSenseScript() {
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  // 如果没有配置 AdSense ID，不渲染脚本
  if (!adSenseId) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
      crossOrigin="anonymous"
    />
  );
}

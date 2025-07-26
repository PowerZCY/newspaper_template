import { createCommonAppConfig, createI18nHelpers, LOCALE_PRESETS } from "@windrun-huaiin/lib/common-app-config";

// 创建应用配置
export const appConfig = {
  ...createCommonAppConfig(LOCALE_PRESETS.EN_ONLY),
  newspaperTemplates: [
    {
      name: "Simple Template",
      type: "normal",
      key: "simple",
      thumb: "https://r2.d8ger.com/newspaper-template/simple.webp",
      href: "",
      top: true
    },
    {
      name: "Modern Template",
      type: "normal",
      key: "modern",
      thumb: "https://r2.d8ger.com/newspaper-template/modern.webp",
      href: "",
      top: false
    },
    {
      name: "Sponsored",
      type: "ads",
      thumb: "https://r2.d8ger.com/Ad-Pollo.webp",
      href: "https://pollo.ai/home?ref=mzmzndj&tm_news=news",
      key: "ad-1",
      top: false
    }
  ],
  newspaperCard: {
    cardWidth: 200,
    cardHeight: 300,
  },
  newsAI: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    modelName: process.env.NEXT_PUBLIC_OPENROUTER_MODEL_NAME || '',
    // 默认启用mock，防止DEV飞速消耗token数量
    enableMock: process.env.OPENROUTER_ENABLE_MOCK !== 'false',
    enableMockAds: process.env.OPENROUTER_ENABLE_MOCK_ADS === 'true',
    enableMockTimeout: process.env.OPENROUTER_ENABLE_MOCK_TIMEOUT === 'true',
    mockTimeoutSeconds: Number(process.env.OPENROUTER_MOCK_TIMEOUT_SECONDS) || 3,
    // 单词请求限制消耗的token数量
    limitMaxChars: 1000
  },
  export: {
    scale: 3, // 图片导出清晰度
    pdfScale: 4, // PDF导出JPEG的清晰度
  },
  socialConfig: [
    // { key: 'Twitter', name: 'Twitter' },
    // { key: 'Facebook', name: 'Facebook' },
  ] as SocialConfig[],
};

// 导出国际化辅助函数
export const { isSupportedLocale, getValidLocale, generatedLocales } = createI18nHelpers(appConfig.i18n);

// 便捷常量直接从 shortcuts 导出
export const { iconColor, watermark, showBanner, clerkPageBanner, clerkAuthInModal, placeHolderImage } = appConfig.shortcuts;

// define social icon type
export type SocialConfig = {
  key: string;
  name: string;
};

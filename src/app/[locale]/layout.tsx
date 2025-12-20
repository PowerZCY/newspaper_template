import { appConfig, generatedLocales } from "@/lib/appConfig";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import './globals.css';
import { NProgressBar } from '@windrun-huaiin/third-ui/main';
import { getFumaTranslations } from '@windrun-huaiin/third-ui/fuma/server';
import { RootProvider } from "fumadocs-ui/provider/next";
import { ClerkProviderClient } from '@windrun-huaiin/third-ui/clerk';
import { cn as cnUtils } from '@windrun-huaiin/lib/utils';
import { montserrat } from '@/lib/fonts';
import { GoogleAnalyticsScript } from "@windrun-huaiin/base-ui/components";
import { MicrosoftClarityScript } from "@windrun-huaiin/base-ui/components";
import { GoogleAdSenseScript } from "@/components/GoogleAdSenseScript";

export const dynamic = 'force-dynamic'

// 网站元数据
export async function generateMetadata({
  params: paramsPromise
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await paramsPromise;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: t('webTitle'),
    description: t('webDescription'),
    keywords: t('keywords'),
    metadataBase: new URL(appConfig.baseUrl),
    alternates: {
      canonical: `${appConfig.baseUrl}/${locale}`,
      languages: {
        "en": `${appConfig.baseUrl}/en`,
      }
    },
    icons: [
      { rel: "icon", type: 'image/png', sizes: "16x16", url: "/favicon-16x16.png" },
      { rel: "icon", type: 'image/png', sizes: "32x32", url: "/favicon-32x32.png" },
      { rel: "icon", type: 'image/ico', url: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon-180x180.png" },
      { rel: "android-chrome", sizes: "512x512", url: "/favicon-512x512.png" },
    ]
  }
}

export default async function RootLayout({
  children,
  params: paramsPromise  // 重命名参数
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await paramsPromise;  // 使用新名称
  setRequestLocale(locale);
  const messages = await getMessages();
  const fumaTranslations = await getFumaTranslations(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <NextIntlClientProvider messages={messages}>
        <body className={cnUtils(montserrat.className)}>
          <NProgressBar />
          <ClerkProviderClient locale={locale}>
            <RootProvider
              i18n={{
                locale: locale,
                // available languages
                locales: generatedLocales,
                // translations for UI
                translations: fumaTranslations,
              }}
            >
              {children}
            </RootProvider>
          </ClerkProviderClient>
        </body>
        <GoogleAnalyticsScript />
        <MicrosoftClarityScript />
        <GoogleAdSenseScript />
        </NextIntlClientProvider>
    </html>
  )
}

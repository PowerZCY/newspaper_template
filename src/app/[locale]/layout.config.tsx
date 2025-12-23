import { globalLucideIcons as icons } from '@windrun-huaiin/base-ui/components/server';
import { SiteIcon } from '@/lib/site-config';
import { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { getTranslations } from 'next-intl/server';
import { ClerkUser } from '@windrun-huaiin/third-ui/clerk/server';
import { appConfig } from '@/lib/appConfig';
import { ExtendedLinkItem, HomeTitle } from '@windrun-huaiin/third-ui/fuma/base';
import { getAsNeededLocalizedUrl } from '@windrun-huaiin/lib';

// 首页普通菜单
export async function homeNavLinks(locale: string): Promise<ExtendedLinkItem[]> {
  const t1 = await getTranslations({ locale: locale, namespace: 'linkPreview' });
  return [
    {
      icon: <icons.AlbumIcon />,
      text: t1('blog'),
      url: getAsNeededLocalizedUrl(locale, '/blog'),
    },
    {
      type: 'custom',
      // false就先排左边的菜单, true就先排右边的按钮
      secondary: true,
      // true代表在移动端也会出现在主菜单栏上，不会被折叠
      mobilePinned: true,
      children: <ClerkUser locale={locale} clerkAuthInModal={appConfig.style.clerkAuthInModal}/>
    }
  ];
}

// 层级特殊菜单
export async function levelNavLinks(locale: string): Promise<ExtendedLinkItem[]> {
  console.log('levelNavLinks', locale);
  return [
    
  ]
}

export async function baseOptions(locale: string): Promise<BaseLayoutProps> {
  const t = await getTranslations({ locale: locale, namespace: 'home' });
  return {
    // 导航Header配置
    nav: {
      url: getAsNeededLocalizedUrl(locale, '/'),
      title: (
        <>
          <SiteIcon />
          <HomeTitle>
            {t('title')}
          </HomeTitle>
        </>
      ),
      // 导航Header, 透明模式选项: none | top | always
      // https://fumadocs.dev/docs/ui/layouts/docs#transparent-mode
      transparentMode: 'none',
    }
  };
}
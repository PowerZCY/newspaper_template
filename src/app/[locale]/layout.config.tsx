import { globalLucideIcons as icons } from '@windrun-huaiin/base-ui/components/server';
import { SiteIcon } from '@/lib/site-config';
import { type LinkItemType } from 'fumadocs-ui/layouts/docs';
import { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { getTranslations } from 'next-intl/server';
import { ClerkUser } from '@windrun-huaiin/third-ui/clerk';
import { i18n } from '@/i18n';
import { appConfig } from '@/lib/appConfig';

// 首页普通菜单
export async function homeNavLinks(locale: string): Promise<LinkItemType[]> {
  const t1 = await getTranslations({ locale: locale, namespace: 'linkPreview' });
  return [
    {
      icon: <icons.AlbumIcon />,
      text: t1('blog'),
      url: `/${locale}/blog`,
    },
    {
      icon: <icons.BTC />,
      text: t1('pricing'),
      url: `/${locale}#pricing`,
    },
    {
      type: 'custom',
      // false就先排左边的菜单, true就先排右边的按钮
      secondary: true,
      // NicknameFilter 假设在其内部也使用了 useNickname
      children: <ClerkUser locale={locale} clerkAuthInModal={appConfig.style.clerkAuthInModal}/>
    }
  ];
}

// 层级特殊菜单
export async function levelNavLinks(locale: string): Promise<LinkItemType[]> {
  console.log('levelNavLinks', locale);
  return [
    
  ]
}

export async function baseOptions(locale: string): Promise<BaseLayoutProps> {
  const t = await getTranslations({ locale: locale, namespace: 'home' });
  return {
    // 导航Header配置
    nav: {
      url: `/${locale}`,
      title: (
        <>
          <SiteIcon />
          <span className="font-medium [.uwu_&]:hidden [header_&]:text-[15px]">
            {t('title')}
          </span>
        </>
      ),
      // 导航Header, 透明模式选项: none | top | always
      // https://fumadocs.dev/docs/ui/layouts/docs#transparent-mode
      transparentMode: 'none',
    },
    // 导航Header, 语言切换
    i18n
  };
}
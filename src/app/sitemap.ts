import { MetadataRoute } from 'next'
import { appConfig } from "@/lib/appConfig";
import fs from 'fs';
import path from 'path';

// 强制静态生成
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = appConfig.baseUrl
  const locales = appConfig.i18n.locales

  // 1. 读取所有博客mdx文件名
  const blogDir = path.join(process.cwd(), 'src/mdx/blog');
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

  // 2. 排除 ioc.mdx 和 index.mdx
  const filtered = blogFiles.filter(f => f !== 'ioc.mdx');

  // 3. 处理 index.mdx（博客起始页）和其它 slug
  const blogRoutes = locales.flatMap(locale =>
    filtered.flatMap(f => {
      if (f === 'index.mdx') {
        return [{
          url: `${baseUrl}/${locale}/blog`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.8
        }];
      } else {
        const slug = f.replace(/\.mdx$/, '');
        return [{
          url: `${baseUrl}/${locale}/blog/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.8
        }];
      }
    })
  );

  // 4. 主页面（各语言版本）
  const mainRoutes = locales.map(locale => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0
  }));

  return [...mainRoutes, ...blogRoutes];
}

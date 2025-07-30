import { getMDXComponents } from '@/components/mdx-components';
import { appConfig } from '@/lib/appConfig';
import { SiteIcon } from '@/lib/site-config';
import { blogSource } from '@/lib/source-blog';
import { NotFoundPage } from '@windrun-huaiin/base-ui/components';
import { LLMCopyButton } from '@windrun-huaiin/third-ui/fuma/mdx';
import { createFumaPage } from '@windrun-huaiin/third-ui/fuma/server';

const sourceKey = 'blog';
const { Page, generateStaticParams, generateMetadata } = createFumaPage({
  sourceKey: sourceKey,
  mdxContentSource: blogSource,
  getMDXComponents,
  mdxSourceDir: appConfig.mdxSourceDir[sourceKey],
  githubBaseUrl: appConfig.githubBaseUrl,
  copyButtonComponent: <LLMCopyButton />,
  siteIcon: <SiteIcon />,
  FallbackPage: NotFoundPage,
  supportedLocales: appConfig.i18n.locales as string[],
});

export default Page;
export { generateMetadata, generateStaticParams };

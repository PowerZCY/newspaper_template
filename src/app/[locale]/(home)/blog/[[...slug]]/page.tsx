import { getMDXComponents } from '@/components/mdx-components';
import { appConfig } from '@/lib/appConfig';
import { SiteIcon } from '@/lib/site-config';
import { mdxSourceMap } from '@/lib/source';
import { NotFoundPage } from '@windrun-huaiin/base-ui/components';
import { LLMCopyButton } from '@windrun-huaiin/third-ui/fuma/mdx';
import { createFumaPage } from '@windrun-huaiin/third-ui/fuma/server';

const sourceKey = 'blog';
const { Page, generateStaticParams, generateMetadata } = createFumaPage({
  sourceKey: sourceKey,
  mdxContentSource: mdxSourceMap[sourceKey],
  getMDXComponents,
  mdxSourceDir: appConfig.mdxSourceDir[sourceKey],
  githubBaseUrl: appConfig.githubBaseUrl,
  copyButtonComponent: <LLMCopyButton />,
  siteIcon: <SiteIcon />,
  FallbackPage: NotFoundPage,
});

export default Page;
export { generateMetadata, generateStaticParams };

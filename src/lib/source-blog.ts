import { blog } from '.source';
import { i18n } from '@/i18n';
import { getIconElement } from '@windrun-huaiin/base-ui/components/server';
import { loader } from 'fumadocs-core/source';

// blog mdx parser
export const blogSource = loader({
  i18n,
  baseUrl: '/blog',
  source: blog.toFumadocsSource(),
  icon: getIconElement,
});
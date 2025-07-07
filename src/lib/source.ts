import { blog, legal } from '.source';
import { i18n } from '@/i18n';
import { getIconElement } from '@windrun-huaiin/base-ui/components/server';
import { InferMetaType, InferPageType, loader } from 'fumadocs-core/source';

// legal mdx parser
export const legalSource = loader({
  i18n,
  baseUrl: '/legal',
  source: legal.toFumadocsSource(),
  icon: getIconElement,
});

// blog mdx parser
export const blogSource = loader({
  i18n,
  baseUrl: '/blog',
  source: blog.toFumadocsSource(),
  icon: getIconElement,
});

export type Page = InferPageType<typeof legalSource>;
export type Meta = InferMetaType<typeof legalSource>;
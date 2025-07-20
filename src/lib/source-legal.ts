import { legal } from '.source';
import { i18n } from '@/i18n';
import { getIconElement } from '@windrun-huaiin/base-ui/components/server';
import { loader } from 'fumadocs-core/source';

// legal mdx parser
export const legalSource = loader({
  i18n,
  baseUrl: '/legal',
  source: legal.toFumadocsSource(),
  icon: getIconElement,
});

import { appConfig } from '@/lib/appConfig';
import { createCommonDocsSchema, createCommonMetaSchema, remarkInstallOptions } from '@windrun-huaiin/third-ui/lib/server';
import { rehypeCodeDefaultOptions, remarkSteps } from 'fumadocs-core/mdx-plugins';
import { fileGenerator, remarkDocGen, remarkInstall } from 'fumadocs-docgen';
import { remarkTypeScriptToJavaScript } from 'fumadocs-docgen/remark-ts2js';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { remarkAutoTypeTable } from 'fumadocs-typescript';
import type { Element } from 'hast';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import type { ShikiTransformerContext as TransformerContext } from 'shiki';

const mdxSourceDir = appConfig.mdxSourceDir

export const blog = defineDocs({
  dir: mdxSourceDir.blog,
  docs: {
    async: false,
    // @ts-ignore - Temporarily suppress deep instantiation error
    schema: createCommonDocsSchema(),
  },
  meta: {
    schema: createCommonMetaSchema(),
  },
});

export const legal = defineDocs({
  dir: mdxSourceDir.legal,
  docs: {
    async: false,
    // @ts-ignore - Temporarily suppress deep instantiation error
    schema: createCommonDocsSchema(),
  },
  meta: {
    schema: createCommonMetaSchema(),
  },
});

export default defineConfig({
  lastModifiedTime: 'none',
  mdxOptions: {
    providerImportSource: '@/components/mdx-components',
    // disable remark-image's default behavior, use remote URL for all images
    remarkImageOptions: false,
    rehypeCodeOptions: {
      lazy: true,
      experimentalJSEngine: true,
      inline: 'tailing-curly-colon',
      themes: {
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
      },
      transformers: [
        // 1. Custom Transformer, add data-language from this.options.lang
        {
          name: 'transformer:parse-code-language', 
          pre(this: TransformerContext | any, preNode: Element) { 
            // For debugging, uncomment the following line to see the complete structure of this.options:
            // console.log('[Transformer] this.options:', JSON.stringify(this.options, null, 2));
            
            const languageFromOptions = this.options?.lang as string | undefined;

            if (languageFromOptions && typeof languageFromOptions === 'string' && languageFromOptions.trim() !== '') {
              if (!preNode.properties) {
                preNode.properties = {};
              }
              const langLower = languageFromOptions.toLowerCase();
              preNode.properties['data-language'] = langLower;
            }
            return preNode; // Ensure the processed node is returned
          }
        },
        // 2. Fumadocs's default Transformers
        // /core/src/mdx-plugins/rehype-code.ts, defines: line highlight, word highlight, Diff highlight, code focus, parse code line number from metadata
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        // 3. Your existing transformer
        {
          name: 'transformers:remove-notation-escape',
          code(hast) {
            for (const line of hast.children) {
              if (line.type !== 'element') continue;

              const lastSpan = line.children.findLast(
                (v) => v.type === 'element',
              );

              const head = lastSpan?.children[0];
              if (head?.type !== 'text') continue;

              head.value = head.value.replace(/\[\\!code/g, '[!code');
            }
          },
        },
      ],
    },
    // packages/core/src/server/get-toc.ts, remark().use(remarkPlugins).use(remarkHeading)
    // About the processing of the directory heading, FumaDocs has already specified the order: the user-specified remarkPlugins are executed first, then remarkHeading is executed, and finally the logic of toc-clerk.tsx is called by the rendering Page
    remarkPlugins: [
      remarkSteps,
      remarkMath, 
      remarkAutoTypeTable,
      [remarkInstall, remarkInstallOptions],
      [remarkDocGen, { generators: [fileGenerator()] }],
      remarkTypeScriptToJavaScript,
    ],
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});
import {
  GradientButton,
  ImageGrid,
  ImageZoom,
  Mermaid,
  TrophyCard,
  ZiaCard,
  ZiaFile,
  ZiaFolder,
} from "@windrun-huaiin/third-ui/fuma/mdx";
import { createGenerator as createTypeTableGenerator } from "fumadocs-typescript";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Callout } from "fumadocs-ui/components/callout";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Files } from "fumadocs-ui/components/files";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents, MDXProps } from "mdx/types";

import { appConfig } from "@/lib/appConfig";
import { globalLucideIcons as icons } from "@windrun-huaiin/base-ui/components/server";

// create a mapping from language identifier to icon component
const languageToIconMap: Record<string, React.ReactNode> = {
  css: <icons.CSS />,
  csv: <icons.CSV />,
  diff: <icons.Diff />,
  html: <icons.Html />,
  http: <icons.Http />,
  java: <icons.Java />,
  json: <icons.Json />,
  jsonc: <icons.SquareDashedBottomCode />,
  log: <icons.Log />,
  mdx: <icons.MDX />,
  regex: <icons.Regex />,
  sql: <icons.SQL />,
  text: <icons.Txt />,
  txt: <icons.Txt />,
  plaintext: <icons.Txt />,
  scheme: <icons.Scheme />,
  xml: <icons.XML />,
  yaml: <icons.Yaml />,
  yml: <icons.Yaml />,
};

// source.config.ts custom transformer:parse-code-language, used together
function tryToMatchIcon(
  props: Readonly<MDXProps & { "data-language"?: string; title?: string }>, // explicitly define props type
  iconMap: Record<string, React.ReactNode>
): React.ReactNode | undefined {
  let lang: string | undefined;

  // 1. get data-language from props first
  const dataLanguage = props["data-language"] as string | undefined;

  if (dataLanguage && dataLanguage.trim() !== "") {
    lang = dataLanguage.trim().toLowerCase();
  } else {
    // 2. if data-language is not available, fallback to parse from title
    const title = props.title as string | undefined;
    if (title) {
      const titleParts = title.split(".");
      // ensure the file name part is not empty (e.g. ".css" is invalid)
      if (titleParts.length > 1 && titleParts[0] !== "") {
        const extension = titleParts.pop()?.toLowerCase();
        if (extension) {
          lang = extension;
        }
      }
    }
  }
  let customIcon: React.ReactNode | undefined;
  if (lang && iconMap[lang]) {
    customIcon = iconMap[lang];
  }
  return customIcon;
}

// Object containing globally available Fumadocs UI components
const fumadocsUiComponents = {
  Callout,
  CodeBlock,
  Files,
  Accordion,
  Accordions,
  Tab,
  Tabs,
  Pre,
  TypeTable,
};

const customUiComponents = {
  TrophyCard,
  ZiaCard,
  GradientButton,
  ZiaFile,
  ZiaFolder,
};

const typeTableGenerator = createTypeTableGenerator();

// here is only the rendering layer processing, rendering HAST to React components, i.e. HTML code
export function getMDXComponents(
  components?: MDXComponents,
): MDXComponents {
  return {
    ...defaultMdxComponents,
    pre: (props) => {
      const customIcon = tryToMatchIcon(props, languageToIconMap);
      return (
        <CodeBlock
          {...props} // expand original props (contains Shiki's props.icon)
          {...(customIcon && { icon: customIcon })} // conditionally override icon
        >
          <Pre>{props.children}</Pre>
        </CodeBlock>
      );
    },
    AutoTypeTable: (props) => (
      <AutoTypeTable {...props} generator={typeTableGenerator} />
    ),
    // global image zoom processing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    img: (props) => <ImageZoom {...(props as any)} />,
    // global Mermaid component
    Mermaid: (props) => (
      <Mermaid
        {...props}
        watermarkEnabled={appConfig.style.watermark.enabled}
        watermarkText={appConfig.style.watermark.text}
      />
    ),
    // global
    ImageGrid: (props) => (
      <ImageGrid {...props} cdnBaseUrl={appConfig.style.cdnBaseUrl} />
    ),
    // 全局配置的 ImageZoom 组件
    ImageZoom: (props) => (
      <ImageZoom {...props} fallbackSrc={appConfig.style.placeHolder.image} />
    ),
    ...fumadocsUiComponents,
    ...customUiComponents,
    // use icons from the unified icon library of the project
    ...icons,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;

declare module 'html-to-image' {
  type HtmlToImageOptions = {
    quality?: number;
    bgcolor?: string;
    cacheBust?: boolean;
    width?: number;
    height?: number;
    pixelRatio?: number;
    scale?: number;
    filter?: (node: HTMLElement) => boolean;
    style?: Record<string, string>;
    skipFonts?: boolean;
  };

  export function toPng(node: HTMLElement, options?: HtmlToImageOptions): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: HtmlToImageOptions): Promise<string>;
  export function toSvg(node: HTMLElement, options?: HtmlToImageOptions): Promise<string>;

  export function toBlob(node: HTMLElement, options?: HtmlToImageOptions): Promise<Blob>;
  export function toCanvas(node: HTMLElement, options?: HtmlToImageOptions): Promise<HTMLCanvasElement>;
  export function toPixelData(node: HTMLElement, options?: HtmlToImageOptions): Promise<Uint8ClampedArray>;
  export function toJpegBlob(node: HTMLElement, options?: HtmlToImageOptions): Promise<Blob>;
  export function toPngBlob(node: HTMLElement, options?: HtmlToImageOptions): Promise<Blob>;
  export function toSvgBlob(node: HTMLElement, options?: HtmlToImageOptions): Promise<Blob>;
}

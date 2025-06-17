/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'dom-to-image-more' {
  export function toPng(node: HTMLElement, options?: any): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: any): Promise<string>;
  export function toSvg(node: HTMLElement, options?: any): Promise<string>;
  
  export function toBlob(node: HTMLElement, options?: any): Promise<Blob>;
  export function toCanvas(node: HTMLElement, options?: any): Promise<HTMLCanvasElement>;
  export function toPixelData(node: HTMLElement, options?: any): Promise<Uint8ClampedArray>;
  export function toJpegBlob(node: HTMLElement, options?: any): Promise<Blob>;
  export function toPngBlob(node: HTMLElement, options?: any): Promise<Blob>;
  export function toSvgBlob(node: HTMLElement, options?: any): Promise<Blob>;
} 
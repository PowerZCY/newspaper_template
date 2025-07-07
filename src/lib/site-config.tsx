import React from 'react';
import { LucideProps } from 'lucide-react';
import Image from 'next/image';

export const SiteIcon = iconFromSVG(
  '/news-icon.svg',
  'Newspaper',
  24,
  24
);


// Helper function to create SVG-based icon components, now accepting LucideProps
function iconFromSVG(
  src: string,
  alt: string,
  defaultIconWidth?: number, // Optional: default width for this specific icon type
  defaultIconHeight?: number // Optional: default height for this specific icon type
): (props: LucideProps) => React.ReactElement {
  const SvgIconComponent = (props: LucideProps): React.ReactElement => {
    // Fallback dimensions if no defaults are provided to iconFromSVG
    const fallbackWidth = 18;
    const fallbackHeight = 18;

    let width: number;
    let height: number;

    // Priority:
    // 1. props.size (if number)
    // 2. defaultIconWidth/Height from iconFromSVG call
    // 3. Fallback (18x18)
    if (typeof props.size === 'number') {
      width = props.size;
      height = props.size;
    } else {
      width = defaultIconWidth ?? fallbackWidth;
      // If defaultIconHeight is not given, use defaultIconWidth if available, otherwise fallbackHeight
      height = defaultIconHeight ?? defaultIconWidth ?? fallbackHeight;
    }
    
    // className is purely from props. No default "size-4.5" anymore from here.
    const imageClassName = props.className || ''; 

    return (
      <Image
        src={src}
        alt={alt}
        className={imageClassName}
        width={width}  // Use the determined width
        height={height} // Use the determined height
      />
    );
  };
  SvgIconComponent.displayName = `SvgIcon(${alt.replace(/\s+/g, '_')})`;
  return SvgIconComponent;
}
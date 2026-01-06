import { alexBrush, quicksand, engravers, adorable, montserrat } from '@/lib/fonts';
import { cn } from '@windrun-huaiin/lib/utils';
import Image from "next/image";
import React from "react";
import { AIEditable } from "../ai-editable";
import { FontToolbar } from "./FontToolbar";

// Extend the font options
type EnglishFontKey = 'alexBrush' | 'quicksand' | 'engravers' | 'adorable' | 'montserrat';

const fontMap = {
  alexBrush,
  quicksand,
  engravers,
  adorable,
  montserrat,
};

// Define the content structure for Song Poster
export interface NewspaperSongEnglishContent {
  headerLeft?: string;
  headerRight?: string;
  headline: string; // Song Name
  subTitle: string; // Artist
  subTitleText?: string; // Info list
  lyrics: string;   // The main lyrics text
  sideText: string; // Description (Right Col)
  footerText: string; // Copyright or studio

  // Font preferences
  headlineFont?: EnglishFontKey;
  subTitleFont?: EnglishFontKey;
  lyricsFont?: EnglishFontKey;
  sideTextFont?: EnglishFontKey;
  subTitleTextFont?: EnglishFontKey;
  headerLeftFont?: EnglishFontKey;
  headerRightFont?: EnglishFontKey;

  // Font sizes (px)
  headlineSize?: number;
  subTitleSize?: number;
  lyricsSize?: number;
  sideTextSize?: number;
  subTitleTextSize?: number;
}

interface NewspaperSongEnglishProps {
  mainImg: string;
  flowers: string;
  onMainImgChange: (file: File) => void;
  onTriggerImgUpload: (key: string, cb: (file: File) => void) => void;

  content: NewspaperSongEnglishContent;
  onContentChange: (key: string, value: string | number) => void;
}

export const NewspaperSongEnglish: React.FC<NewspaperSongEnglishProps> = ({
  mainImg,
  flowers,
  onMainImgChange,
  onTriggerImgUpload,
  content,
  onContentChange,
}) => {
  const seqIdPrefix = "song_en";

  // Helper to toggle fonts
  const toggleFont = (field: 'headlineFont' | 'lyricsFont' | 'subTitleFont' | 'sideTextFont' | 'subTitleTextFont' | 'headerLeftFont' | 'headerRightFont', current: EnglishFontKey | undefined) => {
    const sequence: EnglishFontKey[] = ['alexBrush', 'quicksand', 'engravers', 'adorable', 'montserrat'];
    const idx = sequence.indexOf(current || 'alexBrush');
    const next = sequence[(idx + 1) % sequence.length];
    onContentChange(field, next);
  };

  const getFontClass = (key: EnglishFontKey | undefined) => {
    return fontMap[key || 'alexBrush'].className;
  };

  const getFontName = (key: EnglishFontKey | undefined) => {
    const map: Record<string, string> = {
      alexBrush: 'AlexBrush',
      quicksand: 'Quicksand',
      engravers: 'Engravers',
      adorable: 'Adorable',
      montserrat: 'Montserrat',
    };
    return map[key || 'alexBrush'];
  };

  // Helper to change size
  const changeSize = (field: 'headlineSize' | 'subTitleSize' | 'lyricsSize' | 'sideTextSize' | 'subTitleTextSize', current: number | undefined, delta: number) => {
    const defaultSize = field === 'headlineSize' ? 48 : field === 'subTitleSize' ? 24 : field === 'lyricsSize' ? 24 : field === 'sideTextSize' ? 14 : 12;
    const val = current || defaultSize;
    onContentChange(field, Math.max(10, val + delta));
  };

  return (
    <div className={cn("newspaper-bg flex flex-col gap-0 relative overflow-hidden text-neutral-900", montserrat.className)} 
         style={{ background: "#f5f5e5", width: '100%', padding: '4px' }}>
      
      {/* Header Area */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          width: '100%',
          marginBottom: '4px',
          position: 'relative',
          zIndex: 10
        }}
      >
        <AIEditable
          seqId={`${seqIdPrefix}_headerLeft`}
          value={content.headerLeft || "Traditional"}
          onChange={val => onContentChange("headerLeft", val)}
          className={cn("editable text-xs text-neutral-700", getFontClass(content.headerLeftFont || 'quicksand'))}
          style={{
            width: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            alignSelf: 'flex-end',
            textAlign: 'left',
            flex: 'none'
          }}
          type="title"
          disableAI={true}
        />
        <div style={{ flex: '1 1 0', display: 'flex', justifyContent: 'center' }}>
          <Image
            src={flowers}
            alt="Flowers"
            width={82}
            height={30}
            style={{ display: 'block', margin: '0 16px', height: '30px', alignSelf: 'center' }}
            className="pointer-events-none opacity-80"
          />
        </div>
        <AIEditable
          seqId={`${seqIdPrefix}_headerRight`}
          value={content.headerRight || "Music Poster"}
          onChange={val => onContentChange("headerRight", val)}
          className={cn("editable text-xs text-neutral-700", getFontClass(content.headerRightFont || 'quicksand'))}
          style={{
            width: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            alignSelf: 'flex-end',
            textAlign: 'right',
            flex: 'none'
          }}
          type="title"
          disableAI={true}
        />
      </div>

      {/* Top Dividers */}
      <div className="newspaper-divider newspaper-divider-thin w-full mb-1"></div>
      
      {/* Headline Area */}
      <div className="flex flex-col items-center justify-center mb-0 relative z-10 w-full">
        {/* Headline */}
        <div className="relative group w-full text-center py-2 pr-8">
            <AIEditable
                seqId={`${seqIdPrefix}_headline`}
                value={content.headline}
                onChange={val => onContentChange("headline", val)}
                className={cn(
                "editable w-full block text-center leading-tight",
                getFontClass(content.headlineFont)
                )}
                disableAI={true}
                style={{ 
                    fontWeight: 500, 
                    color: '#333',
                    fontSize: content.headlineSize ? `${content.headlineSize}px` : (content.headline.length < 5 ? '3.75rem' : '3rem') 
                }}
            />
            {/* Headline: Right side toolbar */}
            <FontToolbar 
                className="right-0 top-1/2 -translate-y-1/2"
                orientation="vertical"
                label="Font"
                fontName={getFontName(content.headlineFont)}
                fontSize={content.headlineSize}
                onToggle={() => toggleFont('headlineFont', content.headlineFont)}
                onInc={() => changeSize('headlineSize', content.headlineSize, 2)}
                onDec={() => changeSize('headlineSize', content.headlineSize, -2)}
            />
        </div>

        {/* Divider below Headline */}
        <div className="newspaper-divider newspaper-divider-thick w-full"></div>
        <div className="newspaper-divider newspaper-divider-thick w-full mt-0.5"></div>
      </div>

      {/* Main Content: Lyrics Area */}
      <div className="relative w-full p-2 shadow-inner border border-stone-200 group mb-0" style={{ minHeight: '250px', backgroundColor: 'transparent' }}>
          <div className="absolute inset-0 pointer-events-none opacity-20" 
              style={{
                  backgroundImage: 'linear-gradient(transparent 95%, #999 96%)',
                  backgroundSize: '100% 30px'
              }}>
          </div>

          <FontToolbar 
            className="bottom-2 left-2"
            orientation="vertical"
            label="Font"
            fontName={getFontName(content.lyricsFont)}
            fontSize={content.lyricsSize}
            onToggle={() => toggleFont('lyricsFont', content.lyricsFont)}
            onInc={() => changeSize('lyricsSize', content.lyricsSize, 2)}
            onDec={() => changeSize('lyricsSize', content.lyricsSize, -2)}
          />
          
          <div className="w-full h-full flex items-center justify-center" style={{ padding: '4px 0' }}>
              <AIEditable
                seqId={`${seqIdPrefix}_lyrics`}
                value={content.lyrics}
                onChange={val => onContentChange("lyrics", val)}
                className={cn(
                    "editable leading-relaxed", 
                    getFontClass(content.lyricsFont)
                )}
                style={{
                    textAlign: 'center',
                    fontSize: content.lyricsSize ? `${content.lyricsSize}px` : '1.5rem',
                    letterSpacing: '0.02em',
                    width: '100%',
                    whiteSpace: 'pre-wrap'
                }}
                disableAI={true}
             />
          </div>
      </div>

      {/* Bottom Section: 3-Column Grid */}
      <div className="w-full mb-2">
        <div className="newspaper-divider newspaper-divider-medium w-full mb-1"></div>
        <div className="grid grid-cols-3 gap-2 w-full pt-1">
          
          {/* Left: Subtitle & SubTitleText */}
          <div className="flex flex-col pr-2">
              {/* Subtitle */}
              <div className="relative group w-full mb-2 pr-2">
                <AIEditable
                    seqId={`${seqIdPrefix}_subTitle`}
                    value={content.subTitle}
                    onChange={val => onContentChange("subTitle", val)}
                    className={cn(
                        "editable tracking-widest text-neutral-800 font-bold text-lg pb-1 block",
                        getFontClass(content.subTitleFont || 'quicksand')
                    )}
                    disableAI={true}
                    style={{ fontSize: content.subTitleSize ? `${content.subTitleSize}px` : '24px' }}
                />
                <FontToolbar 
                    className="right-0 top-1/2 -translate-y-1/2" 
                    orientation="vertical"
                    label="Font"
                    fontName={getFontName(content.subTitleFont || 'quicksand')}
                    fontSize={content.subTitleSize}
                    onToggle={() => toggleFont('subTitleFont', content.subTitleFont)}
                    onInc={() => changeSize('subTitleSize', content.subTitleSize, 1)}
                    onDec={() => changeSize('subTitleSize', content.subTitleSize, -1)}
                />
                <div className="newspaper-divider newspaper-divider-medium w-full mt-2"></div>
              </div>
              
              {/* Info Text (subTitleText) */}
              <div className="relative group pr-2">
                  <AIEditable
                    seqId={`${seqIdPrefix}_subTitleText`}
                    value={content.subTitleText || "Credits info..."}
                    onChange={val => onContentChange("subTitleText", val)}
                    className={cn(
                        "editable leading-loose text-neutral-700", 
                        getFontClass(content.subTitleTextFont || 'quicksand')
                    )}
                    disableAI={true}
                    style={{ fontSize: content.subTitleTextSize ? `${content.subTitleTextSize}px` : '12px' }}
                  />
                  <FontToolbar 
                    className="right-0 top-0" 
                    orientation="vertical"
                    label="Font"
                    fontName={getFontName(content.subTitleTextFont || 'quicksand')}
                    fontSize={content.subTitleTextSize}
                    onToggle={() => toggleFont('subTitleTextFont', content.subTitleTextFont)}
                    onInc={() => changeSize('subTitleTextSize', content.subTitleTextSize, 1)}
                    onDec={() => changeSize('subTitleTextSize', content.subTitleTextSize, -1)}
                />
              </div>
          </div>

          {/* Middle: Image Column */}
          <div className="flex flex-col items-center justify-center px-2">
              <div 
                className="relative group w-full aspect-3/4 cursor-pointer overflow-hidden shadow-sm"
                onClick={() => onTriggerImgUpload('mainImg', onMainImgChange)}
              >
                <Image
                  src={mainImg}
                  alt="Cover Art"
                  fill
                  className="object-cover select-none"
                  unoptimized={mainImg.startsWith('data:')}
                />
                <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap" style={{ writingMode: 'horizontal-tb' }}>
                  Edit
                </div>
              </div>
          </div>

          {/* Right: Side Text */}
          <div className="relative group flex flex-col justify-start pl-2">
              <AIEditable
                seqId={`${seqIdPrefix}_sideText`}
                value={content.sideText || "Song description..."}
                onChange={val => onContentChange("sideText", val)}
                className={cn(
                    "editable leading-relaxed text-neutral-600 text-justify",
                    getFontClass(content.sideTextFont || 'quicksand')
                )}
                disableAI={true}
                style={{ fontSize: content.sideTextSize ? `${content.sideTextSize}px` : '14px' }}
              />
              <FontToolbar 
                  className="right-0 top-0" 
                  orientation="vertical"
                  label="Font"
                  fontName={getFontName(content.sideTextFont || 'quicksand')}
                  fontSize={content.sideTextSize}
                  onToggle={() => toggleFont('sideTextFont', content.sideTextFont)}
                  onInc={() => changeSize('sideTextSize', content.sideTextSize, 1)}
                  onDec={() => changeSize('sideTextSize', content.sideTextSize, -1)}
              />
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 text-center">
         <div className="newspaper-divider newspaper-divider-thin w-full mb-2" style={{ backgroundColor: '#d6d3d1' }}></div>
         <AIEditable
            seqId={`${seqIdPrefix}_footerText`}
            value={content.footerText}
            onChange={val => onContentChange("footerText", val)}
            className={cn("editable text-[10px] text-blue-400", quicksand.className)}
            disableAI={true}
        />
      </div>
    </div>
  );
};

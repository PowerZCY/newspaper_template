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
  montserrat
};

// Define the content structure for Song Poster
export interface NewspaperSongEnglishContent {
  headline: string; // Song Name
  subTitle: string; // Artist
  lyrics: string;   // The main lyrics text
  sideText: string; // Release Date / Label
  footerText: string; // Credits
  
  // Font preferences
  headlineFont?: EnglishFontKey;
  lyricsFont?: EnglishFontKey;

  // Font sizes (px)
  headlineSize?: number;
  subTitleSize?: number;
  lyricsSize?: number;
}

interface NewspaperSongEnglishProps {
  mainImg: string;
  onMainImgChange: (file: File) => void;
  content: NewspaperSongEnglishContent;
  onContentChange: (key: string, value: string | number) => void;
  onTriggerImgUpload: (key: string, cb: (file: File) => void) => void;
}

export const NewspaperSongEnglish: React.FC<NewspaperSongEnglishProps> = ({
  mainImg,
  onMainImgChange,
  onTriggerImgUpload,
  content,
  onContentChange,
}) => {
  const seqIdPrefix = "song_en";

  // Helper to toggle fonts
  const toggleFont = (field: 'headlineFont' | 'lyricsFont', current: EnglishFontKey | undefined) => {
    const sequence: EnglishFontKey[] = ['alexBrush', 'engravers', 'adorable', 'quicksand', 'montserrat'];
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
          engravers: 'Engravers', 
          adorable: 'Adorable', 
          quicksand: 'Quicksand', 
          montserrat: 'Montserrat' 
      };
      return map[key || 'alexBrush'];
  };

  // Helper to change size
  const changeSize = (field: 'headlineSize' | 'subTitleSize' | 'lyricsSize', current: number | undefined, delta: number) => {
    const val = current || (field === 'headlineSize' ? 60 : field === 'subTitleSize' ? 18 : 20);
    onContentChange(field, Math.max(12, val + delta));
  };

  return (
    <div className={cn("newspaper-bg flex flex-col relative overflow-hidden text-neutral-900", montserrat.className)} 
         style={{ background: "#f5f5e5", width: '100%', padding: '30px', minHeight: '800px' }}>
      
      {/* Top Section: Title & Artist */}
      <div className="flex flex-col items-center justify-center mb-8 relative z-10">
        <div className="w-full mb-4" style={{ borderBottom: '2px solid black' }}></div>
        
        {/* Headline */}
        <div className="relative group w-full text-center py-2">
            <AIEditable
                seqId={`${seqIdPrefix}_headline`}
                value={content.headline}
                onChange={val => onContentChange("headline", val)}
                className={cn(
                    "editable w-full block text-center leading-none text-neutral-900",
                    getFontClass(content.headlineFont)
                )}
                style={{ fontSize: content.headlineSize ? `${content.headlineSize}px` : (content.headline.length < 10 ? '4.5rem' : '3.75rem') }}
                disableAI={true}
            />
             <FontToolbar 
                className="right-0 top-1/2 -translate-y-1/2"
                fontName={getFontName(content.headlineFont)}
                fontSize={content.headlineSize}
                theme="dark"
                onToggle={() => toggleFont('headlineFont', content.headlineFont)}
                onInc={() => changeSize('headlineSize', content.headlineSize, 2)}
                onDec={() => changeSize('headlineSize', content.headlineSize, -2)}
            />
        </div>

        {/* Subtitle */}
        <div className="relative group flex items-center justify-center gap-4 mt-2">
            <span className="block" style={{ height: '1px', width: '3rem', backgroundColor: 'black' }}></span>
            <AIEditable
            seqId={`${seqIdPrefix}_subTitle`}
            value={content.subTitle}
            onChange={val => onContentChange("subTitle", val)}
            className="editable text-lg tracking-[0.2em] uppercase font-bold text-center"
            disableAI={true}
            style={{ fontSize: content.subTitleSize ? `${content.subTitleSize}px` : '1.125rem' }}
            />
            <span className="block" style={{ height: '1px', width: '3rem', backgroundColor: 'black' }}></span>
             
             <FontToolbar 
                className="-right-24 top-0"
                label="Size"
                fontSize={content.subTitleSize}
                theme="dark"
                onToggle={() => {}} 
                onInc={() => changeSize('subTitleSize', content.subTitleSize, 1)}
                onDec={() => changeSize('subTitleSize', content.subTitleSize, -1)}
            />
        </div>
      </div>

      {/* Middle Section: Image & Lyrics */}
      <div className="flex flex-col md:flex-row gap-8 flex-1">
          {/* Image Area (Top/Left) */}
          <div className="md:w-1/2 flex flex-col gap-4">
              <div 
                className="relative group w-full aspect-square cursor-pointer overflow-hidden shadow-sm"
                style={{ border: '1px solid #e5e5e5' }} // border-neutral-200 -> #e5e5e5
                onClick={() => onTriggerImgUpload('mainImg', onMainImgChange)}
              >
                 <Image
                  src={mainImg}
                  alt="Cover"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  unoptimized={mainImg.startsWith('data:')}
                />
                 <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="bg-white px-3 py-1 text-xs uppercase tracking-widest">Change Image</span>
                 </div>
              </div>

              {/* Meta Data */}
               <div className="pt-2 mt-auto" style={{ borderTop: '1px solid black' }}>
                    <AIEditable
                        seqId={`${seqIdPrefix}_sideText`}
                        value={content.sideText}
                        onChange={val => onContentChange("sideText", val)}
                        className="editable text-xs font-mono text-neutral-500 text-justify"
                        disableAI={true}
                    />
               </div>
          </div>

          {/* Lyrics Area (Bottom/Right) */}
          <div className="md:w-1/2 relative group p-6 shadow-[2px_2px_0px_rgba(0,0,0,1)]" style={{ border: '1px solid black' }}>
               {/* Notebook Lines Background */}
               <div className="absolute inset-0 pointer-events-none opacity-10" 
                    style={{
                        backgroundImage: 'linear-gradient(transparent 95%, #000 96%)',
                        backgroundSize: '100% 2rem',
                        marginTop: '0.5rem' // Align lines
                    }}>
               </div>

                <FontToolbar 
                    className="top-2 right-2"
                    fontName={getFontName(content.lyricsFont)}
                    fontSize={content.lyricsSize}
                    theme="dark"
                    onToggle={() => toggleFont('lyricsFont', content.lyricsFont)}
                    onInc={() => changeSize('lyricsSize', content.lyricsSize, 2)}
                    onDec={() => changeSize('lyricsSize', content.lyricsSize, -2)}
                />

               <AIEditable
                    seqId={`${seqIdPrefix}_lyrics`}
                    value={content.lyrics}
                    onChange={val => onContentChange("lyrics", val)}
                    className={cn(
                        "editable w-full h-full leading-8", 
                        getFontClass(content.lyricsFont)
                    )}
                    style={{
                         whiteSpace: 'pre-wrap',
                         fontSize: content.lyricsSize ? `${content.lyricsSize}px` : '1.25rem'
                    }}
                    disableAI={true}
                />
          </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center pt-4" style={{ borderTop: '1px solid black' }}>
           <AIEditable
                seqId={`${seqIdPrefix}_footerText`}
                value={content.footerText}
                onChange={val => onContentChange("footerText", val)}
                className="editable text-[10px] uppercase tracking-[0.4em]"
                disableAI={true}
            />
      </div>
    </div>
  );
};

import { globalLucideIcons as icons } from "@/components/global-icon";
import { adorable, montserrat } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import Image from "next/image";
import React from "react";
import { AIEditable } from '@/components/ai-editable';
import { AIEditableProvider } from '@/components/AIEditableContext';

interface NewspaperSimpleProps {
  mainImg: string;
  sideImg: string;
  bottomImg: string;
  onMainImgChange: (file: File) => void;
  onSideImgChange: (file: File) => void;
  onBottomImgChange: (file: File) => void;
  onTriggerImgUpload: (key: string, cb: (file: File) => void) => void;
  content: {
    edition: string;
    headline: string;
    title: string;
    mainText: string;
    sideTitle: string;
    sideDesc: string;
    bottomTitle: string;
    bottomDesc: string;
    footer: string;
  };
  onContentChange: (key: keyof NewspaperSimpleProps["content"], value: string) => void;
}

export const NewspaperSimple: React.FC<NewspaperSimpleProps> = ({
  mainImg,
  sideImg,
  bottomImg,
  onMainImgChange,
  onSideImgChange,
  onBottomImgChange,
  onTriggerImgUpload,
  content,
  onContentChange,
}) => {
  return (
    <AIEditableProvider>
      <div className={cn("newspaper-bg flex flex-col gap-0", montserrat.className)} style={{ background: "#f5f5e5" }}>
        {/* Top area */}
        <AIEditable
          value={content.edition}
          onChange={val => onContentChange("edition", val)}
          className="editable text-center text-base text-neutral-700 mt-2 mb-1 tracking-wide whitespace-nowrap"
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 640, margin: '0 auto' }}
          aiPromptDefault=""
          aiMaxChars={40}
        />
        <div className="newspaper-divider" style={{borderTop:'2px solid #222', width:'100%'}}></div>
        <AIEditable
          value={content.headline}
          onChange={val => onContentChange("headline", val)}
          className={cn("editable text-center text-[2.8rem] md:text-6xl font-extrabold tracking-[0.14em] text-neutral-900 leading-tight", adorable.className)}
          style={{ fontWeight: 600 }}
          aiPromptDefault=""
          aiMaxChars={40}
        />
        <div className="newspaper-divider" style={{borderTop:'2px solid #222', width:'100%'}}></div>
        <div className="newspaper-divider" style={{borderTop:'4px solid #222', width:'100%', marginTop:'2px', marginBottom:'8px'}}></div>
        {/* Main area */}
        <div className="flex flex-row w-full min-h-[320px] gap-0 relative" style={{paddingBottom: '5px'}}>
          {/* Left column 2/3 */}
          <div className="w-2/3 pr-6 flex flex-col justify-start">
            {/* Row 1: Big image */}
            <div className="mb-2">
              <div className="relative group w-full">
                <Image
                  src={mainImg}
                  alt="Main image"
                  width={700}
                  height={400}
                  priority={false}
                  className="img-shadow w-full h-[400px] object-cover select-none"
                  unoptimized={mainImg.startsWith('data:')}
                />
                <button type="button" className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded shadow hover:bg-purple-100 transition flex items-center justify-center opacity-0 group-hover:opacity-100 z-10" onClick={e => { e.stopPropagation(); onTriggerImgUpload('mainImg', onMainImgChange); }}>
                  <icons.Replace className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>
            {/* Row 2: Big title */}
            <AIEditable
              value={content.title}
              onChange={val => onContentChange("title", val)}
              className="editable mb-1 text-xl font-extrabold tracking-wide text-neutral-900"
              aiPromptDefault=""
              aiMaxChars={20}
            />
            {/* Row 3: Main text (AIEditable) */}
            <AIEditable
              value={content.mainText}
              onChange={val => onContentChange("mainText", val)}
              className="editable text-[0.95rem] text-neutral-900 leading-relaxed"
              aiPromptDefault=""
              aiMaxChars={500}
            />
          </div>
          {/* Vertical divider */}
          <div className="h-auto absolute newspaper-divider" style={{borderLeft:'2px solid #222', height:'100%', left:'66.6667%', top:0, bottom:0}}></div>
          {/* Right column 1/3 */}
          <div className="w-1/3 pl-6 flex flex-col justify-start">
            {/* Row 1: Small title */}
            <AIEditable
              value={content.sideTitle}
              onChange={val => onContentChange("sideTitle", val)}
              className="editable text-xs font-bold tracking-wide leading-tight mb-1 text-neutral-900"
              aiPromptDefault=""
              aiMaxChars={30}
            />
            {/* Row 2: Vertical image */}
            <div className="mb-1">
              <div className="relative group w-full">
                <Image
                  src={sideImg}
                  alt="Side image"
                  width={700}
                  height={200}
                  className="img-shadow w-full h-[200px] object-cover select-none"
                  unoptimized={sideImg.startsWith('data:')}
                />
                <button type="button" className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded shadow hover:bg-purple-100 transition flex items-center justify-center opacity-0 group-hover:opacity-100 z-10" onClick={e => { e.stopPropagation(); onTriggerImgUpload('sideImg', onSideImgChange); }}>
                  <icons.Replace className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>
            {/* Row 3: Description */}
            <AIEditable
              value={content.sideDesc}
              onChange={val => onContentChange("sideDesc", val)}
              className="editable text-[0.95rem] text-neutral-700 leading-snug mb-1"
              aiPromptDefault=""
              aiMaxChars={300}
            />
            <div className="newspaper-divider" style={{borderTop:'2px solid #222', width:'100%', marginTop:'25px', marginBottom:'5px'}}></div>
            {/* Row 5: Small title + horizontal image */}
            <AIEditable
              value={content.bottomTitle}
              onChange={val => onContentChange("bottomTitle", val)}
              className="editable text-xs font-bold tracking-wide leading-tight mb-1 text-neutral-900"
              aiPromptDefault=""
              aiMaxChars={30}
            />
            <div>
              <div className="relative group w-full">
                <Image
                  src={bottomImg}
                  alt="Bottom image"
                  width={700}
                  height={200}
                  className="img-shadow w-full h-[200px] object-cover select-none"
                  unoptimized={bottomImg.startsWith('data:')}
                />
                <button type="button" className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded shadow hover:bg-purple-100 transition flex items-center justify-center opacity-0 group-hover:opacity-100 z-10" onClick={e => { e.stopPropagation(); onTriggerImgUpload('bottomImg', onBottomImgChange); }}>
                  <icons.Replace className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>
            <AIEditable
              value={content.bottomDesc}
              onChange={val => onContentChange("bottomDesc", val)}
              className="editable text-[0.95rem] text-neutral-700 leading-snug mb-1"
              aiPromptDefault=""
              aiMaxChars={300}
            />
          </div>
        </div>
        <div className="newspaper-divider" style={{borderTop:'2px solid #222', width:'100%', marginTop:'25px', marginBottom:'5px'}}></div>
        <AIEditable
          value={content.footer}
          onChange={val => onContentChange("footer", val)}
          className="editable text-xs text-neutral-700 text-center tracking-widest uppercase mb-1"
          aiPromptDefault=""
          aiMaxChars={100}
        />
      </div>
    </AIEditableProvider>
  );
}; 
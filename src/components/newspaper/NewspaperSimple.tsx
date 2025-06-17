import React, { useRef } from "react";
import Image from "next/image";
import { globalLucideIcons as icons } from "@/components/global-icon";

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
  const mainImgInput = useRef<HTMLInputElement>(null);
  const sideImgInput = useRef<HTMLInputElement>(null);
  const bottomImgInput = useRef<HTMLInputElement>(null);

  return (
    <div className="newspaper-bg flex flex-col gap-0" style={{ background: "#f5f5e5", fontFamily: 'MontserratRegular, sans-serif' }}>
      {/* 顶部区 */}
      <div
        contentEditable
        suppressContentEditableWarning
        className="editable text-center text-base text-neutral-700 mt-2 mb-1 tracking-wide whitespace-nowrap"
        style={{whiteSpace: 'nowrap'}}
        onBlur={e => onContentChange("edition", e.currentTarget.innerText)}
        >{content.edition}</div>
      <div className="newspaper-divider" style={{borderTop:'2px solid #222', width:'100%'}}></div>
      <div
        contentEditable
        suppressContentEditableWarning
        className="editable text-center text-[2.8rem] md:text-6xl font-extrabold tracking-[0.14em] text-neutral-900 leading-tight"
        style={{ fontFamily: 'SuperAdorable,Times New Roman,serif', fontWeight: 600 }}
        onBlur={e => onContentChange("headline", e.currentTarget.innerText)}
      >{content.headline}</div>
      <div className="newspaper-divider" style={{borderTop:'2px solid #222', width:'100%'}}></div>
      <div className="newspaper-divider" style={{borderTop:'4px solid #222', width:'100%', marginTop:'2px', marginBottom:'8px'}}></div>
      {/* 主体区 */}
      <div className="flex flex-row w-full min-h-[320px] gap-0 relative" style={{paddingBottom: '5px'}}>
        {/* 左列 2/3 */}
        <div className="w-2/3 pr-6 flex flex-col justify-start">
          {/* 行1：大图 */}
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
          {/* 行2：大标题 */}
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable mb-1 text-xl font-extrabold tracking-wide text-neutral-900"
            onBlur={e => onContentChange("title", e.currentTarget.innerText)}
          >{content.title}</div>
          {/* 行3：正文 */}
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable text-base text-neutral-900 leading-relaxed"
            onBlur={e => onContentChange("mainText", e.currentTarget.innerText)}
          >{content.mainText}</div>
        </div>
        {/* 垂直分割线 */}
        <div className="h-auto absolute newspaper-divider" style={{borderLeft:'2px solid #222', height:'100%', left:'66.6667%', top:0, bottom:0}}></div>
        {/* 右列 1/3 */}
        <div className="w-1/3 pl-6 flex flex-col justify-start">
          {/* 行1：小标题 */}
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable text-xs font-bold tracking-wide leading-tight mb-1"
            onBlur={e => onContentChange("sideTitle", e.currentTarget.innerText)}
          >{content.sideTitle}</div>
          {/* 行2：竖图 */}
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
          {/* 行3：描述 */}
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable text-base text-neutral-700 leading-snug mb-2"
            onBlur={e => onContentChange("sideDesc", e.currentTarget.innerText)}
          >{content.sideDesc}</div>
          <div className="newspaper-divider" style={{borderTop:'2px solid #222', width:'100%', marginTop:'25px', marginBottom:'5px'}}></div>
          {/* 行5：小标题+横图 */}
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable text-xs font-bold tracking-wide leading-tight mb-1"
            onBlur={e => onContentChange("bottomTitle", e.currentTarget.innerText)}
          >{content.bottomTitle}</div>
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
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable text-base text-neutral-700 leading-snug mb-2"
            onBlur={e => onContentChange("bottomDesc", e.currentTarget.innerText)}
          >{content.bottomDesc}</div>
        </div>
      </div>
      <div className="newspaper-divider" style={{borderTop:'2px solid #222', width:'100%', marginTop:'25px', marginBottom:'5px'}}></div>
      <div
        contentEditable
        suppressContentEditableWarning
        className="editable text-xs text-neutral-700 text-center tracking-widest uppercase mb-1"
        onBlur={e => onContentChange("footer", e.currentTarget.innerText)}
      >{content.footer}</div>
    </div>
  );
}; 
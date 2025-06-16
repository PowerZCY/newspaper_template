import React, { useRef } from "react";
import Image from "next/image";
import { globalLucideIcons as icons } from "@/components/global-icon";

interface NewspaperModernProps {
  mainImg: string;
  img1: string;
  onMainImgChange: (file: File) => void;
  onImg1Change: (file: File) => void;
  content: {
    leftTop: string;
    rightTop: string;
    headline: string;
    subTitle: string;
    aboutTitle: string;
    aboutText: string;
    dateDay: string;
    dateMonth: string;
    dateAddr: string;
    dateTime: string;
    joinTitle: string;
    joinText: string;
  };
  onContentChange: (key: keyof NewspaperModernProps["content"], value: string) => void;
}

export const NewspaperModern: React.FC<NewspaperModernProps> = ({
  mainImg,
  img1,
  onMainImgChange,
  onImg1Change,
  content,
  onContentChange,
}) => {
  const mainImgInput = useRef<HTMLInputElement>(null);
  const img1Input = useRef<HTMLInputElement>(null);

  return (
    <div className="newspaper-bg flex flex-col gap-0" style={{ background: "#f5f5e5", fontFamily: 'MontserratRegular, sans-serif' }}>
      {/* 顶部区：三列flex布局，左右文字底部对齐，图片居中 */}
      <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', marginBottom: '4px'}}>
        <span
          contentEditable
          suppressContentEditableWarning
          className="editable text-xs text-neutral-700 whitespace-nowrap"
          style={{whiteSpace: 'nowrap', alignSelf: 'flex-end'}}
          onBlur={e => onContentChange("leftTop", e.currentTarget.innerText)}
        >{content.leftTop}</span>
        <Image src="/flowers.png" alt="Flowers" width={82} height={30} style={{display: 'block', margin: '0 16px', height: '30px', alignSelf: 'center'}} className="pointer-events-none" />
        <span
          contentEditable
          suppressContentEditableWarning
          className="editable text-xs text-neutral-700 whitespace-nowrap"
          style={{whiteSpace: 'nowrap', alignSelf: 'flex-end'}}
          onBlur={e => onContentChange("rightTop", e.currentTarget.innerText)}
        >{content.rightTop}</span>
      </div>
      <div style={{borderTop: '2px solid #222', width: '100%', marginBottom: '4px'}}></div>
      <div
        contentEditable
        suppressContentEditableWarning
        className="editable text-center text-[3.5rem] md:text-7xl font-black tracking-wide text-neutral-900 leading-tight mb-2.5 w-full flex items-center justify-center"
        style={{ fontFamily: 'EngraversOldEnglish,SuperAdorable,serif', fontWeight: 600, letterSpacing: '0.05em' }}
        onBlur={e => onContentChange("headline", e.currentTarget.innerText)}
      >{content.headline}</div>
      <div style={{borderTop:'4px solid #000', width:'100%', marginBottom:'2px'}}></div>
      <div style={{borderTop:'4px solid #000', width:'100%', marginBottom:'4px'}}></div>
      <div
        contentEditable
        suppressContentEditableWarning
        className="editable text-center text-lg tracking-[0.3em] uppercase mb-1 text-neutral-900"
        onBlur={e => onContentChange("subTitle", e.currentTarget.innerText)}
      >{content.subTitle}</div>
      <div style={{borderTop:'2px solid #222', width:'100%', marginBottom:'8px'}}></div>
      {/* 上半部分：左右结构 */}
      <div className="flex flex-row w-full mb-2 items-stretch">
        {/* 左：About me 30% */}
        <div className="flex flex-col justify-start" style={{ width: '35%', borderRight: '2px solid #222', paddingRight: '10px', marginRight: '10px' }}>
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable text-xl font-bold"
            style={{borderBottom:'3px solid #222', marginBottom:'8px', paddingBottom:'4px', color:'#222'}}
            onBlur={e => onContentChange("aboutTitle", e.currentTarget.innerText)}
          >{content.aboutTitle}</div>
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable text-base leading-relaxed flex-1 text-neutral-900"
            onBlur={e => onContentChange("aboutText", e.currentTarget.innerText)}
          >{content.aboutText}</div>
        </div>
        {/* 右：大竖图 70% */}
        <div className="flex flex-col items-center" style={{ width: '65%' }}>
          <div className="relative group w-full">
            <Image
              src={mainImg}
              alt="Main image"
              width={700}
              height={350}
              className="img-shadow w-full h-[350px] object-cover select-none"
              unoptimized={mainImg.startsWith('data:')}
            />
            <button type="button" className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded shadow hover:bg-purple-100 transition flex items-center justify-center opacity-0 group-hover:opacity-100 z-10" onClick={e => { e.stopPropagation(); mainImgInput.current?.click(); }}>
              <icons.Replace className="w-6 h-6 text-black" />
            </button>
            <input ref={mainImgInput} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) onMainImgChange(e.target.files[0]); }} />
          </div>
        </div>
      </div>
      {/* 横向分割线 */}
      <div style={{borderTop:'2px solid #222', width:'100%', marginTop: '4px', marginBottom:'4px'}}></div>
      {/* 下半部分：三列结构 */}
      <div className="grid grid-cols-3 gap-0 w-full" style={{marginBottom: '10px'}}>
        {/* 左：竖图 */}
        <div className="flex flex-col items-center justify-center pr-4">
          <div className="relative group w-full">
            <Image
              src={img1}
              alt="Side image"
              width={700}
              height={250}
              className="img-shadow w-full h-[250px] object-cover select-none"
              unoptimized={img1.startsWith('data:')}
            />
            <button type="button" className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded shadow hover:bg-purple-100 transition flex items-center justify-center opacity-0 group-hover:opacity-100 z-10" onClick={e => { e.stopPropagation(); img1Input.current?.click(); }}>
              <icons.Replace className="w-6 h-6 text-black" />
            </button>
            <input ref={img1Input} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) onImg1Change(e.target.files[0]); }} />
          </div>
        </div>
        {/* 中：票据风格日期 */}
        <div className="flex flex-col items-center justify-center px-2">
          <div className="w-full h-[260px] flex flex-col items-center justify-center" style={{border:'1.5px solid #222', borderRadius:'12px', padding:'12px'}}>
            <div
              contentEditable
              suppressContentEditableWarning
              className="editable text-3xl font-bold leading-tight mb-1 mt-2 text-center text-neutral-900"
              onBlur={e => onContentChange("dateDay", e.currentTarget.innerText)}
            >{content.dateDay}</div>
            <div
              contentEditable
              suppressContentEditableWarning
              className="editable text-3xl font-bold leading-tight mb-2 text-center text-neutral-900"
              onBlur={e => onContentChange("dateMonth", e.currentTarget.innerText)}
            >{content.dateMonth}</div>
            <div
              contentEditable
              suppressContentEditableWarning
              className="editable text-base mb-2 text-center text-neutral-900"
              onBlur={e => onContentChange("dateAddr", e.currentTarget.innerText)}
            >
              {content.dateAddr.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx !== content.dateAddr.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
            <div style={{borderTop:'1.5px dashed #222', width:'100%', margin:'16px 0'}}></div>
            <div
              contentEditable
              suppressContentEditableWarning
              className="editable text-2xl font-bold text-center text-neutral-900"
              onBlur={e => onContentChange("dateTime", e.currentTarget.innerText)}
            >{content.dateTime}</div>
          </div>
        </div>
        {/* 右：Join us! */}
        <div className="flex flex-col" style={{borderLeft:'2px solid #222', paddingLeft:'16px'}}>
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable text-xl font-bold"
            style={{borderBottom:'3px solid #222', marginBottom:'8px', paddingBottom:'4px', color:'#222'}}
            onBlur={e => onContentChange("joinTitle", e.currentTarget.innerText)}
          >{content.joinTitle}</div>
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable text-base leading-relaxed flex-1 text-neutral-900"
            onBlur={e => onContentChange("joinText", e.currentTarget.innerText)}
          >{content.joinText}</div>
        </div>
      </div>
    </div>
  );
}; 
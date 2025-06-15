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
      {/* 顶部区 */}
      <div className="relative flex items-end justify-between w-full text-xl mb-1" style={{ height: 44 }}>
        <span
          contentEditable
          suppressContentEditableWarning
          className="editable text-xs text-neutral-700"
          onBlur={e => onContentChange("leftTop", e.currentTarget.innerText)}
        >{content.leftTop}</span>
        <span
          contentEditable
          suppressContentEditableWarning
          className="editable text-xs text-neutral-700"
          onBlur={e => onContentChange("rightTop", e.currentTarget.innerText)}
        >{content.rightTop}</span>
        <Image src="/flowers.png" alt="Flowers" width={82} height={30} className="absolute left-1/2 -translate-x-1/2 top-[10px] w-[82px] h-auto pointer-events-none" />
      </div>
      <div className="w-full h-1 bg-neutral-700 mb-1"></div>
      <div
        contentEditable
        suppressContentEditableWarning
        className="editable text-center text-[3.5rem] md:text-7xl font-black tracking-wide text-neutral-900 leading-tight mb-2.5 w-full flex items-center justify-center"
        style={{ fontFamily: 'EngraversOldEnglish,SuperAdorable,serif', fontWeight: 600, letterSpacing: '0.05em' }}
        onBlur={e => onContentChange("headline", e.currentTarget.innerText)}
      >{content.headline}</div>
      <div className="w-full h-1 bg-neutral-900 mb-[1px]"></div>
      <div className="w-full h-1 bg-neutral-900 mb-1"></div>
      <div
        contentEditable
        suppressContentEditableWarning
        className="editable text-center text-lg tracking-[0.3em] uppercase mb-1 text-neutral-900"
        onBlur={e => onContentChange("subTitle", e.currentTarget.innerText)}
      >{content.subTitle}</div>
      <div className="w-full h-[2px] bg-neutral-700 mb-2"></div>
      {/* 上半部分：左右结构 */}
      <div className="flex flex-row w-full mb-2 items-stretch">
        {/* 左：About me 30% */}
        <div className="flex flex-col justify-start" style={{ width: '30%' }}>
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable text-xl font-bold border-b border-neutral-700 mb-2 pb-1 text-neutral-900"
            onBlur={e => onContentChange("aboutTitle", e.currentTarget.innerText)}
          >{content.aboutTitle}</div>
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable text-base leading-relaxed flex-1 text-neutral-900"
            onBlur={e => onContentChange("aboutText", e.currentTarget.innerText)}
          >{content.aboutText}</div>
        </div>
        {/* 竖直分割线 居中 */}
        <div className="h-auto w-[2px] bg-neutral-700 mx-6" style={{ alignSelf: 'stretch' }}></div>
        {/* 右：大竖图 70% */}
        <div className="flex flex-col items-center" style={{ width: '70%' }}>
          <div className="relative group w-full">
            <Image src={mainImg} alt="主图" width={700} height={350} className="img-shadow w-full h-[350px] object-cover select-none" unoptimized={mainImg.startsWith('data:')} style={{ cursor: "default" }} />
            <button type="button" className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded shadow hover:bg-purple-100 transition flex items-center justify-center opacity-0 group-hover:opacity-100 z-10" onClick={e => { e.stopPropagation(); mainImgInput.current?.click(); }}>
              <icons.Replace className="w-6 h-6 text-black" />
            </button>
            <input ref={mainImgInput} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) onMainImgChange(e.target.files[0]); }} />
          </div>
        </div>
      </div>
      {/* 横向分割线 */}
      <div className="w-full h-[2px] bg-neutral-700 mb-2"></div>
      {/* 下半部分：三列结构 */}
      <div className="grid grid-cols-3 gap-0 w-full">
        {/* 左：竖图 */}
        <div className="flex flex-col items-center justify-center pr-4">
          <div className="relative group w-full">
            <Image src={img1} alt="竖图" width={700} height={250} className="img-shadow w-full h-[250px] object-cover select-none" unoptimized={img1.startsWith('data:')} style={{ cursor: "default" }} />
            <button type="button" className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded shadow hover:bg-purple-100 transition flex items-center justify-center opacity-0 group-hover:opacity-100 z-10" onClick={e => { e.stopPropagation(); img1Input.current?.click(); }}>
              <icons.Replace className="w-6 h-6 text-black" />
            </button>
            <input ref={img1Input} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) onImg1Change(e.target.files[0]); }} />
          </div>
        </div>
        {/* 中：票据风格日期 */}
        <div className="flex flex-col items-center justify-center px-2">
          <div className="w-full h-[260px] flex flex-col items-center justify-center border-[1.5px] border-neutral-700 rounded-xl p-3">
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
            <div className="w-full border-t border-dashed border-neutral-700 my-4 mx-auto"></div>
            <div
              contentEditable
              suppressContentEditableWarning
              className="editable text-2xl font-bold text-center text-neutral-900"
              onBlur={e => onContentChange("dateTime", e.currentTarget.innerText)}
            >{content.dateTime}</div>
          </div>
        </div>
        {/* 右：Join us! */}
        <div className="flex flex-col border-l-[1.5px] border-neutral-700 pl-4">
          <div
            contentEditable
            suppressContentEditableWarning
            className="editable text-xl font-bold border-b border-neutral-700 mb-2 pb-1 text-neutral-900"
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
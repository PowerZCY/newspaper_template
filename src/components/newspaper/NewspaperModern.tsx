import React from "react";
import Image from "next/image";
import { globalLucideIcons as icons } from "@/components/global-icon";
import { montserrat, engravers } from '@/lib/fonts';
import { cn } from '@/lib/utils';

interface NewspaperModernProps {
  mainImg: string;
  subImg: string;
  flowers: string;
  onMainImgChange: (file: File) => void;
  onSubImgChange: (file: File) => void;
  onTriggerImgUpload: (key: string, cb: (file: File) => void) => void;
  content: {
    leftTop: string;
    rightTop: string;
    headline: string;
    subTitle: string;
    aboutTitle: string;
    aboutText: string;
    dateDay: string;
    dateMonth: string;
    addr1: string;
    addr2: string;
    addr3: string;
    dateTime: string;
    joinTitle: string;
    joinText: string;
  };
  onContentChange: (key: keyof NewspaperModernProps["content"], value: string) => void;
}

export const NewspaperModern: React.FC<NewspaperModernProps> = ({
  mainImg,
  subImg,
  flowers,
  onMainImgChange,
  onSubImgChange,
  onTriggerImgUpload,
  content,
  onContentChange,
}) => {

  return (
    <div className={cn("newspaper-bg flex flex-col gap-0", montserrat.className)} style={{ background: "#f5f5e5" }}>
      {/* 顶部区：三列flex布局，左右文字底部对齐，图片居中 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          width: '100%',
          marginBottom: '4px',
          position: 'relative'
        }}
      >
        <span
          contentEditable
          suppressContentEditableWarning
          className="editable text-xs text-neutral-700"
          style={{
            width: 240,
            minWidth: 0,
            maxWidth: 240,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            alignSelf: 'flex-end',
            textAlign: 'left',
            flex: 'none'
          }}
          onBlur={e => onContentChange("leftTop", e.currentTarget.innerText)}
        >
          {content.leftTop}
        </span>
        <div style={{ flex: '1 1 0', display: 'flex', justifyContent: 'center' }}>
          <Image
            src={flowers}
            alt="Flowers"
            width={82}
            height={30}
            style={{ display: 'block', margin: '0 16px', height: '30px', alignSelf: 'center' }}
            className="pointer-events-none"
          />
        </div>
        <span
          contentEditable
          suppressContentEditableWarning
          className="editable text-xs text-neutral-700"
          style={{
            width: 240,
            minWidth: 0,
            maxWidth: 240,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            alignSelf: 'flex-end',
            textAlign: 'right',
            flex: 'none'
          }}
          onBlur={e => onContentChange("rightTop", e.currentTarget.innerText)}
        >
          {content.rightTop}
        </span>
      </div>
      <div className="newspaper-divider" style={{borderTop: '2px solid #222', width: '100%', marginBottom: '4px'}}></div>
      <div
        contentEditable
        suppressContentEditableWarning
        className={cn(
          "editable text-center text-[3.5rem] md:text-7xl font-black tracking-wide text-neutral-900 leading-tight mb-2.5 w-full flex items-center justify-center",
          engravers.className
        )}
        style={{ fontWeight: 600, letterSpacing: '0.05em' }}
        onBlur={e => onContentChange("headline", e.currentTarget.innerText)}
      >{content.headline}</div>
      <div className="newspaper-divider" style={{borderTop:'4px solid #222', width:'100%', marginBottom:'2px'}}></div>
      <div className="newspaper-divider" style={{borderTop:'4px solid #222', width:'100%', marginBottom:'4px'}}></div>
      <div
        contentEditable
        suppressContentEditableWarning
        className="editable text-center text-lg tracking-[0.3em] uppercase mb-1 text-neutral-900"
        onBlur={e => onContentChange("subTitle", e.currentTarget.innerText)}
      >{content.subTitle}</div>
      <div className="newspaper-divider" style={{borderTop:'2px solid #222', width:'100%', marginBottom:'8px'}}></div>
      {/* 上半部分：左右结构 */}
      <div className="flex flex-row w-full mb-2 items-stretch">
        {/* 左：About me 30% */}
        <div className="flex flex-col justify-start newspaper-border-right" style={{ width: '35%', borderRight: '2px solid #222', paddingRight: '10px', marginRight: '10px' }}>
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
            <button type="button" className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded shadow hover:bg-purple-100 transition flex items-center justify-center opacity-0 group-hover:opacity-100 z-10" onClick={e => { e.stopPropagation(); onTriggerImgUpload('mainImg', onMainImgChange); }}>
              <icons.Replace className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      </div>
      {/* 横向分割线 */}
      <div className="newspaper-divider" style={{borderTop:'2px solid #222', width:'100%', marginTop: '4px', marginBottom:'4px'}}></div>
      {/* 下半部分：三列结构 */}
      <div className="grid grid-cols-3 gap-0 w-full" style={{marginBottom: '10px'}}>
        {/* 左：竖图 */}
        <div className="flex flex-col items-center justify-center pr-4">
          <div className="relative group w-full">
            <Image
              src={subImg}
              alt="Sub image"
              width={700}
              height={250}
              className="img-shadow w-full h-[250px] object-cover select-none"
              unoptimized={subImg.startsWith('data:')}
            />
            <button type="button" className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded shadow hover:bg-purple-100 transition flex items-center justify-center opacity-0 group-hover:opacity-100 z-10" onClick={e => { e.stopPropagation(); onTriggerImgUpload('subImg', onSubImgChange); }}>
              <icons.Replace className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
        {/* 中：票据风格日期 */}
        <div className="flex flex-col items-center justify-center px-2">
          <div className="w-full h-[260px] flex flex-col items-center justify-center newspaper-border-all" style={{border:'1.5px solid #222', borderRadius:'12px', padding:'12px'}}>
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
              onBlur={e => onContentChange("addr1", e.currentTarget.innerText)}
            >{content.addr1}</div>
            <div
              contentEditable
              suppressContentEditableWarning
              className="editable text-base mb-2 text-center text-neutral-900"
              onBlur={e => onContentChange("addr2", e.currentTarget.innerText)}
            >{content.addr2}</div>
            <div
              contentEditable
              suppressContentEditableWarning
              className="editable text-base mb-2 text-center text-neutral-900"
              onBlur={e => onContentChange("addr3", e.currentTarget.innerText)}
            >{content.addr3}</div>
            <div className="newspaper-divider" style={{borderTop:'1.5px dashed #222', width:'100%', margin:'16px 0'}}></div>
            <div
              contentEditable
              suppressContentEditableWarning
              className="editable text-2xl font-bold text-center text-neutral-900"
              onBlur={e => onContentChange("dateTime", e.currentTarget.innerText)}
            >{content.dateTime}</div>
          </div>
        </div>
        {/* 右：Join us! */}
        <div className="flex flex-col newspaper-border-left" style={{borderLeft:'2px solid #222', paddingLeft:'16px'}}>
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
      <div className="newspaper-divider" style={{borderTop:'2px solid #222', width:'100%', marginTop:'5px', marginBottom:'5px'}}></div>
    </div>
  );
}; 
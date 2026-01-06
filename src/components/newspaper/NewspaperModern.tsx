import { globalLucideIcons as icons } from "@windrun-huaiin/base-ui/components/server";
import { engravers, montserrat } from '@/lib/fonts';
import { cn } from '@windrun-huaiin/lib/utils';
import Image from "next/image";
import React from "react";
import { AIEditable } from "../ai-editable";
import { appConfig } from "@/lib/appConfig";

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
    aiTitleMaxChars: number;
    aiMaxChars: number;
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
  const seqIdPrefix = appConfig.newspaperTemplates.find(t => t.key === "modern")?.key || "modern";
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
        <AIEditable
          seqId={`${seqIdPrefix}_leftTop`}
          value={content.leftTop}
          onChange={val => onContentChange("leftTop", val)}
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
          type="title"
          aiTitleMaxChars={content.aiTitleMaxChars}
        />
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
        <AIEditable
          seqId={`${seqIdPrefix}_rightTop`}
          value={content.rightTop}
          onChange={val => onContentChange("rightTop", val)}
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
          type="title"
          aiTitleMaxChars={content.aiTitleMaxChars}
        />
      </div>
      <div className="newspaper-divider newspaper-divider-medium mb-1"></div>
      <AIEditable
        seqId={`${seqIdPrefix}_headline`}
        value={content.headline}
        onChange={val => onContentChange("headline", val)}
        className={cn(
          "editable w-full block text-center font-black tracking-wide text-neutral-900 leading-tight mb-2.5",
          content.headline.length < 16 ? "text-[3.5rem] md:text-7xl" :
          content.headline.length < 19 ? "text-[3.0rem] md:text-6xl" :
          content.headline.length < 24 ? "text-[2.5rem] md:text-5xl" :
          content.headline.length < 32 ? "text-[2rem] md:text-4xl" :
          content.headline.length < 38 ? "text-[1.5rem] md:text-3xl" : "text-[1.2rem] md:text-2xl",
          engravers.className
        )}
        style={{ fontWeight: 600, letterSpacing: '0.05em' }}
        type="title"
        aiTitleMaxChars={content.aiTitleMaxChars}
      />
      <div className="newspaper-divider newspaper-divider-thick mb-0.5"></div>
      <div className="newspaper-divider newspaper-divider-thick mb-1"></div>
      <AIEditable
        seqId={`${seqIdPrefix}_subTitle`}
        value={content.subTitle}
        onChange={val => onContentChange("subTitle", val)}
        className="editable w-full block text-center text-lg tracking-[0.3em] uppercase mb-1 text-neutral-900"
        type="title"
        aiTitleMaxChars={content.aiTitleMaxChars}
      />
      <div className="newspaper-divider newspaper-divider-medium mb-2"></div>
      {/* 上半部分：左右结构 */}
      <div className="flex flex-row w-full mb-2 items-stretch">
        {/* 左：About me 30% */}
        <div className="flex flex-col justify-start" style={{ width: '35%', paddingRight: '10px' }}>
          <AIEditable
            seqId={`${seqIdPrefix}_aboutTitle`}
            value={content.aboutTitle}
            onChange={val => onContentChange("aboutTitle", val)}
            className="editable text-xl font-extrabold"
            style={{borderBottom:'3px solid #222', marginBottom:'8px', paddingBottom:'4px', color:'#222'}}
            type="title"
            aiTitleMaxChars={content.aiTitleMaxChars}
          />
          <AIEditable
            seqId={`${seqIdPrefix}_aboutText`}
            value={content.aboutText}
            onChange={val => onContentChange("aboutText", val)}
            className="editable text-[0.95rem] leading-relaxed flex-1 text-neutral-900"
            type="text"
            aiMaxChars={content.aiMaxChars}
          />
        </div>
        <div className="newspaper-divider newspaper-divider-vertical mx-2" style={{height: '100%'}}></div>
        {/* 右：大竖图 70% */}
        <div className="flex flex-col items-center" style={{ width: '65%' }}>
          <div 
            className="relative group w-full cursor-pointer"
            onClick={() => onTriggerImgUpload('mainImg', onMainImgChange)}
          >
            <Image
              src={mainImg}
              alt="Main image"
              width={700}
              height={350}
              className="img-shadow w-full h-[350px] object-cover select-none"
              unoptimized={mainImg.startsWith('data:')}
            />
            <div className="absolute bottom-2 right-2 bg-white/90 px-3 py-1.5 rounded-full shadow hover:bg-purple-100 transition flex items-center justify-center opacity-90 hover:opacity-100 z-10 pointer-events-none">
              <icons.Pencil className="w-4 h-4 text-black mr-1" />
              <span className="text-xs font-medium text-black">Edit</span>
            </div>
          </div>
        </div>
      </div>
      {/* 横向分割线 */}
      <div className="newspaper-divider newspaper-divider-medium my-1"></div>
      {/* 下半部分：三列结构 */}
      <div className="grid grid-cols-3 gap-0 w-full" style={{marginBottom: '10px'}}>
        {/* 左：竖图 */}
        <div className="flex flex-col items-center justify-center pr-4">
          <div 
            className="relative group w-full cursor-pointer"
            onClick={() => onTriggerImgUpload('subImg', onSubImgChange)}
          >
            <Image
              src={subImg}
              alt="Sub image"
              width={700}
              height={250}
              className="img-shadow w-full h-[250px] object-cover select-none"
              unoptimized={subImg.startsWith('data:')}
            />
            <div className="absolute bottom-2 right-2 bg-white/90 px-3 py-1.5 rounded-full shadow hover:bg-purple-100 transition flex items-center justify-center opacity-90 hover:opacity-100 z-10 pointer-events-none">
              <icons.Pencil className="w-4 h-4 text-black mr-1" />
              <span className="text-xs font-medium text-black">Edit</span>
            </div>
          </div>
        </div>
        {/* 中：票据风格日期 */}
        <div className="flex flex-col items-center justify-center px-2">
          <div className="w-full h-[260px] flex flex-col items-center justify-center newspaper-border-all" style={{border:'1.5px solid #222', borderRadius:'12px', padding:'12px'}}>
            <AIEditable
              seqId={`${seqIdPrefix}_dateDay`}
              value={content.dateDay}
              onChange={val => onContentChange("dateDay", val)}
              className="editable w-full block text-3xl font-bold leading-tight mb-1 mt-2 text-center text-neutral-900"
              type="title"
              aiTitleMaxChars={content.aiTitleMaxChars}
            />
            <AIEditable
              seqId={`${seqIdPrefix}_dateMonth`}
              value={content.dateMonth}
              onChange={val => onContentChange("dateMonth", val)}
              className="editable w-full block text-3xl font-bold leading-tight mb-2 text-center text-neutral-900"
              type="title"
              aiTitleMaxChars={content.aiTitleMaxChars}
            />
            <AIEditable
              seqId={`${seqIdPrefix}_addr1`}
              value={content.addr1}
              onChange={val => onContentChange("addr1", val)}
              className="editable w-full block text-base mb-2 text-center text-neutral-900"
              type="title"
              aiTitleMaxChars={content.aiTitleMaxChars}
            />
            <AIEditable
              seqId={`${seqIdPrefix}_addr2`}
              value={content.addr2}
              onChange={val => onContentChange("addr2", val)}
              className="editable w-full block text-base mb-2 text-center text-neutral-900"
              type="title"
              aiTitleMaxChars={content.aiTitleMaxChars}
            />
            <AIEditable
              seqId={`${seqIdPrefix}_addr3`}
              value={content.addr3}
              onChange={val => onContentChange("addr3", val)}
              className="editable w-full block text-base mb-2 text-center text-neutral-900"
              type="title"
              aiTitleMaxChars={content.aiTitleMaxChars}
            />
            <div className="newspaper-divider newspaper-divider-dashed" style={{margin: '16px 0 6px 0'}}></div>
            <AIEditable
              seqId={`${seqIdPrefix}_dateTime`}
              value={content.dateTime}
              onChange={val => onContentChange("dateTime", val)}
              className="editable w-full block text-base text-center text-neutral-900"
              type="title"
              aiTitleMaxChars={content.aiTitleMaxChars}
            />
          </div>
        </div>
        {/* 右：Join us! */}
        <div className="flex flex-col" style={{paddingLeft:'16px'}}>
          <AIEditable
            seqId={`${seqIdPrefix}_joinTitle`}
            value={content.joinTitle}
            onChange={val => onContentChange("joinTitle", val)}
            className="editable text-xl font-extrabold"
            style={{borderBottom:'3px solid #222', marginBottom:'8px', paddingBottom:'4px', color:'#222'}}
            type="title"
            aiTitleMaxChars={content.aiTitleMaxChars}
          />
          <AIEditable
            seqId={`${seqIdPrefix}_joinText`}
            value={content.joinText}
            onChange={val => onContentChange("joinText", val)}
            className="editable text-[0.95rem] leading-relaxed flex-1 text-neutral-900"
            type="text"
            aiMaxChars={content.aiMaxChars}
          />
        </div>
      </div>
      <div className="newspaper-divider newspaper-divider-medium my-1"></div>
    </div>
  );
}; 

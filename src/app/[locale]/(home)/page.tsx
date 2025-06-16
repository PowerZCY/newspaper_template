"use client";
import { NewspaperModern } from "@/components/newspaper/NewspaperModern";
import { NewspaperSimple } from "@/components/newspaper/NewspaperSimple";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { appConfig } from "@/lib/appConfig";
import { globalLucideIcons as icons } from "@/components/global-icon";
import { NEWSPAPER_TEMPLATES } from "@/components/newspaper/BaseConfig";

export default function Home() {
  const [template, setTemplate] = useState<"simple" | "modern">("simple");
  const [simpleContent, setSimpleContent] = useState({ ...NEWSPAPER_TEMPLATES.simple.defaultContent });
  const [modernContent, setModernContent] = useState({ ...NEWSPAPER_TEMPLATES.modern.defaultContent });
  const [simpleImgs, setSimpleImgs] = useState({ ...NEWSPAPER_TEMPLATES.simple.defaultImgs });
  const [modernImgs, setModernImgs] = useState({ ...NEWSPAPER_TEMPLATES.modern.defaultImgs });
  const areaRef = useRef<HTMLDivElement>(null);
  const [closedAds, setClosedAds] = useState<string[]>([]);
  const [exporting, setExporting] = useState<'none' | 'img' | 'pdf'>('none');

  // 模板卡片排序
  const templates = [...appConfig.newspaperTemplates].sort((a, b) => (b.top ? 1 : 0) - (a.top ? 1 : 0));
  const [selectedKey, setSelectedKey] = useState<string>(template);

  const { cardWidth: CARD_WIDTH, cardHeight: CARD_HEIGHT } = appConfig.newspaperCard;

  // 过滤已关闭广告
  const visibleTemplates = templates.filter(
    tpl => !(tpl.type === 'ads' && closedAds.includes(tpl.key))
  );

  const handleCloseAd = (key: string) => {
    setClosedAds(prev => [...prev, key]);
  };

  // 图片上传
  const handleImgChange = (type: string, key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      if (type === "simple") {
        setSimpleImgs(imgs => ({ ...imgs, [key]: e.target?.result as string }));
      } else {
        setModernImgs(imgs => ({ ...imgs, [key]: e.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // 内容编辑
  const handleContentChange = (type: string, key: string, value: string) => {
    if (type === "simple") {
      setSimpleContent(c => ({ ...c, [key]: value }));
    } else {
      setModernContent(c => ({ ...c, [key]: value }));
    }
  };

  // 导出前处理
  const prepareForExport = async () => {
    if (!areaRef.current) return;
    areaRef.current.classList.add('exporting');
    await document.fonts.ready;
  };
  // 导出后恢复
  const restoreAfterExport = () => {
    if (!areaRef.current) return;
    areaRef.current.classList.remove('exporting');
  };

  useEffect(() => {
    const handleVisibility = () => {
      setExporting('none');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // 导出图片
  const handleExportImg = async () => {
    setExporting('img');
    let timeoutId = setTimeout(() => setExporting('none'), 5000); // 5秒兜底
    await prepareForExport();
    try {
      const domtoimage = await import('dom-to-image-more');
      const dataUrl = await domtoimage.toPng(areaRef.current as HTMLElement);
      const link = document.createElement("a");
      link.download = `${selectedKey || 'newspaper'}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      restoreAfterExport();
      clearTimeout(timeoutId);
      setExporting('none');
    }
  };
  // 导出PDF
  const handleExportPDF = async () => {
    setExporting('pdf');
    let timeoutId = setTimeout(() => setExporting('none'), 5000); // 5秒兜底
    await prepareForExport();
    try {
      const domtoimage = await import('dom-to-image-more');
      const jsPDF = (await import("jspdf")).default;
      const dataUrl = await domtoimage.toPng(areaRef.current as HTMLElement);
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 40;
      // 先创建图片对象获取高度
      const img = new window.Image();
      img.src = dataUrl;
      img.onload = function() {
        const imgHeight = img.height * imgWidth / img.width;
        pdf.addImage(dataUrl, "PNG", 20, 20, imgWidth, imgHeight);
        pdf.save(`${selectedKey || 'newspaper'}.pdf`);
      };
    } finally {
      restoreAfterExport();
      clearTimeout(timeoutId);
      setExporting('none');
    }
  };

  // 卡片点击逻辑
  const handleTemplateCardClick = (tpl: { key: string; href: string; name: string }) => {
    if (tpl.href) {
      window.open(tpl.href, "_blank");
    } else {
      setTemplate(tpl.key as "simple" | "modern");
      setSelectedKey(tpl.key);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
      {/* 模板选择区和导出按钮 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleExportImg}
          className={`ml-6 px-4 py-1 rounded bg-gradient-to-r from-purple-400 to-pink-500 text-white transition-opacity ${exporting !== 'none' ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={exporting !== 'none'}
        >
          {exporting === 'img' ? '图片处理中...' : '导出为图片'}
        </button>
        <button
          onClick={handleExportPDF}
          className={`ml-2 px-4 py-1 rounded bg-gradient-to-r from-purple-400 to-pink-500 text-white transition-opacity ${exporting !== 'none' ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={exporting !== 'none'}
        >
          {exporting === 'pdf' ? 'PDF处理中...' : '导出为PDF'}
        </button>
      </div>
      {/* 主体内容区 */}
      <main className="flex-1 flex justify-center items-start py-8 gap-10">
        {/* 报纸内容块 */}
        <section ref={areaRef} className="newspaper-bg shadow-lg rounded-lg px-8 py-6 w-[700px] min-h-[900px] flex flex-col gap-4 transition-colors duration-300 flex-shrink-0 mr-8">
          {template === "simple" ? (
            <NewspaperSimple
              mainImg={simpleImgs.mainImg}
              sideImg={simpleImgs.sideImg}
              bottomImg={simpleImgs.bottomImg}
              onMainImgChange={file => handleImgChange("simple", "mainImg", file)}
              onSideImgChange={file => handleImgChange("simple", "sideImg", file)}
              onBottomImgChange={file => handleImgChange("simple", "bottomImg", file)}
              content={simpleContent}
              onContentChange={(key, value) => handleContentChange("simple", key, value)}
            />
          ) : (
            <NewspaperModern
              mainImg={modernImgs.mainImg}
              img1={modernImgs.img1}
              onMainImgChange={file => handleImgChange("modern", "mainImg", file)}
              onImg1Change={file => handleImgChange("modern", "img1", file)}
              content={modernContent}
              onContentChange={(key, value) => handleContentChange("modern", key, value)}
            />
          )}
        </section>
        {/* 模板卡片区 */}
        <aside className="grid grid-cols-2 gap-4" style={{ width: CARD_WIDTH * 2 + 32 }}>
          {visibleTemplates.map((tpl, _idx) => (
            <div
              key={tpl.key}
              className={`relative cursor-pointer border rounded-xl shadow p-2 flex flex-col items-center transition-all duration-200 hover:shadow-lg
                ${selectedKey === tpl.key ? 'ring-2 ring-purple-400 border-purple-400' : 'border-neutral-200'}
                ${tpl.type === 'ads'
                  ? 'bg-yellow-50'
                  : 'bg-white dark:bg-neutral-800'}
              `}
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
              onClick={() => handleTemplateCardClick(tpl)}
              title={tpl.name}
            >
              {/* 顶部名称和广告关闭按钮 */}
              <div className="w-full flex flex-row items-center justify-between px-1 pt-1 pb-1 select-none">
                <div className={`font-bold ${tpl.type === 'ads' ? 'text-neutral-700 text-sm' : 'text-sm'}`}>
                  {tpl.type === 'ads'
                    ? <>
                        {tpl.name.replace(/(ad|ads)$/i, '').trim()}
                        <span className="ml-1 text-xs text-red-500 align-middle">Ad</span>
                      </>
                    : tpl.name}
                </div>
                {tpl.type === 'ads' && (
                  <button
                    className="text-neutral-400 hover:text-red-500 text-lg select-none p-0.5"
                    onClick={e => { e.stopPropagation(); handleCloseAd(tpl.key); }}
                    title="Close"
                  >
                    <icons.X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Image
                src={tpl.thumb}
                alt={tpl.name}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                className="w-full h-full object-cover rounded"
                unoptimized
                style={{ width: '100%', height: '100%', cursor: 'default' }}
              />
            </div>
          ))}
        </aside>
      </main>
    </div>
  );
}


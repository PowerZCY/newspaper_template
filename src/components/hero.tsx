"use client";
import { AdsAlertDialog } from "@/components/ads-alert-dialog";
import { globalLucideIcons as icons } from "@/components/global-icon";
import { NEWSPAPER_TEMPLATES } from "@/components/newspaper/BaseConfig";
import { NewspaperModern } from "@/components/newspaper/NewspaperModern";
import { NewspaperSimple } from "@/components/newspaper/NewspaperSimple";
import { appConfig } from "@/lib/appConfig";
import { useTheme } from 'next-themes';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from "react";

export function Hero() {
  const [template, setTemplate] = useState<"simple" | "modern">("simple");
  const [simpleContent, setSimpleContent] = useState({ ...NEWSPAPER_TEMPLATES.simple.defaultContent });
  const [modernContent, setModernContent] = useState({ ...NEWSPAPER_TEMPLATES.modern.defaultContent });
  const [simpleImgs, setSimpleImgs] = useState({ ...NEWSPAPER_TEMPLATES.simple.defaultImgs });
  const [modernImgs, setModernImgs] = useState({ ...NEWSPAPER_TEMPLATES.modern.defaultImgs });
  const areaRef = useRef<HTMLDivElement>(null);
  const [closedAds, setClosedAds] = useState<string[]>([]);
  const [exportingImg, setExportingImg] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [pageFocused, setPageFocused] = useState(true);
  const [exportError, setExportError] = useState<string | null>(null);
  const globalImgInputRef = useRef<HTMLInputElement>(null);
  const [pendingImgUpload, setPendingImgUpload] = useState<null | { type: string; key: string; cb: (file: File) => void }>(null);
  const [exportingJPEG, setExportingJPEG] = useState(false);
  const [exportingSVG, setExportingSVG] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const templates = [...appConfig.newspaperTemplates].sort((a, b) => (b.top ? 1 : 0) - (a.top ? 1 : 0));
  const [selectedKey, setSelectedKey] = useState<string>(template);
  const { cardWidth: CARD_WIDTH, cardHeight: CARD_HEIGHT } = appConfig.newspaperCard;
  const visibleTemplates = templates.filter(
    tpl => !(tpl.type === 'ads' && closedAds.includes(tpl.key))
  );
  const handleCloseAd = (key: string) => {
    setClosedAds(prev => [...prev, key]);
  };
  const handleTemplateCardClick = (tpl: { key: string; href: string; name: string }) => {
    setExportingImg(false);
    setExportingPDF(false);
    if (tpl.href) {
      window.open(tpl.href, "_blank");
    } else {
      setTemplate(tpl.key as "simple" | "modern");
      setSelectedKey(tpl.key);
    }
  };
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
  const handleContentChange = (type: string, key: string, value: string) => {
    if (type === "simple") {
      setSimpleContent(c => ({ ...c, [key]: value }));
    } else {
      setModernContent(c => ({ ...c, [key]: value }));
    }
  };
  const prepareForExport = useCallback(async () => {
    if (!areaRef.current) return;
    areaRef.current.classList.add('exporting');
    await document.fonts.ready;
  }, [areaRef]);
  const restoreAfterExport = useCallback(() => {
    if (!areaRef.current) return;
    areaRef.current.classList.remove('exporting');
  }, [areaRef]);
  const pathname = usePathname();
  const { theme } = useTheme();
  const handleGlobalImgUpload = (type: string, key: string, cb: (file: File) => void) => {
    setPendingImgUpload({ type, key, cb });
    setTimeout(() => {
      globalImgInputRef.current?.click();
    }, 0);
  };
  const onGlobalImgInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingImgUpload) {
      pendingImgUpload.cb(file);
    }
    e.target.value = '';
    setPendingImgUpload(null);
  };
  // 导出相关逻辑
  const exportErrorMsg = 'Please refresh page or switch template and try again!';
  const handleExportJPEG = async () => {
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    setExportMenuOpen(false);
    tryExport('jpeg');
  };
  const handleExportPNG = async () => {
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    setExportMenuOpen(false);
    tryExport('png');
  };
  const handleExportSVG = async () => {
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    setExportMenuOpen(false);
    tryExport('svg');
  };
  const handleExportPDF = async () => {
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    setExportMenuOpen(false);
    tryExport('pdf');
  };
  const tryExport = useCallback(async (type: 'png' | 'jpeg' | 'svg' | 'pdf') => {
    if (type === 'png') setExportingImg(true);
    if (type === 'jpeg') setExportingJPEG(true);
    if (type === 'svg') setExportingSVG(true);
    if (type === 'pdf') setExportingPDF(true);
    const timeoutId = setTimeout(() => {
      restoreAfterExport();
      setExportingImg(false);
      setExportingJPEG(false);
      setExportingSVG(false);
      setExportingPDF(false);
      setExportError('Your Downloading maybe timeout, please check or try again!');
      // 10s超时
    }, 10000);
    let finished = false;
    const finish = (isTimeout = false) => {
      if (finished) return;
      finished = true;
      restoreAfterExport();
      setExportingImg(false);
      setExportingJPEG(false);
      setExportingSVG(false);
      setExportingPDF(false);
      clearTimeout(timeoutId);
      clearTimeout(pdfTimeoutId);
      if (isTimeout) {
        setExportError('Your Downloading maybe timeout, please check or try again!');
      }
    };
    const pdfTimeoutId = setTimeout(() => {
      finish(true);
    }, 5000);
    await prepareForExport();
    try {
      if (!areaRef.current) throw new Error('Export area lost');
      const domtoimage = await import('dom-to-image-more');
      let dataUrl;
      if (type === 'png') {
        dataUrl = await domtoimage.toPng(areaRef.current as HTMLElement, { scale: appConfig.export?.scale || window.devicePixelRatio || 2 });
      } else if (type === 'jpeg') {
        dataUrl = await domtoimage.toJpeg(areaRef.current as HTMLElement, { scale: appConfig.export?.scale || window.devicePixelRatio || 2, quality: 0.95, bgcolor: '#f5f5e5' });
      } else if (type === 'svg') {
        dataUrl = await domtoimage.toSvg(areaRef.current as HTMLElement, { scale: appConfig.export?.scale || window.devicePixelRatio || 2 });
      } else if (type === 'pdf') {
        dataUrl = await domtoimage.toJpeg(areaRef.current as HTMLElement, { scale: appConfig.export?.pdfScale || 1.5, quality: 0.85, bgcolor: '#f5f5e5' });
      }
      if (!dataUrl) throw new Error('Export failed');
      if (type === 'png' || type === 'jpeg' || type === 'svg') {
        const link = document.createElement("a");
        link.download = `${selectedKey || 'newspaper'}.${type === 'jpeg' ? 'jpg' : type}`;
        link.href = dataUrl;
        link.click();
        finish();
      } else if (type === 'pdf') {
        const { default: jsPDF } = await import('jspdf');
        const img = new window.Image();
        img.src = dataUrl;
        img.onload = function() {
          try {
            // 用图片实际宽高创建PDF画布，图片填满整个PDF页面，无边距
            const pdf = new jsPDF({
              orientation: img.width > img.height ? 'l' : 'p',
              unit: 'pt',
              format: [img.width, img.height]
            });
            pdf.addImage(dataUrl, "JPEG", 0, 0, img.width, img.height);
            pdf.save(`${selectedKey || 'newspaper'}.pdf`);
          } finally {
            finish();
          }
        };
        img.onerror = function() {
          finish();
        };
        return;
      }
    } catch (e) {
      console.error(e);
      finish();
      setExportError('Your Downloading maybe failed, please check or try again');
    }
  }, [selectedKey, prepareForExport, restoreAfterExport, areaRef]);
  useEffect(() => {
    const onFocus = () => setPageFocused(true);
    const onBlur = () => setPageFocused(false);
    const onVisibilityChange = () => setPageFocused(document.visibilityState === 'visible' && document.hasFocus());
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibilityChange);
    setPageFocused(document.visibilityState === 'visible' && document.hasFocus());
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);
  useEffect(() => {
    if (!exportMenuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      const btn = exportBtnRef.current;
      const menu = exportMenuRef.current;
      if (btn && btn.contains(event.target as Node)) return;
      if (menu && menu.contains(event.target as Node)) return;
      setExportMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [exportMenuOpen]);

  return (
    <>
      <AdsAlertDialog
        open={!!exportError}
        onOpenChange={open => { if (!open) setExportError(null); }}
        title="Download message"
        description={exportError}
        // imgSrc="/default.webp"
        // imgHref="https://github.com/PowerZCY/formato"
      />
      <div className="flex justify-center items-start py-2 gap-2 px-4 md:gap-4 md:px-12">
        {/* 模板卡片区 */}
        <aside className="grid grid-cols-2 gap-4 ml-8" style={{ width: CARD_WIDTH * 2 + 32 }}>
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
                width={182}
                height={254}
                className="object-cover rounded"
                unoptimized
                style={{ width: 182, height: 254, maxWidth: 182, maxHeight: 254, cursor: 'default' }}
              />
            </div>
          ))}
        </aside>
        {/* 报纸内容块+操作按钮整体竖直居中 */}
        <div className="flex flex-col items-center mt-[-40px] mr-8">
          {/* 操作区：社交图标+导出按钮 */}
          <div className="mb-2 w-full max-w-[700px] px-8 flex flex-row justify-between items-center">
            {/* 社交图标区 */}
            <div className="flex flex-row">
              {Array.isArray(appConfig.socialIcons) && appConfig.socialIcons.length > 0 && appConfig.socialIcons.map(icon => {
                const iconKey = icon.key as keyof typeof icons;
                const IconComp = icons[iconKey];
                return IconComp ? (
                  <button key={icon.key} className="rounded-full p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition" title={icon.name}>
                    <IconComp className="w-5 h-5" />
                  </button>
                ) : null;
              })}
            </div>
            {/* 导出按钮区 */}
            <div className="relative flex">
              {/* 左区：主操作 */}
              <button
                ref={exportBtnRef}
                className={`flex-1 flex items-center px-4 py-1 text-neutral-700 dark:text-white text-sm font-semibold transition focus:outline-none rounded-l-full hover:bg-neutral-200 dark:hover:bg-neutral-700 ${exportingJPEG || !pageFocused ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={exportingJPEG || !pageFocused}
                onClick={handleExportJPEG}
                onMouseDown={e => { if (e.button === 2) e.preventDefault(); }}
              >
                <icons.Download className="w-5 h-5 mr-2" /> Download JPG
              </button>
              {/* 右区：下拉 */}
              <span
                className="flex items-center justify-center w-10 h-8 cursor-pointer transition hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-r-full"
                onClick={e => { e.stopPropagation(); setExportMenuOpen(v => !v); }}
                tabIndex={0}
              >
                <icons.ChevronDown className="w-6 h-6" />
              </span>
              {/* 下拉菜单（原有功能不动） */}
              {exportMenuOpen && (
                <div
                  ref={exportMenuRef}
                  className="absolute right-0 top-full w-48 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white text-sm rounded-xl shadow-lg z-50 border border-neutral-200 dark:border-neutral-700 overflow-hidden animate-fade-in"
                >
                  <button onClick={handleExportJPEG} className="flex items-center w-full px-4 py-3 transition hover:bg-neutral-200 dark:hover:bg-neutral-600 text-left disabled:opacity-60" disabled={exportingJPEG || !pageFocused}>
                    <icons.ImageDown className="w-5 h-5 mr-2" />Download JPG
                  </button>
                  <button onClick={handleExportPNG} className="flex items-center w-full px-4 py-3 transition hover:bg-neutral-200 dark:hover:bg-neutral-600 text-left disabled:opacity-60" disabled={exportingImg || !pageFocused}>
                    <icons.ImageDown className="w-5 h-5 mr-2" />Download PNG
                  </button>
                  <button onClick={handleExportPDF} className="flex items-center w-full px-4 py-3 transition hover:bg-neutral-200 dark:hover:bg-neutral-600 text-left disabled:opacity-60" disabled={exportingPDF || !pageFocused}>
                    <icons.Download className="w-5 h-5 mr-2" />Download PDF
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-3 transition hover:bg-neutral-200 dark:hover:bg-neutral-600 text-left disabled:opacity-60 relative"
                    disabled={exportingSVG || !pageFocused}
                    onClick={handleExportSVG}
                  >
                    <span className="flex items-center">
                      <icons.ImageDown className="w-5 h-5 mr-2" />
                      Download SVG
                    </span>
                    <span
                      className="absolute right-3 top-1 text-[10px] font-semibold"
                      style={{ color: '#a855f7', pointerEvents: 'none' }}
                    >
                      Beta
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* 全局图片上传 input，隐藏 */}
          <input ref={globalImgInputRef} type="file" accept="image/*" className="hidden" onChange={onGlobalImgInputChange} />
          {/* 报纸模板内容，导出区域，不能包含按钮 */}
          <section
            key={theme + '-' + pathname + '-' + template + '-' + pageFocused}
            ref={areaRef}
            className="newspaper-bg shadow-lg rounded-lg px-8 py-6 w-[700px] min-h-[900px] flex flex-col gap-4 transition-colors duration-300 flex-shrink-0 mr-8"
            style={{
              border: '1px solid rgba(255,255,255,0)', // 透明白色边框，兜底黑线
            }}
          >
            {template === "simple" ? (
              <NewspaperSimple
                mainImg={simpleImgs.mainImg}
                sideImg={simpleImgs.sideImg}
                bottomImg={simpleImgs.bottomImg}
                onMainImgChange={file => handleImgChange("simple", "mainImg", file)}
                onSideImgChange={file => handleImgChange("simple", "sideImg", file)}
                onBottomImgChange={file => handleImgChange("simple", "bottomImg", file)}
                onTriggerImgUpload={(key, cb) => handleGlobalImgUpload("simple", key, cb)}
                content={simpleContent}
                onContentChange={(key, value) => handleContentChange("simple", key, value)}
              />
            ) : (
              <NewspaperModern
                mainImg={modernImgs.mainImg}
                subImg={modernImgs.subImg}
                flowers={modernImgs.flowers}
                onMainImgChange={file => handleImgChange("modern", "mainImg", file)}
                onSubImgChange={file => handleImgChange("modern", "subImg", file)}
                onTriggerImgUpload={(key, cb) => handleGlobalImgUpload("modern", key, cb)}
                content={modernContent}
                onContentChange={(key, value) => handleContentChange("modern", key, value)}
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
} 
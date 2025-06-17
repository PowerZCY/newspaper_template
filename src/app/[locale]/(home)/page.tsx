"use client";
import { NewspaperModern } from "@/components/newspaper/NewspaperModern";
import { NewspaperSimple } from "@/components/newspaper/NewspaperSimple";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { appConfig } from "@/lib/appConfig";
import { globalLucideIcons as icons } from "@/components/global-icon";
import { NEWSPAPER_TEMPLATES } from "@/components/newspaper/BaseConfig";
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function Home() {
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
  const prepareForExport = useCallback(async () => {
    if (!areaRef.current) return;
    areaRef.current.classList.add('exporting');
    await document.fonts.ready;
  }, [areaRef]);

  // 导出后恢复
  const restoreAfterExport = useCallback(() => {
    if (!areaRef.current) return;
    areaRef.current.classList.remove('exporting');
  }, [areaRef]);

  const pathname = usePathname();
  const { theme } = useTheme();

  // 卡片点击逻辑
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

  const handleExportImg = () => {
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError('Please refresh page or switch template and try again！');
      return;
    }
    tryExport('img');
  };
  const handleExportPDF = () => {
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError('Please refresh page or switch template and try again！');
      return;
    }
    tryExport('pdf');
  };

  const tryExport = useCallback(async (type: 'img' | 'pdf') => {
    if (type === 'img') setExportingImg(true);
    if (type === 'pdf') setExportingPDF(true);
    const timeoutId = setTimeout(() => {
      restoreAfterExport();
      setExportingPDF(false);
      setExportError('Export timeout, please try again！');
    }, 7000); // 主流程兜底7秒

    let finished = false;
    const finish = (isTimeout = false) => {
      if (finished) return;
      finished = true;
      restoreAfterExport();
      setExportingPDF(false);
      clearTimeout(timeoutId);
      clearTimeout(pdfTimeoutId);
      if (isTimeout) {
        setExportError('PDF export timeout, please try again！');
      }
    };
    const pdfTimeoutId = setTimeout(() => {
      finish(true); // 只有图片加载超时才弹窗
    }, 5000); // 图片加载兜底5秒

    await prepareForExport();
    try {
      if (!areaRef.current) throw new Error('Export area lost');
      const domtoimage = await import('dom-to-image-more');
      let dataUrl;
      if (type === 'img') {
        dataUrl = await domtoimage.toPng(areaRef.current as HTMLElement, { scale: appConfig.export?.scale || window.devicePixelRatio || 2 });
      } else if (type === 'pdf') {
        dataUrl = await domtoimage.toJpeg(areaRef.current as HTMLElement, { scale: appConfig.export?.pdfScale || 1.5, quality: 0.85, bgcolor: '#f5f5e5' });
      }
      if (!dataUrl) throw new Error('Export failed');
      if (type === 'img') {
        const link = document.createElement("a");
        link.download = `${selectedKey || 'newspaper'}.png`;
        link.href = dataUrl;
        link.click();
        restoreAfterExport();
        setExportingImg(false);
        clearTimeout(timeoutId);
        clearTimeout(pdfTimeoutId);
      } else if (type === 'pdf') {
        const jsPDF = (await import("jspdf")).default;
        const pdf = new jsPDF("p", "pt", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 40;
        const img = new window.Image();
        img.src = dataUrl;
        img.onload = function() {
          try {
            const imgHeight = img.height * imgWidth / img.width;
            pdf.addImage(dataUrl, "PNG", 20, 20, imgWidth, imgHeight);
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
      restoreAfterExport();
      if (type === 'img') setExportingImg(false);
      if (type === 'pdf') setExportingPDF(false);
      clearTimeout(timeoutId);
      clearTimeout(pdfTimeoutId);
      setExportError('Export failed, please try again');
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

  // 全局图片上传触发器
  const handleGlobalImgUpload = (type: string, key: string, cb: (file: File) => void) => {
    setPendingImgUpload({ type, key, cb });
    setTimeout(() => {
      globalImgInputRef.current?.click();
    }, 0);
  };

  // input change 事件
  const onGlobalImgInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingImgUpload) {
      pendingImgUpload.cb(file);
    }
    // 清空 input value，防止同一文件无法重复上传
    e.target.value = '';
    setPendingImgUpload(null);
  };

  return (
    <>
      <AlertDialog open={!!exportError} onOpenChange={open => { if (!open) setExportError(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>导出失败</AlertDialogTitle>
            <AlertDialogDescription>
              {exportError}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setExportError(null)}>
            确定
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
      <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
        {/* 主体内容区 */}
        <main className="flex-1 flex justify-center items-start py-2 gap-10">
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
                  width={182}
                  height={254}
                  className="object-cover rounded"
                  unoptimized
                  style={{ width: 182, height: 254, maxWidth: 182, maxHeight: 254, cursor: 'default' }}
                />
              </div>
            ))}
          </aside>

          {/* 报纸内容块+导出按钮整体竖直居中 */}
          <div className="flex flex-col items-center">
            {/* 全局图片上传 input，隐藏 */}
            <input ref={globalImgInputRef} type="file" accept="image/*" className="hidden" onChange={onGlobalImgInputChange} />
            {/* 导出按钮，竖直居中对齐，不能包含在section内 */}
            <div className="mb-2 flex flex-row gap-2">
              <button
                onClick={handleExportImg}
                className={`px-4 py-1 rounded-xl border border-purple-400 ring-2 ring-purple-400 shadow flex items-center transition
                  bg-white text-neutral-700 dark:bg-neutral-800 dark:text-white
                  focus:outline-none ${exportingImg || !pageFocused ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={exportingImg || !pageFocused}
              >
                <icons.ImageDown className="w-5 h-5 mr-1" />
                {exportingImg ? 'Exporting PNG...' : 'Export as PNG'}
              </button>
              <button
                onClick={handleExportPDF}
                className={`px-4 py-1 rounded-xl border border-purple-400 ring-2 ring-purple-400 shadow flex items-center transition
                  bg-white text-neutral-700 dark:bg-neutral-800 dark:text-white
                  focus:outline-none ${exportingPDF || !pageFocused ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={exportingPDF || !pageFocused}
              >
                <icons.Download className="w-5 h-5 mr-1" />
                {exportingPDF ? 'Exporting PDF...' : 'Export as PDF'}
              </button>
            </div>
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
        </main>
      </div>
    </>
  );
}


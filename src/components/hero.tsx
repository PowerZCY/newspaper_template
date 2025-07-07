"use client";
import { AdsAlertDialog } from "@windrun-huaiin/third-ui/main";
import { globalLucideIcons as icons } from "@windrun-huaiin/base-ui/components/server";
import { NEWSPAPER_TEMPLATES } from "@/components/newspaper/BaseConfig";
import { NewspaperModern } from "@/components/newspaper/NewspaperModern";
import { NewspaperSimple } from "@/components/newspaper/NewspaperSimple";
import { appConfig } from "@/lib/appConfig";
import { useTheme } from 'next-themes';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AIEditableProvider } from "@/components/AIEditableContext";
import { exportNewspaperJSON, importNewspaperJSON } from "@/components/edit-cache";

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
  const [pageFocused, _setPageFocused] = useState(true);
  const [exportError, setExportError] = useState<string | null>(null);
  const globalImgInputRef = useRef<HTMLInputElement>(null);
  const [pendingImgUpload, setPendingImgUpload] = useState<null | { type: string; key: string; cb: (file: File) => void }>(null);
  const [exportingJPEG, setExportingJPEG] = useState(false);
  const [exportingSVG, setExportingSVG] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [exportingWEBP, setExportingWEBP] = useState(false);
  // JSON import/export ref
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const errorMsg1 = "Your download may time out. Please check your connection or try again.";
  const errorMsg2 = "Your download may have failed. Please check and try again.";

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
  // Download related logic
  const exportErrorMsg = 'Please refresh page or switch template and try again!';
  // Reset all export states
  const resetExportState = useCallback(() => {
    setExportingImg(false);
    setExportingJPEG(false);
    setExportingSVG(false);
    setExportingPDF(false);
    setExportingWEBP(false);
    setExportError(null);
    restoreAfterExport();
  }, [restoreAfterExport]);
  const handleExportJPEG = async () => {
    resetExportState();
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    setExportMenuOpen(false);
    tryExport('jpeg');
  };
  const handleExportPNG = async () => {
    resetExportState();
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    setExportMenuOpen(false);
    tryExport('png');
  };
  const handleExportSVG = async () => {
    resetExportState();
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    setExportMenuOpen(false);
    tryExport('svg');
  };
  const handleExportPDF = async () => {
    resetExportState();
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    setExportMenuOpen(false);
    tryExport('pdf');
  };
  const handleExportWEBP = async () => {
    resetExportState();
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    setExportMenuOpen(false);
    setExportingWEBP(true);
    const timeoutId = setTimeout(() => {
      finishExport('webp', [timeoutId], true);
      setExportError(errorMsg1);
    }, 10000);
    try {
      await prepareForExport();
      if (!areaRef.current) throw new Error('Export area lost');
      const domtoimage = await import('dom-to-image-more');
      const dataUrl = await domtoimage.toPng(areaRef.current as HTMLElement, { scale: appConfig.export?.scale || window.devicePixelRatio || 2 });
      // PNG to WEBP
      const img = new window.Image();
      img.src = dataUrl;
      img.onload = function() {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(blob => {
              if (blob) {
                const link = document.createElement('a');
                link.download = `${selectedKey || 'newspaper'}.webp`;
                link.href = URL.createObjectURL(blob);
                link.click();
                setTimeout(() => URL.revokeObjectURL(link.href), 1000);
              }
              finishExport('webp', [timeoutId]);
            }, 'image/webp', 0.95);
          } else {
            finishExport('webp', [timeoutId], true);
            setExportError('Canvas not supported');
          }
        } catch (e) {
          console.error(e);
          finishExport('webp', [timeoutId], true);
        }
      };
      img.onerror = function() {
        finishExport('webp', [timeoutId], true);
      };
    } catch (e) {
      console.error(e);
      finishExport('webp', [timeoutId], true);
    }
  };
  const finishExport = useCallback((type: 'png' | 'jpeg' | 'svg' | 'pdf' | 'webp', timeoutIds: NodeJS.Timeout[] = [], isError = false) => {
    restoreAfterExport();
    setExportingImg(false);
    setExportingJPEG(false);
    setExportingSVG(false);
    setExportingPDF(false);
    setExportingWEBP(false);
    timeoutIds.forEach(id => clearTimeout(id));
    if (isError) setExportError(errorMsg2);
  }, [restoreAfterExport]);
  const tryExport = useCallback(async (type: 'png' | 'jpeg' | 'svg' | 'pdf') => {
    if (type === 'png') setExportingImg(true);
    if (type === 'jpeg') setExportingJPEG(true);
    if (type === 'svg') setExportingSVG(true);
    if (type === 'pdf') setExportingPDF(true);
    const timeoutId = setTimeout(() => {
      finishExport(type, [timeoutId, pdfTimeoutId], true);
      setExportError(errorMsg1);
      // 10s timeout
    }, 10000);
    let finished = false;
    const pdfTimeoutId = setTimeout(() => {
      finish(true);
    }, 5000);
    const finish = (isTimeout = false) => {
      if (finished) return;
      finished = true;
      finishExport(type, [timeoutId, pdfTimeoutId], isTimeout);
    };
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
            // Create PDF canvas with image actual width and height, fill the entire PDF page without margin
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
      finish(true);
    }
  }, [selectedKey, prepareForExport, areaRef, finishExport]);
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

  // JSON export
  const handleExportJSON = useCallback(() => {
    try {
      // Only export string fields, keep number type fields
      const data = template === 'simple'
        ? Object.fromEntries(Object.entries(simpleContent).filter(([_k, v]) => typeof v === 'string')) as Record<string, string>
        : Object.fromEntries(Object.entries(modernContent).filter(([_k, v]) => typeof v === 'string')) as Record<string, string>;
      exportNewspaperJSON(template, data);
    } catch (e) {
      console.error(e);
      setExportError('errorMsg2');
    }
  }, [template, simpleContent, modernContent]);

  // JSON import
  const handleImportJSON = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    importNewspaperJSON(
      file!,
      (data) => {
        if (data.templateType === 'simple') {
          setTemplate('simple');
          setSelectedKey('simple');
          setSimpleContent(prev => ({
            ...prev,
            ...data.content,
            aiTitleMaxChars: prev.aiTitleMaxChars,
            aiMaxChars: prev.aiMaxChars
          }));
        } else if (data.templateType === 'modern') {
          setTemplate('modern');
          setSelectedKey('modern');
          setModernContent(prev => ({
            ...prev,
            ...data.content,
            aiTitleMaxChars: prev.aiTitleMaxChars,
            aiMaxChars: prev.aiMaxChars
          }));
        } else {
          setExportError('JSON structure is incorrect');
        }
      },
      (errMsg) => {
        setExportError(errMsg || 'errorMsg2');
      }
    );
    e.target.value = '';
  }, []);

  return (
    <>
      <AdsAlertDialog
        open={!!exportError}
        onOpenChange={open => {
          if (!open) {
            resetExportState();
          }
        }}
        title="Downloading"
        description={exportError}
        imgSrc="/ads/Ad-Pollo.webp"
        imgHref="https://pollo.ai/home?ref=mzmzndj&tm_news=news"
      />
      <div className="flex justify-center items-start py-2 gap-2 px-4 md:gap-4 md:px-12">
        {/* Template card area */}
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
              {/* Top name and ad close button */}
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
        {/* Newspaper content block + operation button vertically centered */}
        <div className="flex flex-col items-center mt-[-40px] mr-8">
          {/* Operation area: social icons + export button */}
          <div className="mb-2 w-full max-w-[700px] px-8 flex flex-row justify-between items-center">
            {/* Social icon area TODO */}
            <div className="flex flex-row">
              {Array.isArray(appConfig.socialConfig) && appConfig.socialConfig.length > 0 && appConfig.socialConfig.map(icon => {
                const iconKey = icon.key as keyof typeof icons;
                const IconComp = icons[iconKey];
                return IconComp ? (
                  <button key={icon.key} className="rounded-full p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition" title={icon.name}>
                    <IconComp className="w-5 h-5" />
                  </button>
                ) : null;
              })}
            </div>
            {/* Export button area */}
            <div className="relative flex">
              {/* Left area: main operation */}
              <button
                ref={exportBtnRef}
                className={`flex-1 flex items-center px-4 py-1 text-neutral-700 dark:text-white text-sm font-semibold transition focus:outline-none rounded-l-full hover:bg-neutral-200 dark:hover:bg-neutral-700 ${exportingJPEG || !pageFocused ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={exportingJPEG || !pageFocused}
                onClick={handleExportJPEG}
                onMouseDown={e => { if (e.button === 2) e.preventDefault(); }}
              >
                <icons.ImageDown className="w-5 h-5 mr-2" /> Download JPG
              </button>
              {/* Right area: dropdown */}
              <span
                className="flex items-center justify-center w-10 h-8 cursor-pointer transition hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-r-full"
                onClick={e => { e.stopPropagation(); setExportMenuOpen(v => !v); }}
                tabIndex={0}
              >
                <icons.ChevronDown className="w-6 h-6" />
              </span>
              {/* Dropdown menu (existing functionality remains) */}
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
                  <button onClick={handleExportWEBP} className="flex items-center w-full px-4 py-3 transition hover:bg-neutral-200 dark:hover:bg-neutral-600 text-left disabled:opacity-60" disabled={exportingWEBP || !pageFocused}>
                    <icons.ImageDown className="w-5 h-5 mr-2" />Download WEBP
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
                  {/* New JSON import/export button area */}
                  <div style={{ borderTop: '1px solid #AC62FD' }}>
                    <button
                      onClick={() => jsonInputRef.current?.click()}
                      className="flex items-center w-full px-4 py-3 transition hover:bg-neutral-200 dark:hover:bg-neutral-600 text-left relative"
                    >
                      <icons.FileInput className="w-5 h-5 mr-2" />Import JSON
                      <span
                        className="absolute right-3 top-1 text-[10px] font-semibold"
                        style={{ color: '#a855f7', pointerEvents: 'none' }}
                      >
                        Beta
                      </span>
                    </button>
                    <button onClick={handleExportJSON} className="flex items-center w-full px-4 py-3 transition hover:bg-neutral-200 dark:hover:bg-neutral-600 text-left relative">
                      <icons.FileDown className="w-5 h-5 mr-2" />Export JSON
                      <span
                        className="absolute right-3 top-1 text-[10px] font-semibold"
                        style={{ color: '#a855f7', pointerEvents: 'none' }}
                      >
                        Beta
                      </span>
                    </button>
                    <input
                      ref={jsonInputRef}
                      type="file"
                      accept="application/json"
                      style={{ display: 'none' }}
                      onChange={handleImportJSON}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Global image upload input, hidden */}
          <input ref={globalImgInputRef} type="file" accept="image/*" className="hidden" onChange={onGlobalImgInputChange} />
          {/* Newspaper template content, export area, no buttons */}
          <section
            key={theme + '-' + pathname + '-' + template + '-' + pageFocused}
            ref={areaRef}
            className="newspaper-bg shadow-lg rounded-lg px-8 py-6 w-[700px] min-h-[900px] flex flex-col gap-4 transition-colors duration-300 flex-shrink-0 mr-8"
            style={{
              border: '1px solid rgba(255,255,255,0)', // Transparent white border, fallback black line
            }}
          >
            <AIEditableProvider>
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
            </AIEditableProvider>
          </section>
        </div>
      </div>
    </>
  );
} 
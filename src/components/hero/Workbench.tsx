"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AdsAlertDialog, XButton } from "@windrun-huaiin/third-ui/main";
import { globalLucideIcons as icons } from "@windrun-huaiin/base-ui/components/server";
import { NewspaperModern } from "@/components/newspaper/NewspaperModern";
import { NewspaperSimple } from "@/components/newspaper/NewspaperSimple";
import { appConfig } from "@/lib/appConfig";
import { AIEditableProvider } from "@/components/AIEditableContext";
import { exportNewspaperJSON, importNewspaperJSON } from "@/components/edit-cache";

interface WorkbenchProps {
  template: "simple" | "modern";
  content: any;
  onContentChange: (key: string, value: string) => void;
  imgs: any;
  onImgChange: (key: string, file: File) => void;
  onGlobalImgUpload: (key: string, cb: (file: File) => void) => void;
  onSwitchTemplate: () => void; // Handler to open template drawer
}

export function Workbench({
  template,
  content,
  onContentChange,
  imgs,
  onImgChange,
  onGlobalImgUpload,
  onSwitchTemplate
}: WorkbenchProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  // Export State
  const [exportingImg, setExportingImg] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [pageFocused, setPageFocused] = useState(true);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportingJPEG, setExportingJPEG] = useState(false);
  const [exportingSVG, setExportingSVG] = useState(false);
  const [exportingWEBP, setExportingWEBP] = useState(false);
  
  const jsonInputRef = useRef<HTMLInputElement>(null);

  // --- Scale Logic ---
  useEffect(() => {
    const calculateScale = () => {
      const w = window.innerWidth;
      // Newspaper base width is 700px.
      // We need to account for the outer container padding (e.g., 16px * 2 = 32px)
      const targetWidth = 700;
      const padding = 32; 
      
      if (w < targetWidth + padding) {
        setScale((w - padding) / targetWidth);
      } else {
        setScale(1);
      }
    };
    
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // --- Export Logic (Ported from hero_old) ---
  const errorMsg1 = "Your download may time out. Please check your connection or try again.";
  const errorMsg2 = "Your download may have failed. Please check and try again.";
  const exportErrorMsg = 'Please refresh page or switch template and try again!';

  // Page focus management
  useEffect(() => {
    const handleFocus = () => setPageFocused(true);
    const handleBlur = () => setPageFocused(false);
    const handleVisibilityChange = () => {
      setPageFocused(!document.hidden);
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const prepareForExport = useCallback(async () => {
    if (!areaRef.current) return;
    areaRef.current.classList.add('exporting');
    await document.fonts.ready;
  }, []);

  const restoreAfterExport = useCallback(() => {
    if (!areaRef.current) return;
    areaRef.current.classList.remove('exporting');
  }, []);

  const resetExportState = useCallback(() => {
    setExportingImg(false);
    setExportingJPEG(false);
    setExportingSVG(false);
    setExportingPDF(false);
    setExportingWEBP(false);
    setExportError(null);
    restoreAfterExport();
  }, [restoreAfterExport]);

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
      const scaleOpts = { scale: appConfig.export?.scale || window.devicePixelRatio || 2 };

      if (type === 'png') {
        dataUrl = await domtoimage.toPng(areaRef.current as HTMLElement, scaleOpts);
      } else if (type === 'jpeg') {
        dataUrl = await domtoimage.toJpeg(areaRef.current as HTMLElement, { ...scaleOpts, quality: 0.95, bgcolor: '#f5f5e5' });
      } else if (type === 'svg') {
        dataUrl = await domtoimage.toSvg(areaRef.current as HTMLElement, scaleOpts);
      } else if (type === 'pdf') {
        dataUrl = await domtoimage.toJpeg(areaRef.current as HTMLElement, { scale: appConfig.export?.pdfScale || 1.5, quality: 0.85, bgcolor: '#f5f5e5' });
      }

      if (!dataUrl) throw new Error('Export failed');

      if (type === 'png' || type === 'jpeg' || type === 'svg') {
        const link = document.createElement("a");
        link.download = `${template || 'newspaper'}.${type === 'jpeg' ? 'jpg' : type}`;
        link.href = dataUrl;
        link.click();
        finish();
      } else if (type === 'pdf') {
        const { default: jsPDF } = await import('jspdf');
        const img = new window.Image();
        img.src = dataUrl;
        img.onload = function() {
          try {
            const pdf = new jsPDF({
              orientation: img.width > img.height ? 'l' : 'p',
              unit: 'pt',
              format: [img.width, img.height]
            });
            pdf.addImage(dataUrl, "JPEG", 0, 0, img.width, img.height);
            pdf.save(`${template || 'newspaper'}.pdf`);
          } finally {
            finish();
          }
        };
        img.onerror = () => finish();
        return;
      }
    } catch (e) {
      console.error(e);
      finish(true);
    }
  }, [prepareForExport, finishExport, template]);

  const handleExportJPEG = async () => {
    resetExportState();
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    tryExport('jpeg');
  };

  const handleExportPNG = async () => {
    resetExportState();
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    tryExport('png');
  };

  const handleExportSVG = async () => {
    resetExportState();
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    tryExport('svg');
  };

  const handleExportPDF = async () => {
    resetExportState();
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    tryExport('pdf');
  };

  const handleExportWEBP = async () => {
    resetExportState();
    if (!pageFocused) return;
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
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
                link.download = `${template || 'newspaper'}.webp`;
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

  const handleExportJSON = useCallback(() => {
    try {
      const data = Object.fromEntries(Object.entries(content).filter(([_k, v]) => typeof v === 'string')) as Record<string, string>;
      exportNewspaperJSON(template, data);
    } catch (e) {
      console.error(e);
      setExportError('errorMsg2');
    }
  }, [template, content]);
  
  const handleImportJSON = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    importNewspaperJSON(
      file,
      (data) => {
        if (data.templateType === template) {
             Object.entries(data.content).forEach(([k, v]) => {
                 if (typeof v === 'string') onContentChange(k, v);
             });
        } else {
          setExportError('JSON structure is incorrect or template mismatch');
        }
      },
      (errMsg) => {
        setExportError(errMsg || 'errorMsg2');
      }
    );
    e.target.value = '';
  }, [template, onContentChange]);


  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-30 bg-neutral-100 dark:bg-neutral-950 overflow-y-auto">
      <AdsAlertDialog
        open={!!exportError}
        onOpenChange={open => !open && setExportError(null)}
        title="Downloading..."
        description={exportError || "Preparing your newspaper..."}
        imgSrc="https://r2.d8ger.com/Ad-Pollo.webp"
        imgHref="https://pollo.ai/home?ref=mzmzndj&tm_news=news"
      />

      {/* --- Main Vertical Stack --- */}
      <div className="flex flex-col items-center gap-x-2 gap-y-2 w-full px-2">
        {/* 1. Toolbar Row (Not sticky, just part of the flow) */}
        <div className="w-full max-w-[700px] flex justify-between items-center z-10">
            {/* Left: Back & Switch */}
            <div className="flex items-center gap-2">
                <XButton 
                    type="single"
                    button={{
                        text: "Change Template",
                        icon: <icons.LayoutTemplate className="w-5 h-5" />,
                        onClick: onSwitchTemplate
                    }}
                    className="text-xs sm:text-sm px-2 sm:px-4 w-auto flex-1"
                />
            </div>

            {/* Right: Download */}
            <div className="flex items-center gap-2">
                 <XButton
                    type="split"
                    className="flex-row sm:flex-row"
                    mainButton={{
                      icon:  <icons.ImageDown className="w-5 h-5 sm:mr-2" />,
                      text: "Download",
                      onClick: handleExportJPEG,
                      disabled: exportingJPEG || !pageFocused
                    }}
                    menuWidth="w-40 sm:w-56"
                    mainButtonClassName="text-xs sm:text-sm px-2 sm:px-4"
                    dropdownButtonClassName=""
                    menuItems={[
                      { 
                          icon: <icons.ImageDown className="w-5 h-5 sm:mr-2" />, 
                          text: "JPG Image", 
                          onClick: handleExportJPEG,
                          disabled: exportingJPEG || !pageFocused
                      },
                      { 
                          icon: <icons.ImageDown className="w-5 h-5 sm:mr-2" />, 
                          text: "PNG Image", 
                          onClick: handleExportPNG,
                          disabled: exportingImg || !pageFocused
                      },
                      {
                        icon: <icons.ImageDown className="w-5 h-5 sm:mr-2" />,
                        text: "WEBP Image",
                        onClick: handleExportWEBP,
                        disabled: exportingWEBP || !pageFocused
                      },
                      { 
                          icon: <icons.FileDown className="w-5 h-5 sm:mr-2" />, 
                          text: "PDF File", 
                          onClick: handleExportPDF, 
                          disabled: exportingPDF || !pageFocused,
                          splitTopBorder: true 
                      },
                      {
                        icon: <icons.ImageDown className="w-5 h-5 sm:mr-2" />,
                        text: "SVG Image",
                        onClick: handleExportSVG,
                        disabled: exportingSVG || !pageFocused,
                        tag: { text: "Beta" }
                      },
                      {
                        icon: <icons.FileInput className="w-5 h-5 sm:mr-2" />,
                        text: "Import JSON",
                        onClick: () => jsonInputRef.current?.click(),
                        tag: { text: "Beta", color: '#a855f7' },
                        splitTopBorder: true
                      },
                      { 
                          icon: <icons.FileDown className="w-5 h-5 sm:mr-2" />, 
                          text: "Export JSON", 
                          onClick: handleExportJSON, 
                          tag: {text: 'Beta', color: '#a855f7'} 
                      },
                    ]}
                  />
                  <input
                    ref={jsonInputRef}
                    type="file"
                    accept="application/json"
                    style={{ display: 'none' }}
                    onChange={handleImportJSON}
                  />
            </div>
        </div>

        {/* 2. Scaled Newspaper Container */}
        {/* We keep the scale logic for mobile fit, but apply styles to inner card to match legacy look */}
        <div 
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                width: 700, // Fixed layout width
                marginBottom: (1 - scale) * -1000 // compensate vertical space
            }}
            className="transition-transform duration-300 ease-out z-0"
        >
             {/* The Newspaper Card (Legacy Style) */}
             <section
                 ref={areaRef}
                 className="newspaper-bg shadow-2xl rounded-xl px-8 py-6 w-[700px] min-h-[900px] flex flex-col gap-4 bg-white"
                 style={{
                    // Optional: texture or border fallback
                 }}
             >
                 <AIEditableProvider>
                     {template === 'simple' ? (
                        <NewspaperSimple 
                            mainImg={imgs.mainImg}
                            sideImg={imgs.sideImg}
                            bottomImg={imgs.bottomImg}
                            onMainImgChange={(f) => onImgChange('mainImg', f)}
                            onSideImgChange={(f) => onImgChange('sideImg', f)}
                            onBottomImgChange={(f) => onImgChange('bottomImg', f)}
                            onTriggerImgUpload={onGlobalImgUpload}
                            content={content}
                            onContentChange={onContentChange}
                        />
                     ) : (
                        <NewspaperModern 
                            mainImg={imgs.mainImg}
                            subImg={imgs.subImg}
                            flowers={imgs.flowers}
                            onMainImgChange={(f) => onImgChange('mainImg', f)}
                            onSubImgChange={(f) => onImgChange('subImg', f)}
                            onTriggerImgUpload={onGlobalImgUpload}
                            content={content}
                            onContentChange={onContentChange}
                        />
                     )}
                 </AIEditableProvider>
             </section>
        </div>
        
      </div>
    </div>
  );
}

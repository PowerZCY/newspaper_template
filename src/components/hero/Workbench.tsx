"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { XButton } from "@windrun-huaiin/third-ui/main";
import { globalLucideIcons as icons } from "@windrun-huaiin/base-ui/components/server";
import { NewspaperModern } from "@/components/newspaper/NewspaperModern";
import { NewspaperSimple } from "@/components/newspaper/NewspaperSimple";
import { NewspaperSongChinese } from "@/components/newspaper/NewspaperSongChinese";
import { NewspaperSongEnglish } from "@/components/newspaper/NewspaperSongEnglish";
import { appConfig } from "@/lib/appConfig";
import { AIEditableProvider } from "@/components/AIEditableContext";
import {
  exportNewspaperJSON,
  importNewspaperJSON,
  clearNewspaperCache,
} from "@/components/edit-cache";
import { HighPriorityConfirmDialog } from "@/components/HighPriorityConfirmDialog";

interface WorkbenchProps {
  template: "simple" | "modern" | "song_cn" | "song_en";
  content: any;
  onContentChange: (key: string, value: string | number) => void;
  onBatchContentChange?: (content: Record<string, string | number>) => void;
  imgs: any;
  onImgChange: (key: string, file: File) => void;
  onGlobalImgUpload: (key: string, cb: (file: File) => void) => void;
  onSwitchTemplate: () => void; // Handler to open template drawer
  onReset: () => void;
}

export function Workbench({
  template,
  content,
  onContentChange,
  onBatchContentChange,
  imgs,
  onImgChange,
  onGlobalImgUpload,
  onSwitchTemplate,
  onReset,
}: WorkbenchProps) {
  const router = useRouter();
  const areaRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Export State - Unified
  type ExportStatus = "idle" | "png" | "jpeg" | "svg" | "pdf" | "webp";
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");

  const [_pageFocused, setPageFocused] = useState(true);
  const [exportError, setExportError] = useState<string | null>(null);

  const isGlobalExporting = exportStatus !== "idle";

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
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  // --- Export Logic (Ported from hero_old) ---
  const errorMsg1 =
    "Your download may time out. Please check your connection or try again.";
  const errorMsg2 =
    "Your download may have failed. Please check and try again.";
  const exportErrorMsg =
    "Please refresh page or switch template and try again!";

  // Page focus management
  useEffect(() => {
    const handleFocus = () => setPageFocused(true);
    const handleBlur = () => setPageFocused(false);
    const handleVisibilityChange = () => {
      setPageFocused(!document.hidden);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const getScaleForExport = (type: "png" | "jpeg" | "svg" | "pdf" | "webp") => {
    const defaultScale =
      appConfig.export?.scale || window.devicePixelRatio || 2;
    if (type === "jpeg") return appConfig.export?.jpegScale ?? defaultScale;
    if (type === "pdf") return appConfig.export?.pdfScale ?? defaultScale;
    return defaultScale;
  };

  const prepareForExport = useCallback(async () => {
    if (!areaRef.current) return;
    areaRef.current.classList.add("exporting");
    await document.fonts.ready;
  }, []);

  const restoreAfterExport = useCallback(() => {
    if (!areaRef.current) return;
    areaRef.current.classList.remove("exporting");
  }, []);

  const resetExportState = useCallback(() => {
    console.log("[Workbench] Force resetting export state...");
    // Wrap in setTimeout to ensure it runs in next tick, helpful if main thread is heavy
    setTimeout(() => {
      setExportStatus("idle");
      setExportError(null);
      restoreAfterExport();
    }, 0);
  }, [restoreAfterExport]);

  const finishExport = useCallback(
    (
      type: "png" | "jpeg" | "svg" | "pdf" | "webp",
      timeoutIds: NodeJS.Timeout[] = [],
      isError = false
    ) => {
      restoreAfterExport();
      setExportStatus("idle");
      timeoutIds.forEach((id) => clearTimeout(id));
      if (isError) setExportError(errorMsg2);
    },
    [restoreAfterExport]
  );

  const tryExport = useCallback(
    async (type: "png" | "jpeg" | "svg" | "pdf") => {
      setExportStatus(type);

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
        if (!areaRef.current) throw new Error("Export area lost");
        const htmlToImage = await import("html-to-image");
        let dataUrl;
        const scaleOpts = { scale: getScaleForExport(type) };

        if (type === "png") {
          dataUrl = await htmlToImage.toPng(
            areaRef.current as HTMLElement,
            scaleOpts
          );
        } else if (type === "jpeg") {
          dataUrl = await htmlToImage.toJpeg(areaRef.current as HTMLElement, {
            ...scaleOpts,
            quality: 0.95,
            bgcolor: "#f5f5e5",
          });
        } else if (type === "svg") {
          dataUrl = await htmlToImage.toSvg(
            areaRef.current as HTMLElement,
            scaleOpts
          );
        } else if (type === "pdf") {
          dataUrl = await htmlToImage.toJpeg(areaRef.current as HTMLElement, {
            scale: getScaleForExport("pdf"),
            quality: 0.85,
            bgcolor: "#f5f5e5",
          });
        }

        if (!dataUrl) throw new Error("Export failed");

        if (type === "png" || type === "jpeg" || type === "svg") {
          const link = document.createElement("a");
          link.download = `${template || "newspaper"}.${
            type === "jpeg" ? "jpg" : type
          }`;
          link.href = dataUrl;
          link.click();
          finish();
        } else if (type === "pdf") {
          const { default: jsPDF } = await import("jspdf");
          const img = new window.Image();
          img.src = dataUrl;
          img.onload = function () {
            try {
              const pdf = new jsPDF({
                orientation: img.width > img.height ? "l" : "p",
                unit: "pt",
                format: [img.width, img.height],
              });
              pdf.addImage(dataUrl, "JPEG", 0, 0, img.width, img.height);
              pdf.save(`${template || "newspaper"}.pdf`);
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
    },
    [prepareForExport, finishExport, template]
  );

  const handleExportJPEG = async () => {
    resetExportState();
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    tryExport("jpeg");
  };

  const handleExportPNG = async () => {
    resetExportState();
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    tryExport("png");
  };

  const handleExportSVG = async () => {
    resetExportState();
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    tryExport("svg");
  };

  const handleExportPDF = async () => {
    resetExportState();
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    tryExport("pdf");
  };

  const handleExportWEBP = async () => {
    resetExportState();
    if (!areaRef.current) {
      setExportError(exportErrorMsg);
      return;
    }
    setExportStatus("webp");
    const timeoutId = setTimeout(() => {
      finishExport("webp", [timeoutId], true);
      setExportError(errorMsg1);
    }, 10000);
    try {
      await prepareForExport();
      if (!areaRef.current) throw new Error("Export area lost");
      const htmlToImage = await import("html-to-image");
      const dataUrl = await htmlToImage.toPng(areaRef.current as HTMLElement, {
        scale: getScaleForExport("webp"),
      });

      const img = new window.Image();
      img.src = dataUrl;
      img.onload = function () {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const link = document.createElement("a");
                  link.download = `${template || "newspaper"}.webp`;
                  link.href = URL.createObjectURL(blob);
                  link.click();
                  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
                }
                finishExport("webp", [timeoutId]);
              },
              "image/webp",
              0.95
            );
          } else {
            finishExport("webp", [timeoutId], true);
            setExportError("Canvas not supported");
          }
        } catch (e) {
          console.error(e);
          finishExport("webp", [timeoutId], true);
        }
      };
      img.onerror = function () {
        finishExport("webp", [timeoutId], true);
      };
    } catch (e) {
      console.error(e);
      finishExport("webp", [timeoutId], true);
    }
  };

  const handleExportJSON = useCallback(() => {
    try {
      const data = Object.fromEntries(
        Object.entries(content).filter(
          ([_k, v]) => typeof v === "string" || typeof v === "number"
        )
      ) as Record<string, string | number>;
      exportNewspaperJSON(template, data);
    } catch (e) {
      console.error(e);
      setExportError("errorMsg2");
    }
  }, [template, content]);

  const handleImportJSON = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      importNewspaperJSON(
        file,
        (data) => {
          if (data.templateType === template) {
            if (onBatchContentChange) {
              onBatchContentChange(data.content);
            } else {
              // Fallback for individual updates (should not happen if batch implemented)
              Object.entries(data.content).forEach(([k, v]) => {
                if (typeof v === "string" || typeof v === "number")
                  onContentChange(k, v);
              });
            }
          } else {
            setExportError("JSON structure is incorrect or template mismatch");
          }
        },
        (errMsg) => {
          setExportError(errMsg || "errorMsg2");
        }
      );
      e.target.value = "";
    },
    [template, onContentChange, onBatchContentChange]
  );

  // --- Exit Confirmation Logic ---
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<
    string | null
  >(null);

  useEffect(() => {
    // 1. Prevent accidental refresh/close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 2. Prevent back button
    // Push a state so we have something to pop
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // When back is pressed, prevent navigation by pushing state again and showing dialog
      window.history.pushState(null, "", window.location.href);
      setPendingNavigationUrl(null); // Back button generally means "exit/back", handled by default switch
      setShowExitDialog(true);
    };

    window.addEventListener("popstate", handlePopState);

    // 3. Intercept global anchor clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target) {
        const href = target.getAttribute("href");
        const download = target.getAttribute("download");
        const targetAttr = target.getAttribute("target");

        // Ignore if it's a download link, external tab, or hash
        if (
          download !== null ||
          targetAttr === "_blank" ||
          !href ||
          href.startsWith("#")
        ) {
          return;
        }

        // Prevent default navigation
        e.preventDefault();
        e.stopPropagation();
        setPendingNavigationUrl(href);
        setShowExitDialog(true);
      }
    };

    // Capture phase to ensure we intercept before Next.js Link
    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, []);

  const handleConfirmExit = () => {
    // Clear cache to prevent state pollution on re-entry
    clearNewspaperCache(template);
    // Reset parent state
    onReset();

    setShowExitDialog(false);
    if (pendingNavigationUrl) {
      router.push(pendingNavigationUrl);
    } else {
      onSwitchTemplate();
    }
  };

  const handleCancelExit = () => {
    setShowExitDialog(false);
    setPendingNavigationUrl(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-30 bg-neutral-100 dark:bg-neutral-950 overflow-y-auto">
      <HighPriorityConfirmDialog
        open={!!exportError}
        onCancel={resetExportState}
        onConfirm={resetExportState}
        title="Notice"
        description={exportError || "Processing..."}
        confirmText="OK"
        cancelText="Close"
      />

      <HighPriorityConfirmDialog
        open={showExitDialog}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
        title="Leave the Editor?"
        description={
          <>
            You have unsaved changes. <br />
            If you leave now, your progress will be lost.
          </>
        }
        confirmText="Leave"
        cancelText="Stay"
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
                onClick: () => setShowExitDialog(true),
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
                icon: isGlobalExporting ? (
                  <icons.Loader2 className="w-5 h-5 sm:mr-2 animate-spin" />
                ) : (
                  <icons.ImageDown className="w-5 h-5 sm:mr-2" />
                ),
                text: isGlobalExporting ? "Processing..." : "Download",
                onClick: handleExportJPEG,
                disabled: isGlobalExporting,
              }}
              menuWidth="w-40 sm:w-56"
              mainButtonClassName="text-xs sm:text-sm px-2 sm:px-4"
              dropdownButtonClassName=""
              menuItems={[
                {
                  icon: <icons.ImageDown className="w-5 h-5 sm:mr-2" />,
                  text: "JPG Image",
                  onClick: handleExportJPEG,
                  disabled: isGlobalExporting,
                },
                {
                  icon: <icons.ImageDown className="w-5 h-5 sm:mr-2" />,
                  text: "PNG Image",
                  onClick: handleExportPNG,
                  disabled: isGlobalExporting,
                },
                {
                  icon: <icons.ImageDown className="w-5 h-5 sm:mr-2" />,
                  text: "WEBP Image",
                  onClick: handleExportWEBP,
                  disabled: isGlobalExporting,
                },
                {
                  icon: <icons.FileDown className="w-5 h-5 sm:mr-2" />,
                  text: "PDF File",
                  onClick: handleExportPDF,
                  disabled: isGlobalExporting,
                  splitTopBorder: true,
                },
                {
                  icon: <icons.ImageDown className="w-5 h-5 sm:mr-2" />,
                  text: "SVG Image",
                  onClick: handleExportSVG,
                  disabled: isGlobalExporting,
                  tag: { text: "Beta" },
                },
                {
                  icon: <icons.FileInput className="w-5 h-5 sm:mr-2" />,
                  text: "Import JSON",
                  onClick: () => jsonInputRef.current?.click(),
                  disabled: isGlobalExporting,
                  splitTopBorder: true,
                },
                {
                  icon: <icons.FileDown className="w-5 h-5 sm:mr-2" />,
                  text: "Export JSON",
                  onClick: handleExportJSON,
                  disabled: isGlobalExporting,
                },
                {
                  icon: <icons.RefreshCcw className="w-5 h-5 sm:mr-2" />,
                  text: "Force Refresh",
                  onClick: resetExportState,
                  splitTopBorder: true,
                  tag: { text: "Fix", color: "#ef4444" },
                },
              ]}
            />
            <input
              ref={jsonInputRef}
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={handleImportJSON}
            />
          </div>
        </div>

        {/* 2. Scaled Newspaper Container */}
        {/* We keep the scale logic for mobile fit, but apply styles to inner card to match legacy look */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: 700, // Fixed layout width
            marginBottom: (1 - scale) * -1000, // compensate vertical space
          }}
          className="transition-transform duration-300 ease-out z-0"
        >
          {/* The Newspaper Card (Legacy Style) */}
          <section
            ref={areaRef}
            className="newspaper-bg shadow-2xl rounded-xl mt-4 sm:mt-0 px-8 py-6 w-[700px] min-h-[900px] flex flex-col gap-4 bg-white"
            style={
              {
                // Optional: texture or border fallback
              }
            }
          >
            <AIEditableProvider>
              {template === "simple" && (
                <NewspaperSimple
                  mainImg={imgs.mainImg}
                  sideImg={imgs.sideImg}
                  bottomImg={imgs.bottomImg}
                  onMainImgChange={(f) => onImgChange("mainImg", f)}
                  onSideImgChange={(f) => onImgChange("sideImg", f)}
                  onBottomImgChange={(f) => onImgChange("bottomImg", f)}
                  onTriggerImgUpload={onGlobalImgUpload}
                  content={content}
                  onContentChange={onContentChange}
                />
              )}
              {template === "modern" && (
                <NewspaperModern
                  mainImg={imgs.mainImg}
                  subImg={imgs.subImg}
                  flowers={imgs.flowers}
                  onMainImgChange={(f) => onImgChange("mainImg", f)}
                  onSubImgChange={(f) => onImgChange("subImg", f)}
                  onTriggerImgUpload={onGlobalImgUpload}
                  content={content}
                  onContentChange={onContentChange}
                />
              )}
              {template === "song_cn" && (
                <NewspaperSongChinese
                  mainImg={imgs.mainImg}
                  flowers={imgs.flowers}
                  onMainImgChange={(f) => onImgChange("mainImg", f)}
                  onTriggerImgUpload={onGlobalImgUpload}
                  content={content}
                  onContentChange={onContentChange}
                />
              )}
              {template === "song_en" && (
                <NewspaperSongEnglish
                  mainImg={imgs.mainImg}
                  flowers={imgs.flowers}
                  onMainImgChange={(f) => onImgChange("mainImg", f)}
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

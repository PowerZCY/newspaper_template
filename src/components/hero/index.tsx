"use client";

import React, { useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TemplateGallery } from "./TemplateGallery";
import { Workbench } from "./Workbench";
import { NEWSPAPER_TEMPLATES } from "@/components/newspaper/BaseConfig";

function HeroContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode') === 'editor' ? 'editor' : 'gallery';
  const templateParam = searchParams.get('template');
  const selectedTemplateKey = (templateParam === 'simple' || templateParam === 'modern') 
    ? templateParam 
    : 'simple';

  // --- Content State ---
  const [simpleContent, setSimpleContent] = useState({ ...NEWSPAPER_TEMPLATES.simple.defaultContent });
  const [modernContent, setModernContent] = useState({ ...NEWSPAPER_TEMPLATES.modern.defaultContent });
  
  // --- Image State ---
  const [simpleImgs, setSimpleImgs] = useState({ ...NEWSPAPER_TEMPLATES.simple.defaultImgs });
  const [modernImgs, setModernImgs] = useState({ ...NEWSPAPER_TEMPLATES.modern.defaultImgs });

  // --- Global Image Upload Logic ---
  const globalImgInputRef = useRef<HTMLInputElement>(null);
  const [pendingImgUpload, setPendingImgUpload] = useState<null | { type: string; key: string; cb: (file: File) => void }>(null);

  const handleSelectTemplate = (key: string) => {
    // Determine if key is valid (simple/modern). 
    if (key === 'simple' || key === 'modern') {
        const params = new URLSearchParams(searchParams.toString());
        params.set('mode', 'editor');
        params.set('template', key);
        router.push(`${pathname}?${params.toString()}`);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContentChange = (type: "simple" | "modern", key: string, value: string) => {
    if (type === "simple") {
      setSimpleContent(c => ({ ...c, [key]: value }));
    } else {
      setModernContent(c => ({ ...c, [key]: value }));
    }
  };

  const handleResetContent = (type: "simple" | "modern") => {
    if (type === "simple") {
      setSimpleContent({ ...NEWSPAPER_TEMPLATES.simple.defaultContent });
    } else {
      setModernContent({ ...NEWSPAPER_TEMPLATES.modern.defaultContent });
    }
  };

  const handleImgChange = (type: "simple" | "modern", key: string, file: File) => {
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

  // Helper for Global Upload (passed down to AIEditable/Newspaper)
  const handleGlobalImgUpload = (type: string, key: string, cb: (file: File) => void) => {
    setPendingImgUpload({ type, key, cb });
    // Small timeout to ensure state is set before click (React batching)
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

  return (
    <section className="relative w-full">
      {/* Hidden Global Input */}
      <input 
        ref={globalImgInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={onGlobalImgInputChange} 
      />

      {mode === 'gallery' ? (
        <TemplateGallery onSelect={handleSelectTemplate} />
      ) : (
        <div 
            className="fixed inset-0 z-200 bg-white dark:bg-black overflow-y-auto animate-in fade-in zoom-in-95 duration-300"
        >
            <Workbench
                template={selectedTemplateKey}
                content={selectedTemplateKey === 'simple' ? simpleContent : modernContent}
                imgs={selectedTemplateKey === 'simple' ? simpleImgs : modernImgs}
                onContentChange={(k, v) => handleContentChange(selectedTemplateKey, k, v)}
                onImgChange={(k, f) => handleImgChange(selectedTemplateKey, k, f)}
                onGlobalImgUpload={(k, cb) => handleGlobalImgUpload(selectedTemplateKey, k, cb)}
                onSwitchTemplate={() => router.push(pathname)} // Reuse Gallery as Switcher
                onReset={() => handleResetContent(selectedTemplateKey)}
            />
        </div>
      )}
    </section>
  );
}

export function Hero() {
  return (
    <Suspense>
      <HeroContent />
    </Suspense>
  )
}

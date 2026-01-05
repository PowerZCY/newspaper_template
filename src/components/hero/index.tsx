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
  
  // Validate template key
  const validKeys = ['simple', 'modern', 'song_cn', 'song_en'];
  const selectedTemplateKey = (templateParam && validKeys.includes(templateParam)) 
    ? templateParam as "simple" | "modern" | "song_cn" | "song_en"
    : 'simple';

  // --- Content State ---
  const [simpleContent, setSimpleContent] = useState({ ...NEWSPAPER_TEMPLATES.simple.defaultContent });
  const [modernContent, setModernContent] = useState({ ...NEWSPAPER_TEMPLATES.modern.defaultContent });
  const [songCnContent, setSongCnContent] = useState({ ...NEWSPAPER_TEMPLATES.song_cn.defaultContent });
  const [songEnContent, setSongEnContent] = useState({ ...NEWSPAPER_TEMPLATES.song_en.defaultContent });
  
  // --- Image State ---
  const [simpleImgs, setSimpleImgs] = useState({ ...NEWSPAPER_TEMPLATES.simple.defaultImgs });
  const [modernImgs, setModernImgs] = useState({ ...NEWSPAPER_TEMPLATES.modern.defaultImgs });
  const [songCnImgs, setSongCnImgs] = useState({ ...NEWSPAPER_TEMPLATES.song_cn.defaultImgs });
  const [songEnImgs, setSongEnImgs] = useState({ ...NEWSPAPER_TEMPLATES.song_en.defaultImgs });

  // --- Global Image Upload Logic ---
  const globalImgInputRef = useRef<HTMLInputElement>(null);
  const [pendingImgUpload, setPendingImgUpload] = useState<null | { type: string; key: string; cb: (file: File) => void }>(null);

  const handleSelectTemplate = (key: string) => {
    if (validKeys.includes(key)) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('mode', 'editor');
        params.set('template', key);
        router.push(`${pathname}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContentChange = (type: string, key: string, value: string) => {
    if (type === "simple") setSimpleContent(c => ({ ...c, [key]: value }));
    else if (type === "modern") setModernContent(c => ({ ...c, [key]: value }));
    else if (type === "song_cn") setSongCnContent(c => ({ ...c, [key]: value }));
    else if (type === "song_en") setSongEnContent(c => ({ ...c, [key]: value }));
  };

  const handleResetContent = (type: string) => {
    if (type === "simple") setSimpleContent({ ...NEWSPAPER_TEMPLATES.simple.defaultContent });
    else if (type === "modern") setModernContent({ ...NEWSPAPER_TEMPLATES.modern.defaultContent });
    else if (type === "song_cn") setSongCnContent({ ...NEWSPAPER_TEMPLATES.song_cn.defaultContent });
    else if (type === "song_en") setSongEnContent({ ...NEWSPAPER_TEMPLATES.song_en.defaultContent });
  };

  const handleImgChange = (type: string, key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const res = e.target?.result as string;
      if (type === "simple") setSimpleImgs(imgs => ({ ...imgs, [key]: res }));
      else if (type === "modern") setModernImgs(imgs => ({ ...imgs, [key]: res }));
      else if (type === "song_cn") setSongCnImgs(imgs => ({ ...imgs, [key]: res }));
      else if (type === "song_en") setSongEnImgs(imgs => ({ ...imgs, [key]: res }));
    };
    reader.readAsDataURL(file);
  };

  // Helper for Global Upload (passed down to AIEditable/Newspaper)
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

  // Determine current content/imgs based on selectedTemplateKey
  let currentContent, currentImgs;
  if (selectedTemplateKey === 'simple') { currentContent = simpleContent; currentImgs = simpleImgs; }
  else if (selectedTemplateKey === 'modern') { currentContent = modernContent; currentImgs = modernImgs; }
  else if (selectedTemplateKey === 'song_cn') { currentContent = songCnContent; currentImgs = songCnImgs; }
  else { currentContent = songEnContent; currentImgs = songEnImgs; }

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
                content={currentContent}
                imgs={currentImgs}
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

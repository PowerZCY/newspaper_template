"use client";

import React, { useState } from "react";
import Image from "next/image";
import { appConfig } from "@/lib/appConfig";
import { globalLucideIcons as icons } from "@windrun-huaiin/base-ui/components/server";

interface TemplateGalleryProps {
  onSelect: (templateKey: string) => void;
}

export function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  const [closedAds, setClosedAds] = useState<string[]>([]);
  
  const templates = [...appConfig.newspaperTemplates].sort((a, b) => (b.top ? 1 : 0) - (a.top ? 1 : 0));
  const visibleTemplates = templates.filter(
    tpl => !(tpl.type === 'ads' && closedAds.includes(tpl.key))
  );

  const handleCloseAd = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setClosedAds(prev => [...prev, key]);
  };

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center py-12 px-4 md:px-8 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="text-center max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-neutral-900 dark:text-neutral-50 tracking-tight">
          Create Your Newspaper <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
            in Seconds
          </span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Choose a template below to start your immersive editing experience. 
          Upload photos, generate AI text, and download high-quality prints.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl">
        {visibleTemplates.map((tpl, idx) => (
          <div
            key={tpl.key}
            className={`
              group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300
              ${tpl.type === 'ads' ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900' : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'}
              animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards
            `}
            style={{ animationDelay: `${idx * 100}ms` }}
            onClick={() => {
                if (tpl.href) {
                    window.open(tpl.href, "_blank");
                } else {
                    onSelect(tpl.key);
                }
            }}
          >
            {/* Header / Tags */}
            <div className="px-4 py-3 flex justify-between items-center border-b border-neutral-100 dark:border-neutral-700/50">
               <h3 className={`font-semibold text-sm truncate ${tpl.type === 'ads' ? 'text-amber-700 dark:text-amber-500' : 'text-neutral-700 dark:text-neutral-200'}`}>
                 {tpl.name.replace(/(ad|ads)$/i, '').trim()}
                 {tpl.type === 'ads' && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 font-bold uppercase">Ad</span>}
               </h3>
               {tpl.type === 'ads' && (
                  <button
                    className="text-neutral-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    onClick={(e) => handleCloseAd(e, tpl.key)}
                  >
                    <icons.X className="w-4 h-4" />
                  </button>
               )}
            </div>

            {/* Image Area */}
            <div className="relative aspect-[0.7] w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                <Image
                  src={tpl.thumb}
                  alt={tpl.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  unoptimized // Based on existing code usage
                />
                
                {/* Overlay Button */}
                {!tpl.href && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-white text-neutral-900 px-6 py-2 rounded-full font-medium transform scale-90 group-hover:scale-100 transition-transform duration-300">
                            Use Template
                        </span>
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

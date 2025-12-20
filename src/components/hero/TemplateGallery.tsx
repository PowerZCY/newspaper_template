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
    <div className="w-full min-h-[60vh] flex flex-col items-center mt-20 pb-5 md:pb-10 px-4 md:px-8 bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
      <div className="text-center max-w-6xl mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-8 text-neutral-900 dark:text-neutral-50 tracking-tight">
          Create Your Newspaper <br className="block md:hidden" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
             in Seconds
          </span>
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 sm:mb-8">
        Pick a template, edit immersively, upload images. With AI-generate text, you&apos;ll get high-res prints.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-6xl min-w-[calc(80vw)] sm:min-w-[calc(50vw)] ">
        {visibleTemplates.map((tpl, idx) => (
          <div
            key={tpl.key}
            className={`
              group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer shadow-sm 
              hover:shadow-2xl hover:border-purple-500/50 dark:hover:border-purple-400/50 hover:ring-4 hover:ring-purple-500/10 dark:hover:ring-purple-400/10
              transition-all duration-300
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
            <div className="px-4 py-2 flex justify-center items-center relative">
               <h3 className="font-extrabold text-lg truncate text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600 text-center">
                 {tpl.name.replace(/(ad|ads)$/i, '').trim()}
               </h3>
               {tpl.type === 'ads' && <span className="absolute right-12 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 font-bold uppercase">Ad</span>}
               
               {tpl.type === 'ads' && (
                  <button
                    className="absolute right-4 text-neutral-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    onClick={(e) => handleCloseAd(e, tpl.key)}
                  >
                    <icons.X className="w-4 h-4" />
                  </button>
               )}
            </div>

            {/* Image Area, template webp need fixed px: width/highth ~0.77 */}
            <div className="relative aspect-[0.77] mx-3 mb-3 overflow-hidden">
                <Image
                  src={tpl.thumb}
                  alt={tpl.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 800px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  unoptimized // Based on existing code usage
                />
                
                {/* Persistent Action Button (All Devices) */}
                {!tpl.href && (
                    <div className="absolute bottom-3 right-3 z-10">
                        <span className="flex items-center gap-1.5 backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 text-purple-600 dark:text-purple-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-purple-200/50 dark:border-purple-700/50 transition-all duration-300 group-hover:scale-110 group-active:scale-95 hover:bg-white dark:hover:bg-neutral-800 hover:border-purple-500 dark:hover:border-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:shadow-lg hover:shadow-purple-500/20">
                            Use Template
                            <icons.ArrowRight className="w-3 h-3" />
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

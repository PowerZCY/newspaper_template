import React from "react";
import { cn } from "@windrun-huaiin/lib/utils";

interface FontToolbarProps {
  onToggle: () => void;
  onInc: () => void;
  onDec: () => void;
  label?: string;
  className?: string;
  fontName?: string;
  fontSize?: number;
  theme?: 'light' | 'dark';
  orientation?: 'horizontal' | 'vertical';
}

export const FontToolbar: React.FC<FontToolbarProps> = ({
  onToggle,
  onInc,
  onDec,
  label = "Font",
  className,
  fontName,
  fontSize,
  theme = 'light',
  orientation = 'horizontal'
}) => {
  const isDark = theme === 'dark';
  const isVertical = orientation === 'vertical';

  return (
    <div className={cn(
      "absolute z-50 flex items-center backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] border rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 origin-center pointer-events-none group-hover:pointer-events-auto",
      isVertical ? "flex-col gap-1.5 px-1.5 py-3" : "flex-row gap-2 px-3 py-1.5",
      isDark 
        ? "bg-neutral-900/95 border-neutral-700 shadow-[0_4px_12px_rgba(0,0,0,0.3)]" 
        : "bg-white/95 border-neutral-100",
      className
    )}>
      {/* Info Section (Read-only) */}
      <div className={cn(
        "flex leading-none select-none text-center justify-center",
        isVertical ? "flex-col border-b pb-1.5 mb-0.5 w-full gap-0.5" : "flex-col text-left border-r pr-2 mr-0.5",
        isDark ? "border-neutral-700" : "border-neutral-200"
      )}>
        {fontName && (
          <span className={cn(
            "text-[10px] font-extrabold tracking-tight truncate w-[30px] inline-block",
            isDark ? "text-neutral-200" : "text-neutral-800"
          )} title={fontName}>
            {fontName.length > 4 ? fontName.slice(0, 4) : fontName}
          </span>
        )}
        {fontSize && (
          <span className={cn(
            "text-[9px] font-mono",
            !isVertical && "mt-0.5",
            isDark ? "text-neutral-500" : "text-neutral-400"
          )}>
            {fontSize}px
          </span>
        )}
      </div>

      {/* Actions */}
      <div className={cn("flex items-center gap-1.5", isVertical ? "flex-col" : "flex-row")}>
        <button 
          onClick={onToggle} 
          className={cn(
            "flex items-center justify-center text-[10px] font-semibold rounded-md transition-colors",
            isVertical ? "w-full py-1" : "h-6 px-2.5",
            isDark 
              ? "text-neutral-300 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600" 
              : "text-neutral-600 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300"
          )}
          title="Change Font Family"
        >
          {label}
        </button>
        
        <div className={cn(
          "flex items-center gap-0.5 rounded-md p-0.5",
          isVertical ? "flex-col-reverse" : "flex-row", 
          isDark ? "bg-neutral-800 border border-neutral-700" : "bg-neutral-100"
        )}>
          <button 
            onClick={onDec} 
            className={cn(
              "flex items-center justify-center text-[10px] font-bold rounded transition-all active:scale-95",
              isVertical ? "w-5 h-4" : "w-6 h-5",
              isDark 
                ? "text-neutral-400 hover:bg-neutral-700 hover:text-white" 
                : "text-neutral-600 hover:bg-white hover:shadow-sm"
            )}
            title="Decrease Size"
          >
            A-
          </button>
          <button 
            onClick={onInc} 
            className={cn(
              "flex items-center justify-center text-[10px] font-bold rounded transition-all active:scale-95",
              isVertical ? "w-5 h-4" : "w-6 h-5",
              isDark 
                ? "text-neutral-400 hover:bg-neutral-700 hover:text-white" 
                : "text-neutral-600 hover:bg-white hover:shadow-sm"
            )}
            title="Increase Size"
          >
            A+
          </button>
        </div>
      </div>
    </div>
  );
};
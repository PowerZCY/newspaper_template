"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface HighPriorityConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

export function HighPriorityConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: HighPriorityConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Ensure portal target exists and prevent hydration mismatch
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-purple-200/50 dark:border-purple-700/50 ring-4 ring-purple-500/10 scale-100 animate-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
          {title}
        </h3>
        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
          {description}
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

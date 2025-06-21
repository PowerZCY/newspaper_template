import React from "react";
import Image from "next/image";
import { globalLucideIcons as icons } from "@/components/global-icon";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface AdsAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description: React.ReactNode;
  imgSrc?: string;
  imgHref?: string;
  onCancel?: () => void;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
}

export function AdsAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  imgSrc,
  imgHref,
  cancelText,
  onCancel,
  confirmText,
  onConfirm,
}: AdsAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 max-w-md w-full min-w-[320px] p-4 flex flex-col items-stretch"
      >
        {/* Header: 左icon+标题，右X关闭 */}
        <div className="flex flex-row items-center justify-between mb-2">
          <AlertDialogTitle asChild>
            <div className="flex flex-row items-center gap-1 min-w-0 text-xl font-semibold">
              <icons.Info className="w-5 h-5" />
              <span className="truncate">{title}</span>
            </div>
          </AlertDialogTitle>
          <button
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xl ml-4"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            tabIndex={0}
          >
            <icons.X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 描述区 */}
        <AlertDialogDescription className="text-base font-medium text-neutral-800 dark:text-neutral-100 mb-2">
          {description}
        </AlertDialogDescription>
        {/* 图片区（可选） */}
        {imgSrc && (
          <div className="flex justify-center mb-2">
            {imgHref ? (
              <a href={imgHref} target="_blank" rel="noopener noreferrer" className="block w-full">
                <Image
                  src={imgSrc}
                  alt="image"
                  width={400}
                  height={220}
                  className="object-contain rounded-lg shadow border border-neutral-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 w-full max-h-[260px]"
                  priority={false}
                  placeholder="empty"
                  unoptimized
                />
              </a>
            ) : (
              <Image
                src={imgSrc}
                alt="image"
                width={400}
                height={220}
                className="object-contain rounded-lg shadow border border-neutral-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 w-full max-h-[260px]"
                priority={false}
                placeholder="empty"
                unoptimized
              />
            )}
          </div>
        )}
        {/* 按钮区（可选） */}
        {(cancelText || confirmText) && (
          <div className="flex justify-end gap-2 mt-2">
            {cancelText && (
              <button
                onClick={() => {
                  onOpenChange(false);
                  onCancel?.();
                }}
                className="px-6 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
              >
                {cancelText}
              </button>
            )}
            {confirmText && (
              <AlertDialogAction
                onClick={() => {
                  onOpenChange(false);
                  onConfirm?.();
                }}
                className="px-6 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition"
              >
                {confirmText}
              </AlertDialogAction>
            )}
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
} 
import React, { useRef, useState, useId, useEffect } from "react";
import { useAIEditableContext } from '@/components/AIEditableContext';
import { AdsAlertDialog } from "@/components/ads-alert-dialog";
import { globalLucideIcons as icons } from "@/components/global-icon";
import { handlePastePlainText } from '@/lib/utils';

interface AIEditableProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  aiPromptDefault?: string;
  className?: string;
  style?: React.CSSProperties;
  editableProps?: React.HTMLAttributes<HTMLDivElement>;
  aiButtonRender?: (props: { onClick: () => void; loading: boolean }) => React.ReactNode;
  modalTitle?: string;
  disabled?: boolean;
  type?: 'title' | 'text';
  aiTitleMaxChars?: number;
  aiMaxChars?: number;
}

export const AIEditable: React.FC<AIEditableProps> = ({
  value,
  onChange,
  placeholder = "Please enter your prompt here...",
  className,
  style, 
  editableProps,
  aiButtonRender,
  disabled,
  type = 'text',
  aiTitleMaxChars = 30,
  aiMaxChars = 600,
}) => {
  const { activeId, setActiveId, showAIButton, setShowAIButton, showAIModal, setShowAIModal } = useAIEditableContext();
  const selfId = useId();
  const [aiPrompt, setAIPrompt] = useState("");
  const [aiLoading, setAILoading] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Only show Try AI button when current active area and edit state
  const isActive = activeId === selfId;
  const showButton = isActive && showAIButton && !showAIModal;
  const maxChars = type === 'title' ? aiTitleMaxChars : aiMaxChars;

  // Auto adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [aiPrompt]);

  // Close modal logic
  const handleCloseModal = () => {
    if (aiLoading) {
      setShowCancelConfirm(true);
    } else {
      setShowAIModal(false);
      setShowAIButton(false);
    }
  };

  // AI generate logic
  const handleAISubmit = async () => {
    if (!aiPrompt.trim()) return;
    setAILoading(true);
    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, maxChars: aiMaxChars }),
      });
      const data = await res.json();
      onChange(data.text);
      setShowAIModal(false);
      setShowAIButton(false);
    } catch {
      setErrorDialogOpen(true);
    } finally {
      setAILoading(false);
    }
  };

  // Only show button when click into edit state, hide when lose focus
  const handleFocus = () => {
    setActiveId(selfId);
    setShowAIButton(true);
  };
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML);
    setShowAIButton(false);
  };

  // Click modal outside to close
  const modalBgRef = useRef<HTMLDivElement>(null);
  const handleModalBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalBgRef.current) {
      handleCloseModal();
    }
  };

  return (
    <>
      <AdsAlertDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        title="AI generate failed"
        description="AI content generate request failed, please try again later."
        imgSrc="/ads/Ad-Pollo.webp"
        imgHref="https://pollo.ai/home?ref=mzmzndj&tm_news=news"
      />
      {/* Cancel AI generating confirm dialog */}
      <AdsAlertDialog
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        title="Cancel AI Generating?"
        description="AI is working, please wait a moment, are you sure to cancel?"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => {
          setShowAIModal(false);
          setShowAIButton(false);
          setShowCancelConfirm(false);
        }}
        onCancel={() => setShowCancelConfirm(false)}
      />
      <div className="relative">
        <div
          ref={editableRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          className={className}
          style={{ ...style, position: 'relative', zIndex: 1 }}
          onPaste={handlePastePlainText}
          onBlur={handleBlur}
          onFocus={handleFocus}
          dangerouslySetInnerHTML={{ __html: value }}
          {...editableProps}
        />
        {/* Try AI button: absolute position at the top right corner of the edit area, top aligned, show when edit state */}
        {showButton && (
          aiButtonRender
            ? aiButtonRender({ onClick: () => setShowAIModal(true), loading: aiLoading })
            : (
              <div
                className="absolute z-50 bg-[#f5f5e5] text-neutral-700 border border-purple-500 rounded-lg shadow-lg px-3 py-1 flex items-center cursor-pointer hover:bg-accent transition"
                style={{ top: '-6px', right: '-66px' }}
                onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setShowAIModal(true); }}
              >
                <icons.Sparkles size={16} /> 
                <span className="ml-1"> AI</span>
              </div>
            )
        )}
        {/* AI modal: Only show when current active area and showAIModal is true */}
        {isActive && showAIModal && (
          <div
            ref={modalBgRef}
            onClick={handleModalBgClick}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
          >
            <div
              className="fixed left-[615px] z-50 w-[700px] bg-[#f5f5e5] text-neutral-700 border border-purple-500 rounded-lg shadow-xl p-4 pt-3 mb-12"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal header: title left, close button right */}
              <div className="flex items-center justify-between mb-1">
                <div className="font-bold text-lg text-purple-500">AI Generate</div>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-neutral-200 transition"
                  onClick={handleCloseModal}
                  aria-label="Close"
                  disabled={aiLoading}
                >
                  <icons.X size={24} />
                </button>
              </div>
              {/* Modal body: textarea with send icon button in bottom right */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={aiPrompt}
                  onChange={e => setAIPrompt(e.target.value)}
                  placeholder={placeholder}
                  className="w-full min-h-[108px] max-h-[300px] text-base p-2 rounded border border-[#e0d7fa] bg-background text-foreground focus:outline-none focus:border-purple-500 focus:ring-0 transition resize-none overflow-y-auto pr-10"
                  disabled={aiLoading}
                  rows={3}
                  onInput={e => {
                    const ta = e.currentTarget;
                    ta.style.height = 'auto';
                    // Limit max height to 300px
                    const maxHeight = 300;
                    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + 'px';
                  }}
                  maxLength={aiMaxChars}
                />
                {/* Send icon button: always fixed to bottom right of textarea */}
                <button
                  type="button"
                  aria-label="Send"
                  onClick={handleAISubmit}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className={`absolute right-1 bottom-2 p-2 rounded-full transition ${aiLoading || !aiPrompt.trim() ? 'opacity-60 pointer-events-none' : 'hover:bg-neutral-200'}`}
                >
                  <icons.SendHorizontal size={20} />
                </button>
              </div>
              {/* Character count below textarea */}
              <div className="text-xs text-purple-500 mt-1 select-none">{aiPrompt.length}/{maxChars}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}; 
import React, { useRef, useState, useId, useEffect } from "react";
import { useAIEditableContext } from '@/components/AIEditableContext';
import { AdsAlertDialog } from "@/components/ads-alert-dialog";
import { globalLucideIcons as icons } from "@/components/global-icon";
import { handlePastePlainText } from '@/lib/utils';
import { appConfig } from "@/lib/appConfig";

interface AIEditableProps {
  // HTML div id, for cache key
  seqId: string;
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

// 新增AI消息类型
type AIMessage = {
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
};

// 缓存相关工具
const CACHE_EXPIRE_MS = 4 * 60 * 60 * 1000; // 4小时
function getCacheKey(id: string) {
  return `${appConfig.i18n.detector.storagePrefix}_AI_CHAT_${id}`;
}

function saveChatToCache(id: string, messages: AIMessage[]) {
  localStorage.setItem(getCacheKey(id), JSON.stringify({ messages, ts: Date.now() }));
}

function loadChatFromCache(id: string): AIMessage[] {
  const raw = localStorage.getItem(getCacheKey(id));
  if (!raw) return [];
  try {
    const obj = JSON.parse(raw);
    console.log('loadChatFromCache', obj);
    if (!obj.ts || Date.now() - obj.ts > CACHE_EXPIRE_MS) {
      localStorage.removeItem(getCacheKey(id));
      return [];
    }
    return Array.isArray(obj.messages) ? obj.messages : [];
  } catch {
    localStorage.removeItem(getCacheKey(id));
    return [];
  }
}
function clearChatCache(id: string) {
  localStorage.removeItem(getCacheKey(id));
}

export const AIEditable: React.FC<AIEditableProps> = ({
  seqId,
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
  const selfId = seqId || useId();
  const [aiPrompt, setAIPrompt] = useState("");
  const [aiLoading, setAILoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [dotCount, setDotCount] = useState(1);
  // 新增多轮消息状态
  const [messages, setMessages] = useState<AIMessage[]>([]);
  // X按钮震动动画状态
  const [shakeX, setShakeX] = useState(false);
  // 遮罩拖动状态
  const [isDragging, setIsDragging] = useState(false);
  // 消息区滚动ref
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // 触控板/鼠标滚轮支持
  const handleModalBgWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.target === modalBgRef.current) {
      setShakeX(true);
      setTimeout(() => setShakeX(false), 400);
    }
  };

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

  // "..." animation
  useEffect(() => {
    if (!aiLoading) return;
    const timer = setInterval(() => {
      setDotCount(prev => (prev % 3) + 1);
    }, 300);
    return () => clearInterval(timer);
  }, [aiLoading]);

  // 打开对话框时恢复缓存
  useEffect(() => {
    if (showAIModal) {
      const cached = loadChatFromCache(selfId);
      setMessages(cached);
    }
  }, [showAIModal, selfId]);

  // 每次消息变更写入缓存
  useEffect(() => {
    if (isActive && showAIModal) {
      saveChatToCache(selfId, messages);
    }
  }, [messages, isActive, showAIModal, selfId]);

  // 消息变更后自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, showAIModal]);

  // Close modal logic
  const handleCloseModal = () => {
    if (aiLoading) {
      setShowCancelConfirm(true);
    } else {
      setShowAIModal(false);
      setShowAIButton(false);
      setAIPrompt("");
      setMessages([]);
      clearChatCache(selfId);
    }
  };

  // AI generate logic
  const handleAISubmit = async () => {
    if (!aiPrompt.trim()) return;
    const userMsg: AIMessage = { role: 'user', text: aiPrompt, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setAILoading(true);
    setAIPrompt("");
    const controller = new AbortController();
    setAbortController(controller);
    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg.text, maxChars: maxChars }),
        signal: controller.signal,
      });
      const data = await res.json();
      const aiMsg: AIMessage = { role: 'ai', text: data.text, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
      // don't directly onChange, let Replace button handle it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setErrorDialogOpen(true);
      }
    } finally {
      setAILoading(false);
      setAbortController(null);
    }
  };

  // Stop AI request
  const handleAIStop = () => {
    if (abortController) {
      console.warn(`[AI-Generate]: Abort request`);
      abortController.abort();
      setAILoading(false);
      setAbortController(null);
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

  // Click modal outside to close/drag震动
  const modalBgRef = useRef<HTMLDivElement>(null);
  const handleModalBgMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalBgRef.current) {
      setIsDragging(true);
      setShakeX(true);
      setTimeout(() => setShakeX(false), 400);
    }
  };
  const handleModalBgMouseUp = () => {
    setIsDragging(false);
  };
  const handleModalBgMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && e.target === modalBgRef.current) {
      setShakeX(true);
      setTimeout(() => setShakeX(false), 400);
      setIsDragging(false);
    }
  };

  // ReGenerate
  const handleReGenerate = () => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (lastUser) {
      setAIPrompt(lastUser.text);
      // 自动触发handleAISubmit
      setTimeout(() => handleAISubmit(), 0);
    }
  };

  // Replace
  const handleReplace = () => {
    const lastAI = [...messages].reverse().find(m => m.role === 'ai');
    if (lastAI) {
      onChange(lastAI.text);
      // 可选：setShowAIModal(false); setShowAIButton(false);
    }
  };

  // Copy
  const handleCopy = () => {
    const lastAI = [...messages].reverse().find(m => m.role === 'ai');
    if (lastAI) {
      navigator.clipboard.writeText(lastAI.text);
    }
  };

  useEffect(() => {
    if (showAIModal) {
      // 禁止页面滚动
      document.body.style.overflow = 'hidden';
    } else {
      // 恢复页面滚动
      document.body.style.overflow = '';
    }
    // 组件卸载时也恢复
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAIModal]);

  return (
    <>
      <AdsAlertDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        title="AI generate failed"
        description="AI generate timed out, please try again later."
        imgSrc="/ads/Ad-Pollo.webp"
        imgHref="https://pollo.ai/home?ref=mzmzndj&tm_news=news"
      />
      {/* Cancel AI generating confirm dialog */}
      <AdsAlertDialog
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        title="Cancel AI Generating?"
        description="AI buddy is working on the task. Please wait a moment. Are you sure you want to cancel?"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => {
          handleAIStop();
          setShowAIModal(false);
          setShowAIButton(false);
          setAIPrompt("");
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
            onMouseDown={handleModalBgMouseDown}
            onMouseUp={handleModalBgMouseUp}
            onMouseMove={handleModalBgMouseMove}
            onWheel={handleModalBgWheel}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
          >
            <div
              className="fixed left-[615px] z-50 w-[700px] bg-[#f5f5e5] text-neutral-700 border border-purple-500 rounded-lg shadow-xl p-4 pt-3 mb-12"
              onClick={e => e.stopPropagation()}
              style={{ minHeight: 320, maxHeight: 600, display: 'flex', flexDirection: 'column' }}
            >
              {/* Modal header: title left, close button right */}
              <div className="flex items-center justify-between mb-1 border-b border-purple-400 pb-1">
                <div className="font-bold text-lg text-purple-500">AI Generate</div>
                <button
                  type="button"
                  className={`p-2 rounded-full hover:bg-neutral-200 transition${shakeX ? ' shake' : ''}`}
                  onClick={handleCloseModal}
                  aria-label="Close"
                  title="Close and clear conversation."
                >
                  <icons.X size={24} />
                </button>
              </div>
              {/* 消息区 */}
              <div ref={messagesEndRef} className="flex-1 overflow-y-auto dialog-body px-2 py-2 mb-2" style={{ minHeight: 200 }}>
                {messages.length === 0 && (
                  <div className="text-center text-neutral-400 text-sm">No conversation, start with prompt</div>
                )}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg shadow text-sm whitespace-pre-line ${msg.role === 'user' ? 'bg-purple-100 text-right' : 'bg-white border'}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              {/* 操作按钮区（移到textarea上方） */}
              <div className="flex flex-row gap-2 mb-2 select-none">
                <button
                  type="button"
                  className="flex items-center px-3 py-1 rounded border border-neutral-300 bg-white hover:bg-neutral-100 text-sm"
                  onClick={handleReplace}
                >
                  <icons.Replace size={16} className="mr-1" /> Replace
                </button>
                <button
                  type="button"
                  className="flex items-center px-3 py-1 rounded border border-neutral-300 bg-white hover:bg-neutral-100 text-sm"
                  onClick={handleCopy}
                >
                  <icons.Copy size={16} className="mr-1" /> Copy
                </button>
                <button
                  type="button"
                  className="flex items-center px-3 py-1 rounded border border-neutral-300 bg-white hover:bg-neutral-100 text-sm"
                  onClick={handleReGenerate}
                  disabled={aiLoading || !messages.some(m => m.role === 'user')}
                >
                  <icons.RefreshCcw size={16} className="mr-1" /> Retry
                </button>
              </div>
              {/* Modal body: textarea + 发送/停止按钮 */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={aiPrompt}
                  onChange={e => setAIPrompt(e.target.value)}
                  placeholder={placeholder}
                  className="w-full min-h-[80px] max-h-[200px] text-base p-2 rounded border border-[#e0d7fa] bg-background text-foreground focus:outline-none focus:border-purple-500 focus:ring-0 transition resize-none overflow-y-auto pr-10"
                  disabled={aiLoading}
                  rows={3}
                  onInput={e => {
                    const ta = e.currentTarget;
                    ta.style.height = 'auto';
                    const maxHeight = 200;
                    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + 'px';
                  }}
                  maxLength={aiMaxChars}
                />
                {aiLoading ? (
                  <button
                    type="button"
                    aria-label="Stop"
                    onClick={handleAIStop}
                    className="absolute right-1 bottom-2 p-1 w-8 h-8 flex items-center justify-center rounded-full transition bg-transparent hover:bg-neutral-200"
                  >
                    <span className="inline-flex items-center justify-center">
                      <icons.CircleStop size={20} className="animate-spin" />
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="Send"
                    onClick={handleAISubmit}
                    disabled={!aiPrompt.trim()}
                    className={`absolute right-1 bottom-2 p-1 w-8 h-8 flex items-center justify-center rounded-full transition bg-transparent hover:bg-neutral-200 ${!aiPrompt.trim() ? 'opacity-60 pointer-events-none' : ''}`}
                  >
                    <icons.SendHorizontal size={24} />
                  </button>
                )}
              </div>
              {/* 字数/生成中提示 */}
              <div className="flex flex-row justify-between items-center mt-1 select-none text-xs text-purple-500">
                <span></span>
                {aiLoading && (
                  <span
                    className="ml-auto"
                    style={{
                      minWidth: '100px',
                      textAlign: 'right',
                      display: 'inline-block',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Generating
                    <span>{'.'.repeat(dotCount)}</span>
                    <span style={{ opacity: 0 }}>{'.'.repeat(3 - dotCount)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}; 
import React from 'react';

export type TemplateType = 'simple' | 'modern';
export interface NewspaperCache {
  templateType: TemplateType;
  content: Record<string, string>;
}

interface EditCacheProps {
  templateType: TemplateType;
  content: Record<string, string>;
  onImport: (data: NewspaperCache) => void;
  children?: React.ReactNode;
}

/**
 * EditCache: Wrap local cache, import, and export functions
 * - Auto save content to localStorage
 * - Provide import/export buttons
 * - Callback onImport after import success
 */
export const EditCache: React.FC<EditCacheProps> = ({ templateType, content, onImport, children }) => {
  // Auto save to localStorage
  React.useEffect(() => {
    const data: NewspaperCache = { templateType, content };
    localStorage.setItem(`newspaper_template_${templateType}`, JSON.stringify(data));
  }, [templateType, content]);

  // Export JSON
  const handleExport = () => {
    const data: NewspaperCache = { templateType, content };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newspaper_${templateType}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.templateType && data.content) {
          onImport(data);
          localStorage.setItem(`newspaper_template_${data.templateType}`, JSON.stringify(data));
        } else {
          alert('JSON structure is incorrect');
        }
      } catch {
        alert('Parse failed');
      }
    };
    reader.readAsText(file);
    // Clear input value, for continuous import
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button type="button" onClick={handleExport}>Export JSON</button>
      <label style={{ cursor: 'pointer' }}>
        Import JSON
        <input type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
      </label>
      {children}
    </div>
  );
};

/**
 * 独立的JSON导出函数
 * @param templateType
 * @param content
 */
export function exportNewspaperJSON(templateType: TemplateType, content: Record<string, string>) {
  const data: NewspaperCache = { templateType, content };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `newspaper_${templateType}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * 独立的JSON导入函数
 * @param file 选择的文件
 * @param onSuccess 成功回调，参数为 NewspaperCache
 * @param onError 失败回调，参数为错误信息
 */
export function importNewspaperJSON(
  file: File,
  onSuccess: (data: NewspaperCache) => void,
  onError: (errMsg: string) => void
) {
  if (!file) {
    onError('No file selected');
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target?.result as string);
      if (data.templateType && data.content && typeof data.content === 'object') {
        onSuccess(data);
        localStorage.setItem(`newspaper_template_${data.templateType}`, JSON.stringify(data));
      } else {
        onError('JSON structure is incorrect');
      }
    } catch {
      onError('Parse failed');
    }
  };
  reader.readAsText(file);
} 
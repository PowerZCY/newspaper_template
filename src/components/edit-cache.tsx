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
 * EditCache 组件：封装本地缓存、导入、导出功能
 * - 自动保存content到localStorage
 * - 提供导入/导出按钮
 * - 导入成功后回调onImport
 */
export const EditCache: React.FC<EditCacheProps> = ({ templateType, content, onImport, children }) => {
  // 自动保存到localStorage
  React.useEffect(() => {
    const data: NewspaperCache = { templateType, content };
    localStorage.setItem(`newspaper_template_${templateType}`, JSON.stringify(data));
  }, [templateType, content]);

  // 导出JSON
  const handleExport = () => {
    const data: NewspaperCache = { templateType, content };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newspaper_${templateType}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导入JSON
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
          alert('JSON结构不正确');
        }
      } catch {
        alert('解析失败');
      }
    };
    reader.readAsText(file);
    // 清空input值，便于连续导入
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button type="button" onClick={handleExport}>导出JSON</button>
      <label style={{ cursor: 'pointer' }}>
        导入JSON
        <input type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
      </label>
      {children}
    </div>
  );
}; 
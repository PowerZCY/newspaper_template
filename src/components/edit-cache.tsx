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
    URL.revokeObjectURL(url);
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
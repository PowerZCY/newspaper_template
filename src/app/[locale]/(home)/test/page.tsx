"use client";
import { SiteIcon } from "@/lib/site-config";
import { NotFoundPage } from "@windrun-huaiin/base-ui/components";
import { globalLucideIcons as icons } from "@windrun-huaiin/base-ui/components/server";
import { HighPriorityConfirmDialog } from "@/components/HighPriorityConfirmDialog";
import { useState, useCallback } from "react";

// 仅在开发环境中存在
const DevTestDialogPage = function TestDialogPage() {
  // 1. 模拟 Workbench 中的状态
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // 2. 模拟 Workbench 中的重置逻辑 (这就是我们刚才修复的核心逻辑)
  const resetExportState = useCallback(() => {
    console.log("resetExportState called: Unlocking button and clearing error");
    setExporting(false);
    setExportError(null);
  }, []);

  // 3. 模拟触发导出的过程 (模拟失败)
  const handleSimulateExport = () => {
    if (exporting) return;
    
    // 锁定按钮
    setExporting(true);
    console.log("Export started: Button locked");

    // 模拟 2秒后超时失败
    setTimeout(() => {
      console.log("Export failed: Showing dialog");
      // 注意：Workbench 中是在 finishExport 里设置 error 的，但按钮状态是在 resetExportState 中解开的
      // 这里我们模拟最坏情况：出错了，但 exporting 还是 true (直到用户关闭弹窗才解开)
      setExportError("Your download may time out. (Simulated Error)");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4 bg-neutral-100 dark:bg-neutral-900">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Export Error Flow Test</h1>
        <p className="text-neutral-500">
          Click the button below. It will lock (loading) for 2 seconds, then show an error.<br/>
          <strong>Verify that closing the dialog unlocks the button.</strong>
        </p>
      </div>

      {/* 模拟下载按钮 */}
      <button
        className={`
          flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow transition-all
          ${exporting 
            ? 'bg-neutral-400 cursor-not-allowed opacity-80' 
            : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 active:scale-95'}
        `}
        onClick={handleSimulateExport}
        disabled={exporting}
      >
        {exporting ? (
          <>
            <icons.Loader2 className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <icons.Download />
            Simulate Export Fail
          </>
        )}
      </button>

      {/* 状态指示器 */}
      <div className="p-4 bg-white dark:bg-black rounded border border-neutral-200 dark:border-neutral-800 text-sm font-mono">
        <div>Button Locked (exporting): <span className={exporting ? "text-red-500 font-bold" : "text-green-500 font-bold"}>{String(exporting)}</span></div>
        <div>Error Present (exportError): <span className={exportError ? "text-red-500 font-bold" : "text-neutral-400"}>{String(!!exportError)}</span></div>
      </div>

      {/* 复用 HighPriorityConfirmDialog，逻辑与 Workbench 一致 */}
      <HighPriorityConfirmDialog
        open={!!exportError}
        onCancel={resetExportState}   // 关键点：点击 Close 调用 resetExportState
        onConfirm={resetExportState}  // 关键点：点击 OK 调用 resetExportState
        title="Notice"
        description={exportError}
        confirmText="OK"
        cancelText="Close"
      />
    </div>
  );
};

const ProdNotFoundPage = () => <NotFoundPage siteIcon={<SiteIcon />} />;

export default process.env.NODE_ENV !== "production"
  ? DevTestDialogPage
  : ProdNotFoundPage;
# Export Performance Issue & Analysis

## Issue Description
用户反馈在编辑器中，上传图片或导入 JSON 后，进行导出（Download）操作时，容易出现以下问题：
1.  **UI 卡死**：点击下载后，按钮长时间处于 "Processing..." 状态，无法恢复。
2.  **第二次必挂**：第一次下载通常成功，但第二次下载几乎必失败（超时或无反应）。
3.  **恢复无效**：点击 "Reset Status" 按钮也无法解除锁定状态。

## Investigation Findings

### 1. 状态管理混乱 (Resolved)
*   **原因**：最初使用 5 个独立的 boolean (`exportingJPEG`, `exportingPNG`...) 管理状态，导致逻辑死锁，且弹窗关闭时未正确重置状态。
*   **修复**：重构为单一状态枚举 `exportStatus` ('idle' | 'jpeg' | ...) 并强制重置逻辑。

### 2. 图片处理性能 (Resolved)
*   **原因**：用户上传的大图通过 `FileReader` 转为 Base64 字符串直接存入 React State。巨型字符串导致 React Diff 极慢，甚至阻塞主线程。
*   **修复**：改用 `URL.createObjectURL` (Blob URL)，State 中只存短链接，大幅降低 React 渲染开销。

### 3. JSON 导入卡死 (Resolved)
*   **原因**：导入 JSON 时循环调用 `onContentChange`，导致触发几十次 React 渲染和 LocalStorage 写入。
*   **修复**：引入 `onBatchContentChange` 批量更新机制，将开销降为 O(1)。

### 4. 字体导致的内存爆炸 (Current Bottleneck)
这是导致“第二次下载必挂”的**终极元凶**。
*   **现象**：浏览器性能分析显示内存中存在巨大的 `data:font/woff;base64...` 字符串。
*   **机制**：当前使用的 `dom-to-image-more` 库在每次执行导出时，都会尝试 fetch 页面引用的所有 Web Fonts（项目中包含了多个中文字体，体积巨大），并将它们转换为 Base64 内联到 SVG/Canvas 中。
*   **后果**：
    *   **内存飙升**：每次导出产生几十 MB 的 Base64 字符串，且未及时 GC。
    *   **CPU 阻塞**：Base64 转换是同步重计算，直接卡死主线程，导致 UI 失去响应，甚至让 React 的 State 更新无法调度。

## Recommendations

鉴于 `dom-to-image-more` 在处理字体缓存和内存管理上的固有缺陷，建议采取以下方案：

### Plan A: 迁移至 `html-to-image` (Recommended)
*   **理由**：`html-to-image` 是社区维护更活跃的现代替代品，针对字体处理和缓存做了大量优化，能有效避免重复 fetch 和 Base64 转换导致的内存泄漏。
*   **成本**：API 几乎完全兼容，只需更换 import 和少量参数调整。

### Plan B: 激进的字体优化 (Alternative)
如果必须保留当前库，需要尝试：
*   **禁用字体克隆**：配置库过滤掉 Web Font 的处理（可能导致导出图片字体丢失）。
*   **手动缓存**：自己 fetch 字体并生成 CSS 注入，欺骗库不再去 fetch。但这极其复杂且脆弱。

### Next Step
下次迭代应优先执行 **Plan A**，将导出库替换为 `html-to-image`。
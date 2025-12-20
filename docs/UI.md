# 沉浸式工作台 (Immersive Workbench) UI 重构方案

## 1. 核心反思与设计哲学
之前的方案过于激进地进入编辑态，忽略了新用户**"First Land" (首次着陆)** 时的认知需求。
**新的设计哲学：渐进式沉浸 (Progressive Immersion)**。Hero 区域将重构为拥有两个截然不同的状态（Modes），根据用户的意图进行切换。

---

## 2. 交互流程变革：双模态设计 (Two-State Design)

### 2.1 状态 A：画廊模式 (Gallery Mode) —— "了解与选择"
这是用户打开网站时的**默认状态**。
*   **目标**：展示网站价值，提供模板预览，引导用户点击。
*   **布局**：
    *   **Header**：大标题 ("Create Your Newspaper in Seconds") + 副标题。
    *   **Showcase**：网格展示所有可用模板。**缩略图优化**：采用 `object-contain` 并在容器中保留上下留白，背景透明或纯白，避免裁剪。
    *   **行为**：点击任意模板卡片 -> **进入编辑模式**。

### 2.2 状态 B：编辑模式 (Editor Mode) —— "沉浸式创作"
当用户选定一个模板后，Hero 区域发生视图变换。
*   **全屏化**：Hero 容器迅速扩展至全屏。
*   **工具栏浮现**：顶部工具栏显示 "Change Template" 和 "Download" 等操作。
*   **编辑器居中**：选中的报纸模板放大并居中显示。
*   **退出/返回**：点击 "Change Template" 或浏览器后退，触发**安全退出确认**。

---

## 3. 详细 UI 布局设计

### 3.1 画廊模式 (Gallery UI)
*   **卡片设计**：图片位于顶部，标题/描述位于底部。
*   **视觉增强**：标题使用渐变色文字 (`text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600`)，字体加粗居中。
*   **交互**：卡片 Hover 时整体上浮，"Use Template" 按钮淡入。

### 3.2 编辑模式 (Editor UI)
*   **顶部工具栏**：
    *   **左侧**：[🎨 Change Template] (触发 ExitDialog)。
    *   **右侧**：[⬇ Download] (支持 JPG/PNG/PDF/JSON 导出)。
*   **画布区**：
    *   **自适应缩放**：根据屏幕宽度自动计算 Scale，确保报纸完整显示。
    *   **移动端适配**：在手机上自动缩小，且底部留出足够空间，避免被工具栏遮挡。

### 3.3 图片编辑交互 (Image Replacement)
*   **触发方式**：
    *   **Web端**：鼠标悬浮在图片上时，显示 "Edit" 按钮。
    *   **移动端**："Edit" 按钮**始终显示**（或保持高可见度），点击图片任意区域均可触发上传。
*   **按钮样式**：
    *   **图标**：使用 `Pencil` 图标。
    *   **形态**：胶囊形按钮 (`rounded-full`)，半透明白色背景，带阴影。
    *   **位置**：图片右下角。

### 3.4 文本编辑与 AI 辅助 (Text Editing & AI)
*   **编辑交互**：
    *   **点击即编**：所有文本区域支持 `contentEditable`。
    *   **空内容保护**：文本区域即使清空内容，也保留最小高度 (`min-height: 1em`)，防止高度塌陷导致无法点击。
    *   **AI 触发器**：点击文本框时，右上角（移动端为正上方）浮现 **AI 提示按钮** (Sparkles 图标)。
        *   **样式**：紫色边框，胶囊形，阴影。
        *   **移动端优化**：按钮尺寸更大 (`px-5 py-2.5`)，位置位于文本框上方 (`-top-12`) 防止溢出屏幕。
*   **布局稳健性**：
    *   **居中标题**：对于 `Headline` 等居中元素，强制使用 `w-full block text-center`，防止因 Flex 布局导致的文字重叠或不换行问题。
    *   **字号自适应**：
        *   **Headline**：根据字符长度自动调整字号（从 `7xl` 到 `2xl` 多级递减），确保长标题也能尽量单行展示或优雅换行。
        *   **换行控制**：强制开启 `break-words`，防止长单词撑破布局。

---

## 4. AI 连续对话与生成弹窗

### 4.1 弹窗设计
*   **定位 (Positioning)**：
    *   **Web端**：居中偏上 (`items-center` + `mt-24`) 或 底部居中，避免遮挡顶部导航栏。
    *   **移动端**：居中显示，顶部留出安全距离 (`mt-12`)，宽度占满 (`w-[96vw]`)，高度自适应 (`max-h-[80vh]`)。
    *   **实现技术**：使用 **React Portal** (`createPortal`) 渲染到 `document.body`，彻底解决父容器 `transform: scale` 导致的弹窗缩小问题，以及 `z-index` 失效问题。
*   **视觉风格**：
    *   **背景**：米黄色 (`#f5f5e5`) 模拟报纸质感。
    *   **上下文卡片 (Context Card)**：弹窗顶部显示当前编辑的字段名 (e.g. "Editing: Headline") 和原文摘要，背景为半透明白 (`bg-white/60`)。
    *   **滚动条**：自定义紫色滚动条，增强可见性。

### 4.2 交互逻辑
*   **多轮对话**：支持用户与 AI 进行多轮问答。
*   **操作按钮**：提供 Replace (替换原文)、Copy (复制)、Retry (重试)。
*   **状态保持**：对话记录在本地缓存，意外关闭后再次打开可恢复（除非显式关闭）。

---

## 5. 安全退出与缓存管理 (Exit & Cache Strategy)

### 5.1 退出确认 (Exit Dialog)
*   **触发场景**：点击 "Change Template"、浏览器后退、刷新页面。
*   **UI 风格**：
    *   **主题**：紫色渐变风格，磨砂玻璃背景 (`backdrop-blur-md`)。
    *   **文案**：通用化提示 "Leave the Editor? You have unsaved changes."
    *   **按钮**："Stay" (取消) vs "Leave Anyway" (确认离开)。
    *   **层级**：使用 **Portal** 渲染，确保 `z-index` 最高，覆盖 Header。

### 5.2 缓存污染治理
*   **问题**：用户"不保存退出"后，下次进入仍显示旧数据。
*   **解决方案**：
    *   **清理 LocalStorage**：在用户确认 "Leave Anyway" 时，显式调用 `clearNewspaperCache(templateKey)` 删除对应模板的本地缓存。
    *   **重置 Memory State**：同时调用父组件 (`Hero`) 的重置方法，将 React State 恢复为默认值，防止内存中的脏数据再次写入缓存。

---

## 6. 技术实现要点总结

1.  **Portal 渲染**：所有模态框 (AI Dialog, Exit Dialog) 必须使用 Portal，以规避父级 `Scale` 和 `Z-Index` 限制。
2.  **样式隔离**：
    *   `Newspaper` 组件内部使用 `em` 单位和 `text-center` / `block` 布局，确保文字排版稳健。
    *   `AIEditable` 组件通过 `min-height` 防止空状态塌陷。
3.  **响应式策略**：
    *   **AI 按钮**：移动端加大尺寸并调整位置（上方悬浮）。
    *   **弹窗位置**：移动端避开顶部导航，Web 端保持底部留白。
4.  **状态清理**：退出时双重清理（Storage + State）。

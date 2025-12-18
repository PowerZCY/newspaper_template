# 沉浸式工作台 (Immersive Workbench) UI 重构方案

## 1. 核心反思与设计哲学
您提出的观点非常切中肯綮。之前的方案过于激进地进入编辑态，忽略了新用户**"First Land" (首次着陆)** 时的认知需求——他们需要先了解"这是什么"，看看有哪些漂亮的模板，然后才是"开始创作"。

同时，您指出的**"选定后模板列表即为浪费"**这一点是优化的关键。

**新的设计哲学：渐进式沉浸 (Progressive Immersion)**。
Hero 区域将重构为拥有两个截然不同的状态（Modes），根据用户的意图进行切换。

---

## 2. 交互流程变革：双模态设计 (Two-State Design)

### 2.1 状态 A：画廊模式 (Gallery Mode) —— "了解与选择"
这是用户打开网站时的**默认状态**。
*   **目标**：展示网站价值，提供模板预览，引导用户点击。
*   **布局**：
    *   **Header**：大标题 ("Create Your Newspaper in Seconds") + 副标题。
    *   **Showcase**：以**网格 (Grid)** 或 **卡片流 (Cover Flow)** 形式展示所有可用模板（Simple, Modern, etc.）。此时缩略图较大，视觉冲击力强。
    *   **行为**：
        *   用户浏览不同风格的模板。
        *   Hero 高度自适应内容，不强制全屏，下方自然露出 `Usage` / `Features` 等内容，方便新用户向下滚动了解更多。
    *   **触发点**：点击任意模板卡片 -> **进入编辑模式**。

### 2.2 状态 B：编辑模式 (Editor Mode) —— "沉浸式创作"
当用户选定一个模板后，Hero 区域发生**视图变换 (View Transition)**。
*   **目标**：提供最大化的操作空间，排除干扰。
*   **变化**：
    *   **全屏化**：Hero 容器迅速扩展至 `min-h-screen` (或 100vh)，占据整个视口。
    *   **隐藏列表**：之前的模板网格消失（或收起到抽屉中）。
    *   **编辑器居中**：选中的报纸模板放大并居中显示 (Immersive Workbench)。
    *   **工具栏浮现**：出现顶部/底部工具栏。
    *   **滚动行为**：此时建议**锁定 body 滚动**或将编辑器设为覆盖层 (Overlay)，确保用户在编辑时不会意外滚动到页面底部的 FAQ 区域，保证"应用级"体验。
*   **行为**：
    *   用户专注于编辑文字、上传图片。
    *   需要换模板？-> 点击工具栏 -> 唤起模板抽屉。
    *   **退出/返回**：工具栏提供 "Back to Gallery" 按钮，点击后收起编辑器，恢复到画廊模式。

---

## 3. 详细 UI 布局设计

### 3.1 画廊模式 (Gallery UI)
*   **布局**：标准 Web 布局。
*   **Grid**：在 Desktop 上 3-4 列展示模板；Mobile 上 1-2 列。
*   **Card**：每个模板卡片包含大图预览 + 名称 + "Use this Template" 按钮。

### 3.2 编辑模式 (Editor UI) - 即之前的"工作台"方案
一旦进入此模式，界面逻辑即采用之前定义的**"沉浸式工作台"**方案：

*   **顶部/底部工具栏**：
    *   [⬅ 返回]
    *   [🎨 切换模板 (抽屉)]
    *   [⬇ 下载]
*   **画布区**：
    *   移除左侧/右侧所有侧边栏。
    *   报纸组件居中。
    *   **响应式缩放 (Scale)**：Mobile 端自动缩小报纸以适应屏幕宽度 (No Scroll)。
*   **背景**：
    *   深色/纯净背景，强调当前正在编辑的"纸张"。

---

## 4. 技术实现路径

### 4.1 状态管理
在 `Hero` 组件内部增加一个核心状态：
```tsx
type HeroMode = 'gallery' | 'editor';
const [mode, setMode] = useState<HeroMode>('gallery');
const [selectedTemplate, setSelectedTemplate] = useState(null);

// Handler
const handleSelectTemplate = (tpl) => {
  setSelectedTemplate(tpl);
  setMode('editor');
  // Optional: Scroll to top smoothly
};
```

### 4.2 条件渲染
```tsx
return (
  <section className={`transition-all duration-500 ${mode === 'editor' ? 'min-h-screen z-50 fixed inset-0 bg-background' : 'py-12'}`}>
    {mode === 'gallery' ? (
      <TemplateGallery onSelect={handleSelectTemplate} />
    ) : (
      <Workbench 
        template={selectedTemplate} 
        onBack={() => setMode('gallery')}
      />
    )}
  </section>
);
```
*(注：实际实现中可能不完全用 `fixed`，而是用布局切换，视具体 CSS 结构而定)*

---

## 2. 交互流程变革

### 2.1 状态分离
我们将 Hero 区域分为两种互斥的交互状态：
1.  **浏览/选择态 (Template Picker)**：用户浏览缩略图，寻找灵感。
2.  **编辑态 (Workbench)**：用户专注于报纸内容的创作，拥有最大的屏幕空间。

### 2.2 新的操作流
1.  **默认进入**：如果已选中默认模板，直接进入**编辑态**。
2.  **切换模板**：
    *   用户点击顶部/底部工具栏的“**切换模板 (Change Template)**”按钮。
    *   唤起**“模态抽屉 (Drawer/Modal)”**。
    *   用户选择新模板 -> 抽屉关闭 -> 回到编辑态。

---

## 3. 详细 UI 布局设计

### 3.1 顶部浮动工具栏 (Floating/Sticky Toolbar)
为了把屏幕 C 位完全留给报纸，我们将所有“非编辑”功能收纳到工具栏。

*   **Desktop (桌面端)**：
    *   位置：顶部吸附 (Sticky Top) 或 悬浮在 Hero 顶部。
    *   左侧：**[ 图标 + 切换模板 ]** 按钮（点击滑出左侧抽屉）。
    *   中间：社交分享图标（低调处理）。
    *   右侧：**[ 下载/导出 ]** 组合按钮（保持醒目）。
*   **Mobile (移动端)**：
    *   位置：屏幕底部固定栏 (Sticky Bottom Bar)。
    *   布局：
        *   [ 🎨 模板 ] (左侧，点击弹起底部面板)
        *   [ 👁️ 预览 ] (中间，点击切换全屏预览/编辑模式)
        *   [ ⬇️ 下载 ] (右侧，核心 CTA)

### 3.2 模板选择器 (The Drawer)
不再作为页面布局的一部分长期驻留，而是作为**覆盖层 (Overlay)**。

*   **形式**：
    *   **Desktop**：**左侧抽屉 (Left Drawer)**。点击按钮时从屏幕左侧滑出，宽度约 300-400px，带有毛玻璃背景，覆盖在编辑器之上。选择后自动收起。
    *   **Mobile**：**底部面板 (Bottom Sheet)**。点击按钮时从底部升起，展示横向或网格状的模板缩略图。
*   **优势**：释放 100% 的水平空间给编辑器，彻底解决小屏幕笔记本（13寸）左右布局拥挤的问题。

### 3.3 编辑画布 (The Canvas)
这是本次重构的核心区域。

*   **布局逻辑**：
    *   **Flex Center**：编辑器在屏幕正中央显示。
    *   **背景氛围**：周围留白区域采用深色/浅色纹理背景，营造“桌面上放着一张报纸”的视觉隐喻。
*   **响应式缩放 (Intelligent Scaling)**：
    *   由于移除了左侧列表，Desktop 端有更多空间。但对于 Mobile，我们依然保留 **CSS Scale** 方案。
    *   **核心算法**：
        ```javascript
        // 伪代码：动态计算缩放比，留出边距
        const availableWidth = window.innerWidth;
        const newspaperWidth = 700;
        const padding = 32;
        let scale = 1;

        if (availableWidth < newspaperWidth + padding) {
          scale = (availableWidth - padding) / newspaperWidth;
        }
        // 应用 scale，确保报纸永远完整展示在屏幕中央
        ```

---

## 4. 移动端 (Mobile) 极致体验细节

在手机端，由于屏幕极小，我们采用类似 Instagram Story 编辑器的交互：

1.  **默认视图**：
    *   报纸通过 Scale 缩小，完整展示在屏幕中央。
    *   顶部导航栏透明或隐藏。
    *   底部只有一行操作栏：[模板] [编辑文本] [下载]。
2.  **编辑交互**：
    *   **点击文本**：当用户点击报纸上的小字时，**自动放大 (Zoom In)** 并聚焦到该文本框，或者弹出一个**半屏输入框**（避免键盘遮挡编辑区）。
    *   **双指缩放**：允许用户自由缩放画布查看细节。

---

## 5. 组件架构重构计划

我们将拆分 `src/components/hero.tsx` 为更小的原子组件以降低复杂度：

```text
components/hero/
├── HeroContainer.tsx      // 主容器，管理 selectedTemplate 状态
├── Workbench.tsx          // 画布区域，处理 Scale 和 Center 逻辑
├── Toolbar.tsx            // 响应式工具栏 (Desktop顶部 / Mobile底部)
├── TemplateDrawer.tsx     // 模板选择抽屉 (Desktop左侧 / Mobile底部Sheet)
└── ExportManager.tsx      // 封装原本复杂的导出逻辑
```

---

## 6. 预期收益

1.  **空间利用率提升 40%+**：移除常驻列表，编辑器占据全屏。
2.  **沉浸感**：用户感觉像是在使用一个 App，而不是浏览一个网页。
3.  **多端体验统一**：通过抽屉/模态框的设计，桌面端和移动端的交互逻辑在本质上达成了一致（都是按需唤起选择器）。

---

## 7. 实现更新：URL 驱动状态与安全退出机制 (2025-12-18)

基于上述设计方案，我们在实现阶段进行了进一步的架构优化，重点解决了状态持久化与用户误操作导致内容丢失的问题。

### 8.1 URL 驱动的状态管理 (URL-Driven State)
摒弃了单纯的 React `useState` 内部状态，改用 Next.js 的 URL Search Params (`?mode=editor&template=simple`) 来驱动视图。
*   **优势**：支持浏览器刷新保持当前视图；支持分享链接直接进入特定模板的编辑态；天然支持浏览器的历史记录导航。

### 8.2 全方位防误触退出机制 (Comprehensive Exit Safety)
为了防止用户在未保存的情况下意外退出编辑器（导致内容丢失），我们实现了一套多层拦截机制：

1.  **退出确认弹窗 (ExitDialog)**：
    *   在任何试图离开编辑器的操作发生前，弹出一个高优先级的模态框，警告用户"更改将不会保存"。

2.  **多级拦截策略**：
    *   **浏览器后退按钮**：利用 `history.pushState` 和 `popstate` 事件拦截浏览器的物理/手势后退操作。点击后退不再直接跳转，而是触发确认弹窗。
    *   **全局导航链接**：通过全局 `click` 监听器捕获页面上所有 `<a>` 标签（如顶部 Logo、导航菜单）的点击事件。自动判断是否为内部导航，如果是，则阻止默认跳转，先弹出确认框，用户确认后再执行路由跳转。
    *   **页面刷新/关闭**：注册 `beforeunload` 事件，触发生效浏览器原生的"离开此页面？"警告。
    *   **显式操作**：点击工具栏的 "Change Template" 按钮同样触发此确认流程。

3.  **视觉层级调整**：
    *   `Workbench` 保持适当的 `z-index` (200)，确保它覆盖主要内容但允许导航栏可见（配合上述拦截机制），维持了应用的一体性。
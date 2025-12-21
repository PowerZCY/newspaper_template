# 报纸编辑与AI生成内容的完整技术方案

## 1. 方案目标
- 支持用户在报纸编辑页面手动编辑或通过AI生成报纸内容。
- 用户编辑结果（包括AI生成内容）实时缓存到浏览器本地（localStorage/sessionStorage）。
- 支持内容的导出（JSON格式，不含图片）与导入（JSON数据直接渲染到页面）。
- 兼容Simple/Modern两种报纸模板，字段映射清晰。
- AI生成内容时可配置生成字符数，避免内容过长或过短影响排版。

---

## 2. 字段设计与模板映射

### 2.1 BaseConfig 字段
BaseConfig 定义了两种模板的初始内容结构：
- **Simple模板字段**：
  - edition, headline, title, mainText, sideTitle, sideDesc, bottomTitle, bottomDesc, footer
- **Modern模板字段**：
  - leftTop, rightTop, headline, subTitle, aboutTitle, aboutText, dateDay, dateMonth, addr1, addr2, addr3, dateTime, joinTitle, joinText

### 2.2 缓存结构设计
- 以模板类型为key，缓存结构如下：
```json
{
  "templateType": "simple" | "modern",
  "content": { ...字段内容... }
}
```
- 示例：
```json
{
  "templateType": "simple",
  "content": {
    "edition": "...",
    "headline": "...",
    ...
  }
}
```

---

## 3. 本地缓存与保存机制

### 3.1 缓存方式
- 使用 `localStorage`（或`sessionStorage`，推荐localStorage）按模板类型分别存储。
- 每次用户编辑（手动或AI生成）后，自动将最新内容序列化为JSON存入本地缓存。
- key建议：`newspaper_template_simple`、`newspaper_template_modern`

### 3.2 保存逻辑
- 监听每个字段的onBlur/onChange事件，内容变更时自动保存。
- AI生成内容填充后也立即保存。
- 提供"手动保存"按钮作为补充。

### 3.3 导出功能
- 提供"导出JSON"按钮，将当前内容结构（不含图片base64，仅文本字段）导出为json文件。
- 导出内容示例：
```json
{
  "templateType": "modern",
  "content": {
    "headline": "AI赋能新闻",
    "aboutText": "人工智能正在改变新闻行业...",
    ...
  }
}
```

### 3.4 导入功能
- 提供"导入JSON"入口，用户选择本地json文件，解析后校验结构（templateType与content字段），自动填充到页面并覆盖当前内容。
- 导入后立即保存到本地缓存。

---

## 4. 渲染机制

### 4.1 初始渲染
- 页面加载时，优先从localStorage读取缓存内容。
- 若无缓存，则使用BaseConfig的默认内容。
- 渲染时根据templateType选择Simple或Modern模板组件，并将content字段传入。

### 4.2 动态渲染
- 用户每次编辑或导入内容后，页面自动根据最新content重新渲染。
- 字段映射与BaseConfig保持一致，确保兼容性。

---

## 5. AI生成内容接入点与限制

### 5.1 生成流程
1. 用户在某个字段旁点击"AI生成"按钮。
2. 弹窗输入提示词，并可设置最大字符数（如200字，默认可配置）。
3. 前端调用后端API（如 `/api/ai-generate`），将提示词和字符数传递给AI。
4. AI返回内容后，自动填充到对应字段，并立即保存到本地缓存。

### 5.2 提示词与长度控制
- 提示词中自动拼接"请生成不超过X个字符的内容，适合报纸排版"。
- 长度参数可全局配置，也可每次生成时单独设置。

---

## 6. 关键代码结构（伪代码）

### 6.1 缓存与渲染
```js
// 保存到localStorage
type NewspaperCache = {
  templateType: 'simple' | 'modern',
  content: Record<string, string>
};

function saveToCache(data: NewspaperCache) {
  localStorage.setItem(`newspaper_template_${data.templateType}`, JSON.stringify(data));
}

function loadFromCache(templateType) {
  const raw = localStorage.getItem(`newspaper_template_${templateType}`);
  return raw ? JSON.parse(raw) : null;
}

// 页面加载时
const cache = loadFromCache(currentTemplateType);
const content = cache?.content || BaseConfig[currentTemplateType].defaultContent;
```

### 6.2 导出/导入
```js
// 导出
function exportJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  // 触发下载...
}

// 导入
function importJson(file) {
  // 读取并校验结构，填充到页面并保存
}
```

### 6.3 AI生成
```js
async function aiGenerate(fieldKey, prompt, maxChars) {
  const res = await fetch('/api/ai-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, maxChars }),
  });
  const data = await res.json();
  setContent(fieldKey, data.text);
  saveToCache({ templateType, content });
}
```


## 执行步骤
```mermaid
flowchart TD
    A[设计 OpenRouter AI API 调用] --> B[前端接口设计]
    B --> C[数据缓存设计]
    C --> D[导入导出接口设计]

    %% 详细说明
    A:::api
    B:::frontend
    C:::cache
    D:::importexport

    classDef api fill:#f9f,stroke:#333,stroke-width:2;
    classDef frontend fill:#bbf,stroke:#333,stroke-width:2;
    classDef cache fill:#bfb,stroke:#333,stroke-width:2;
    classDef importexport fill:#ffd,stroke:#333,stroke-width:2;
```

---

## 7. 总结
本方案实现了报纸内容的AI生成、手动编辑、实时本地缓存、导入导出、动态渲染等全流程，兼容Simple/Modern模板，字段结构清晰，便于团队开发和后续扩展。



## 2. AIEditableContext 和 AIEditable 的联动原理

### 2.1 设计目标

- **全局唯一AI对话框**：同一时刻页面上只能有一个AI对话框弹出，避免多个区域同时弹窗导致混乱。
- **激活管理**：点击任意一个AIEditable区域时，只有该区域能弹出AI对话框，其他区域自动关闭。

### 2.2 实现原理

#### 1. Context 提供全局状态

- `AIEditableContext` 通过 React Context 提供了两个全局状态：
  - `activeId: string | null` —— 当前激活的AIEditable的唯一id
  - `setActiveId: (id: string | null) => void` —— 设置激活id的方法

#### 2. Provider 包裹页面

- 你需要用 `<AIEditableProvider>` 包裹页面（或模板的根节点），这样所有子组件都能访问到同一个 Context。

#### 3. AIEditable 组件内部逻辑

- 每个 `AIEditable` 组件内部用 `useId()` 生成唯一的 `selfId`。
- 当你点击某个AIEditable区域时，调用 `setActiveId(selfId)`，把自己设为"当前激活"。
- 组件内部通过 `activeId === selfId` 判断自己是否是当前激活的，如果是，则显示AI对话框，否则不显示。
- 这样无论页面有多少个AIEditable，**同一时刻只有一个的对话框会显示**。

#### 4. 关闭对话框

- 对话框关闭时，调用 `setActiveId(null)`，全局没有激活项，所有AIEditable的对话框都关闭。

---

### 2.3 代码联动流程图

```mermaid
graph TD
  A[AIEditableProvider] --> B1[AIEditable#1]
  A[AIEditableProvider] --> B2[AIEditable#2]
  A[AIEditableProvider] --> B3[AIEditable#3]
  B1 -- 点击 --> A
  B2 -- 点击 --> A
  B3 -- 点击 --> A
  A -- activeId广播 --> B1
  A -- activeId广播 --> B2
  A -- activeId广播 --> B3
  B1 -- activeId==selfId? --> B1[显示对话框]
  B2 -- activeId==selfId? --> B2[显示对话框]
  B3 -- activeId==selfId? --> B3[显示对话框]
```

---

## 3. 总结

- **AIEditableContext** 负责全局唯一激活状态的管理。
- **AIEditable** 通过 Context 判断自己是否被激活，从而决定是否显示AI对话框。
- 这样设计可以让任意数量的AIEditable组件在页面上共存，但同一时刻只会有一个AI对话框弹出，用户体验一致且不会混乱。

---

## 8. AI连续对话问答对话框技术实现方案

### 8.1 设计目标
- 支持用户与AI进行多轮连续对话，形成问答消息流。
- 每次用户发送提示词后，立即在对话框右侧显示用户消息，AI响应后在左侧显示AI消息。
- 保留原有标题、关闭按钮、提示词输入区、发送/生成中按钮等设计。
- 对话消息本地缓存，防止误操作丢失。
- 对话框底部固定一排操作按钮：替换（Replace）、复制（Copy）、重新生成（ReGenerate）。
- 对话框有最小/最大高度，内容超出时出现滚动条。
- 关闭对话框仅允许通过X按钮。

### 8.2 界面结构
- **顶部**：标题 + 关闭（X）按钮 + **Context Card** (当前编辑字段摘要)。
- **中部**：对话消息区（左AI/右用户气泡，支持滚动，**自定义滚动条**）。
- **底部**：
  - 提示词输入区（textarea，保留原有自适应高度、最大长度等特性）。
  - 操作按钮区（Replace、Copy、ReGenerate，Insert本期忽略）。

### 8.3 消息存储与本地缓存
- 每个AIEditable区域维护一组对话消息（数组），结构如下：
```ts
// 单条消息结构
interface AIMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

// 区域对话缓存结构
interface AIChatCache {
  editableId: string; // 唯一id
  messages: AIMessage[];
}
```
- 本地缓存key建议：`ai_chat_{editableId}`，缓存过期时间4小时。
- 每次对话消息变更（发送/响应/重新生成）后，自动序列化存入localStorage。
- 每个AIEditable区域有且仅有一个独立的对话消息缓存，互不干扰。
- 每次打开对话框时，都是新建缓存（如有历史缓存先清理再新建），关闭对话框时要清空缓存，避免本地缓存超载！
- 缓存过期策略：每次写入时记录时间戳，读取时如超4小时则自动清理。
- **缓存清理机制更新：** 点击X按钮时会清理所有AIEditable区域的缓存（即所有以统一前缀开头的localStorage项），而不是只清理当前区域。这样可以防止历史缓存残留，确保所有AI对话缓存都被彻底清理。
- **技术实现说明：** 缓存key有统一前缀（如`xxx_AI_CHAT_`），清理时会遍历localStorage，批量删除所有以该前缀开头的项。

### 8.4 发送与响应流程
1. 用户输入提示词，点击发送：
   - 立即将用户消息（role: 'user'）追加到消息数组，渲染在右侧。
   - 发送请求到后端，进入生成中状态。
2. 后端响应成功：
   - 将AI消息（role: 'ai'）追加到消息数组，渲染在左侧。
   - 生成中状态结束。
3. 失败时可弹出错误提示。

#### 伪代码示例：
```ts
// 发送消息
function sendUserPrompt(prompt: string) {
  addMessage({ role: 'user', text: prompt, timestamp: Date.now() });
  setLoading(true);
  fetch('/api/ai-generate', { ... })
    .then(res => res.json())
    .then(data => {
      addMessage({ role: 'ai', text: data.text, timestamp: Date.now() });
      setLoading(false);
      saveChatToCache();
    })
    .catch(() => setLoading(false));
}

function addMessage(msg: AIMessage) {
  setMessages(prev => [...prev, msg]);
  saveChatToCache();
}

function saveChatToCache() {
  localStorage.setItem(`ai_chat_${editableId}`, JSON.stringify(messages));
}

function loadChatFromCache() {
  const raw = localStorage.getItem(`ai_chat_${editableId}`);
  return raw ? JSON.parse(raw) : [];
}
```

### 8.5 操作按钮功能
- **Replace（替换）**：将最近一条AI消息的内容写入主文本区域（调用onChange），并可选自动关闭对话框。
- **Copy（复制）**：将最近一条AI消息内容复制到剪切板。
- **ReGenerate（重新生成）**：用最近一条用户消息的内容再次发起AI请求，追加新AI消息。
- **Insert**：本期忽略。

#### 伪代码示例：
```ts
// Replace
function handleReplace() {
  const lastAI = messages.filter(m => m.role === 'ai').slice(-1)[0];
  if (lastAI) onChange(lastAI.text);
}
// Copy
function handleCopy() {
  const lastAI = messages.filter(m => m.role === 'ai').slice(-1)[0];
  if (lastAI) navigator.clipboard.writeText(lastAI.text);
}
// ReGenerate
function handleReGenerate() {
  const lastUser = messages.filter(m => m.role === 'user').slice(-1)[0];
  if (lastUser) sendUserPrompt(lastUser.text);
}
```

### 8.6 高度与滚动
- 对话框设置最小高度（如320px）、最大高度（如600px），超出部分消息区出现滚动条。
- 提示词输入区与按钮区固定在底部。
- 可用CSS实现：
```css
.dialog-body {
  min-height: 320px;
  max-height: 600px;
  overflow-y: auto;
}
```

### 8.7 关闭逻辑
- 仅允许通过X按钮关闭。
- 关闭时会清理所有AIEditable区域的对话消息缓存（即所有以统一前缀开头的localStorage项）。
- 重新打开时自动加载上次对话（如未被清理）。

### 8.8 与AIEditableContext的结合
- 每个AIEditable区域的对话框只允许一个激活（见前文2.2节）。
- 对话消息与区域id绑定，互不干扰。

### 8.9 总体流程图
```mermaid
sequenceDiagram
  participant User
  participant UI as AIEditable
  participant Cache as 对话缓存(localStorage)
  participant API as AI后端
  User->>UI: 输入提示词/点击发送
  UI->>Cache: 写入user消息
  UI->>API: 请求AI生成
  API-->>UI: 返回AI内容
  UI->>Cache: 写入ai消息
  User->>UI: 点击Replace/Copy/ReGenerate
  UI->>Cache: 读取最新AI消息
  User->>UI: 点击X关闭
  UI->>Cache: 清空缓存（所有AIEditable区域缓存）
```

### 8.10 数据交互及流向图
```mermaid
graph TD
  U["用户"] -->|输入提示词| T["提示词输入区"]
  T -->|写入user消息| C["对话缓存<br/>(localStorage)"]
  T -->|请求| A["AI后端"]
  A -->|AI响应| C
  C -->|渲染| M["消息区"]
  M -->|Replace/Copy/ReGenerate| C
  X["关闭按钮"] -->|点击| C
  C -->|清空所有缓存| E["缓存清空"]
  style C fill:#f9f,stroke:#333,stroke-width:2;
  style A fill:#bbf,stroke:#333,stroke-width:2;
  style T fill:#ffd,stroke:#333,stroke-width:2;
  style M fill:#bfb,stroke:#333,stroke-width:2;
  style X fill:#faa,stroke:#333,stroke-width:2;
  style E fill:#eee,stroke:#333,stroke-width:2;
```

### 8.11 对话缓存保留与恢复机制

### 设计思路
- AI对话消息缓存（localStorage）**只在用户主动点击关闭（X）按钮时清理**。
- 失焦、切换tab、刷新页面等场景**不会清理缓存**，用户回来后可恢复对话内容。
- 打开AI对话框时，自动检查本地缓存（key为当前编辑区域id），如有且未过期，则恢复消息流。
- 每次消息变更都写入缓存，缓存有4小时过期机制。
- 关闭按钮（X）为唯一清理缓存入口。
- **缓存清理机制更新：** 关闭按钮（X）会清理所有AIEditable区域的缓存（即所有以统一前缀开头的localStorage项），而不是只清理当前区域。

### 典型流程
1. 用户打开AI对话框，检查本地缓存：
   - 有缓存且未过期：恢复对话消息流。
   - 无缓存或已过期：初始化空对话。
2. 用户与AI多轮对话，消息实时写入缓存。
3. 用户失焦、切换tab、刷新页面，缓存不清理，回来后可继续。
4. 用户主动点击关闭（X）按钮，清理缓存。

### Mermaid流程图
```mermaid
graph TD
  A[用户打开AI对话框] --> B{本地缓存是否存在且未过期}
  B -- 是 --> C[恢复对话消息流]
  B -- 否 --> D[初始化空对话]
  C & D --> E[用户与AI多轮对话]
  E --> F[每次消息变更写入缓存]
  F --> G{用户操作}
  G -- 失焦/切换tab/刷新 --> F
  G -- 点击关闭X --> H[清理所有缓存]
  style B fill:#ffd,stroke:#333,stroke-width:2;
  style C fill:#bfb,stroke:#333,stroke-width:2;
  style D fill:#bfb,stroke:#333,stroke-width:2;
  style E fill:#bbf,stroke:#333,stroke-width:2;
  style F fill:#f9f,stroke:#333,stroke-width:2;
  style H fill:#faa,stroke:#333,stroke-width:2;
```

### 方案优势
- 极大提升用户体验，避免因误操作或意外失焦导致对话丢失。
- 只要不是主动关闭，用户都能恢复对话内容。
- 缓存过期机制防止本地存储无限增长。

---

## 9. AIEditable 组件参数说明 (AIEditableProps)

为了确保开发的一致性和可维护性，`AIEditable` 组件的所有 Props 定义如下：

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| **seqId** | `string` | **Yes** | - | 唯一序列号 ID，用于生成缓存 Key 和识别编辑区域。格式建议：`templateName_fieldName`。 |
| **value** | `string` | **Yes** | - | 当前文本内容（HTML string）。通常绑定到父组件的状态。 |
| **onChange** | `(val: string) => void` | **Yes** | - | 内容变更回调函数。`val` 为变更后的 HTML 字符串。 |
| **placeholder** | `string` | No | `"Please enter..."` | 文本框为空时的占位提示（注：在 contentEditable 中需配合 CSS 实现）。 |
| **label** | `string` | No | `undefined` | **字段显示名称**。在 AI 弹窗顶部的 "Context Card" 中显示（例如 "Headline"）。若不传，则自动从 `seqId` 解析。 |
| **aiPromptDefault** | `string` | No | - | 打开 AI 弹窗时，输入框中预填的默认提示词。 |
| **className** | `string` | No | - | 应用于编辑区域容器 `div` 的 CSS 类名。**注意**：请使用 `block` 布局和 `text-center` 等原子类，避免使用 `flex` 导致换行异常。 |
| **style** | `CSSProperties` | No | - | 应用于编辑区域容器 `div` 的内联样式。组件内部默认合并了 `minHeight: '1em'` 以防止空内容塌陷。 |
| **editableProps** | `HTMLAttributes` | No | - | 透传给内部 `div` 的其他 HTML 属性（如 `spellCheck`, `tabIndex` 等）。 |
| **aiButtonRender** | `function` | No | - | 自定义渲染 AI 触发按钮的函数。若不传，则使用默认的紫色 Sparkles 悬浮按钮。 |
| **modalTitle** | `string` | No | - | 自定义 AI 弹窗的标题。默认为 "AI Generate"。 |
| **disabled** | `boolean` | No | `false` | 是否禁用编辑功能。禁用后不可点击，不显示 AI 按钮。 |
| **type** | `'title' \| 'text'` | No | `'text'` | 字段类型。决定了 AI 生成时的上下文提示策略。 |
| **aiTitleMaxChars** | `number` | No | `30` | 当 `type='title'` 时，限制 AI 生成内容的最大字符数。 |
| **aiMaxChars** | `number` | No | `600` | 当 `type='text'` 时，限制 AI 生成内容的最大字符数。 |

**重要样式约束：**
1.  **AI 触发按钮**：默认在移动端使用 `absolute -top-12 right-0` (上方悬浮)，桌面端使用 `absolute -top-2 -right-20` (侧边悬浮)，且尺寸在移动端自动加大 (`px-5 py-2.5`) 以适应触控。
2.  **空状态保护**：组件强制应用 `min-height: 1em` 和 `min-width: 20px`，确保即使用户删光内容，编辑区也不会塌陷消失。
3.  **Portal 渲染**：AI 弹窗强制使用 `createPortal` 渲染至 `document.body`，以规避父级容器的 `transform: scale` 缩放影响。
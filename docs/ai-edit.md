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
- 当你点击某个AIEditable区域时，调用 `setActiveId(selfId)`，把自己设为“当前激活”。
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


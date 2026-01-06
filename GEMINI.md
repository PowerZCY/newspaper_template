## 文件读取限制
- 永远不要读取任何字体文件，包括但不限于 .ttf、.otf、.woff、.woff2、.eot 等格式。
- 不要读取 /fonts、/public/fonts、/assets/fonts、/static/fonts 等目录下的任何文件。
- 不要读取 build、dist、.next、out 等构建产物目录。
- 不要读取 node_modules 目录。
- 只读取源码文件：.ts、.tsx、.js、.jsx、.json、.md、.css、.scss 等。

## 任务约束
- 当用户要求修改 package.json 或更换依赖时，只修改 package.json 和必要的锁文件（package-lock.json 或 yarn.lock），不要扫描或读取其他无关文件。
- 涉及导出、图片、字体相关问题时，仅基于提供的文档和代码逻辑分析，不要主动读取字体二进制文件。
- 除非任务真的涉及到这些大文件，在你执行任务前要和我确认，得到我的授权后才允许读取或者是处理大文件
- 这个要求是为了避免无意义的上下文Token急剧膨胀，导致我为你的错误额外掏钱买单！
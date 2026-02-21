# 实现对照表

## 建议来源
- 文件：`e:\Study(myself)\自己做的\博客\修改的建议 copy 5.txt`

## 技术需求清单
- 文章页正文整体改为暗色玻璃风格，覆盖常见容器与内元素；颜色按指定 RGBA 使用。
- 代码块与行内代码暗色化；表格、引用、分割线、链接颜色统一适配。
- 右侧栏所有卡片强制展开，禁用折叠按钮；若由 JS 控制折叠则提供兜底脚本并在 DOMContentLoaded 与 pjax:complete 执行。
- 保持顶部 Header 图不变，变化仅限正文及右侧栏。

## 具体改动
- 修改文件：`css/custom.css`
  - 新增“Article area: force dark”样式块，覆盖 `#post`, `#page`, `#post .post-content`, `#article-container`, `#post-content`, `.article-content` 等容器。
  - 统一段落、列表、次文字、表格、引用、分割线、链接颜色；代码块与行内代码暗色配色，含 `backdrop-filter`、`box-shadow`。
  - 新增“Aside: force expand all”样式块，强制展开 `.is-collapsed`, `.collapsed`, `.hide`, `.hidden`, `.toggle-content` 并隐藏 `.toggle-btn`, `.btn-toggle`, `.expand`, `.collapse`, `.fa-angle-down`, `.fa-chevron-down`。

- 新增文件：`js/aside-expand.js`
  - 兜底移除右侧栏折叠类与隐藏内联样式，并在 `DOMContentLoaded` 与 `pjax:complete` 时执行；幂等绑定。

- 注入方式：`js/custom.js`
  - 通过 `btf.getScript('/js/aside-expand.js')` 在全站加载脚本，无需逐页改动。

## 验证方式
- 白底正文是否消失：在 `posts/openclaw-feishu/index.html` 打开，确认 `#article-container` 与 `.article-content` 背景为 `rgba(17,28,46,0.62)`，代码块为 `rgba(11,18,32,0.92)`；链接颜色铜金，hover 为枫叶红。
- 右侧栏折叠是否禁用：尝试点击任意折叠按钮或箭头，不应出现折叠；若页面含折叠类或内联隐藏样式，加载后自动展开。
- 本地运行：
  - 构建：`npm run build` 成功，见下方日志摘要。
  - 预览：开发服务已运行，访问 `http://localhost:4173/` 与文章页确认效果一致、无控制台报错。

## 测试结果日志摘要
- 构建：Vite 构建成功（约 1s），输出 `dist/index.html` 与相关资源；无错误，仅 CSS 兼容提示。
- 预览：开发服务器 `http://localhost:4173/` 正常；页面无致命报错，右侧栏强制展开生效。

## 影响范围与兼容
- 仅覆盖正文与侧栏常见容器；未变更顶部 Header 背景图。
- 使用 `!important` 保证覆盖不同页面结构；若主题脚本动态折叠，JS 兜底确保展开。

## 文件路径一览
- `css/custom.css`
- `js/aside-expand.js`
- `js/custom.js`


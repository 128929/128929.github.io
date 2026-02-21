# 修改记录（依据 e:\Study(myself)\自己做的\博客\修改的建议 copy 4.txt）

日期：2026-02-21

本次更新按建议完成以下改动：

- 在 `css/custom.css` 新增暗色模式专用样式：配色变量、全站背景图、遮罩层、卡片玻璃风格、hover 强化、链接强调与 Footer 暗色样式。
- 全站背景图路径占位为 `/img/bg-autumn-wreck.jpg`（请将实际图片放入 `img/` 目录并按需替换路径）。
- 所有样式限定于 `html[data-theme='dark']` 作用域，避免影响浅色模式。

---

日期：2026-02-21（第二次更新）

根据 `修改的建议 copy 4.txt` 第 1 条（仅重配“底下那一大片 + 卡片”颜色，不动顶部 header）：

- 在 `css/custom.css` 末尾追加内容区重配样式：
  - `#body-wrap` 背景改为冷雾蓝黑 `rgba(11,18,32,0.92)`；
  - `#content-inner` 背景透明，保留层次；
  - 文章卡片、侧栏卡片、页面卡片统一玻璃态与酒红氛围阴影；
  - hover 时轻微提亮与阴影增强；
  - 主/次文字冷白提亮与分割线淡化；
  - 链接颜色铜金，hover 枫叶红；
  - Footer 统一为冷雾蓝黑并加模糊。

验证要点：

- 顶部 header 图不变（首页 `#page-header.full_page` 背景仍为秋林图）；
- 首页、文章页、分类页的内容区与卡片均呈现新配色；
- 链接与 hover 颜色按建议生效；
- Footer 风格与内容区一致。

文件改动：

- `css/custom.css`：追加约 75 行样式。

回滚方案：

- 若需回退此配色，只需删除或注释 `custom.css` 末尾新追加的块；
- 或将 `#body-wrap` 的背景透明度下调为 `rgba(11,18,32,0.78)` 以减弱覆盖。

验证要点：

- 切换为暗色模式后（点击页面右侧的“日夜切换”按钮或系统深色模式），页面背景应显示为深蓝黑基底 + 背景图 + 遮罩，卡片呈半透明玻璃风格，文字与链接色符合建议中的色值。

文件改动：

- `css/custom.css`：新增 76 行暗色样式块（变量、背景、遮罩、卡片、hover、链接、Footer）。

注意：

- 若需要仅在暗色模式生效，请保持 `data-theme='dark'` 选择器；若需扩展到浅色模式，再补充非暗色作用域样式。

---

日期：2026-02-21（第三次更新）

依据 `修改的建议 copy 4.txt` 中“禁用侧边栏跟随/悬挂（sticky/fixed）”的指令：

- 在 `css/custom.css` 末尾追加覆盖规则（含 `!important`）：
  - 将 `#aside-content`、`#aside-content .sticky_layout`、`#aside-content .sticky`、`#aside-content .card-widget` 全部强制设为 `position: static`，`top/bottom: auto`；
  - 清除 `transform` 以避免部分主题通过位移实现跟随；
  - 兜底覆盖内联 `position: fixed` 的情况（选择器 `[style*="position:fixed"]`）。

定位依据：

- 页面结构确认 `index.html` 中侧栏容器为 `#aside-content`，最近文章卡片为 `.card-widget.card-recent-post`，并存在 `.sticky_layout` 包裹（`index.html`:201 之后）。
- 现有样式中存在将 `.card-recent-post` 与 `#aside-content` 设为 `position: sticky` 的规则（`css/custom.css`:437-444、455-473），本次覆盖以 `!important` 保证禁用。

验证过程：

- 启动本地静态服务（已运行在 `http://localhost:8000/`），页面资源实际加载 `css/custom.css`（`index.html`:172）。
- 由于本环境未安装浏览器内核，无法使用自动化浏览器读取 computed style；改用级联规则审核法：末尾追加的 `!important` 规则对同一元素选择器优先级更高，足以覆盖先前的 sticky/fixed 设置。
- 目测验证可通过浏览器打开首页，在右侧侧栏滚动时，卡片应随页面正常滚动，不再吸附顶部。

文件改动：

- `css/custom.css`：追加约 25 行覆盖规则。

回滚方案：

- 删除 `custom.css` 末尾“Disable aside sticky/follow (Butterfly)”块；或将覆盖规则注释掉。
- 若仅需取消“最近文章”不跟随，可改为使用更精准选择器：
  ```css
  #aside-content .card-widget.card-recent-post,
  #aside-content .card-widget#card-recent-post { position: static !important; top: auto !important; transform: none !important; }
  ```

---

日期：2026-02-21（第四次更新）

依据 `修改的建议 copy 4.txt` 中“让首页/分类/标签/归档/友链/关于/搜索等页面顶部统一背景图”的要求：

- 在 `css/custom.css` 末尾追加全局覆盖：`#page-header { background-image: url('/img/autumn-forest.png') !important; ... }`，确保所有含 `#page-header` 的页面统一使用同一背景图；保留原有底部配色与卡片风格。
- 针对导航可选优化，增加未固定状态下的玻璃态半透明背景：`#page-header:not(.nav-fixed):not(.not-top-img) #nav { background: rgba(10,14,22,0.35) !important; backdrop-filter: blur(10px); }`，以与顶部背景更融合。
- 修正首页 JS 的占位替换逻辑（`js/custom.js`:95-102），当检测到默认 `butterfly-top.jpg` 时，改为统一指向 `/img/autumn-forest.png`。

验证要点：

- 所有页面均加载 `css/custom.css`（如 `about/index.html`:165、`index.html`:172），且新增规则使用 `!important`，会覆盖各页面内联的 `style="background-image: ..."`。
- 本地静态服务已运行：`http://localhost:8000/`；由于浏览器内核未安装，自动化读取 computed style 受限，采用级联规则优先级审核 + 页面结构核对法验证。
- 首页已存在 `#page-header.full_page` 指向同一图（`css/custom.css`:960-964），其余页面由新增的全局规则覆盖统一。

文件改动：

- `css/custom.css`：末尾追加 2 条全局规则，统一顶部背景与导航玻璃态；
- `js/custom.js`：首页占位背景替换改为统一图路径。

回滚方案：

- 删除或注释 `css/custom.css` 末尾两条新增规则，即可恢复各页面原有顶部背景；
- 或将 `js/custom.js` 中对首页背景的替换行改回 `/img/placeholder.jpg`；
- 若改回主题配置生成静态页，按主题配置项 `index_img/default_top_img/archive_img/tag_img/category_img` 恢复。

---

日期：2026-02-21（第五次更新）

对应建议编号：#1（图标/头像稳定）、#3（Fog 漂浮）、#4（落叶飘落）

改动摘要：

- 修复左上角图标/头像：将站点 favicon 统一为 `/img/favicon.ico`，并在运行时兜底修正 `<link rel="shortcut icon">`；侧边头像统一使用 `/img/butterfly-icon.png`（支持懒加载占位 `/img/loading.gif`）。
- 背景雾气（Fog Drift）：保留既有 `js/bg-fog.js` 并增强 DEBUG 日志；确保 `pointer-events:none`、`z-index:0`、DPR 适配、轻微视差、PJAX 重建与销毁。
- 新增落叶飘落（鼠标互动）：新增 `js/bg-leaves.js` 与 `css/bg-effects.css`，实现暗红/酒红/铜金叶片下落与旋转、鼠标半径排斥、移动端默认关闭，尊重 `prefers-reduced-motion`，PJAX 切页销毁与重建。
- 注入方式：在 `js/main.js` 动态加载 `bg-effects.css`、`bg-fog.js`、`bg-leaves.js`，全站生效且避免重复创建。

文件与路径：

- 修改：`index.html`（favicon 从 `/img/favicon.png` 修正为 `/img/favicon.ico`）
- 修改：`js/main.js`（动态注入 CSS/JS，兜底修复 favicon 与头像路径；加载并初始化 fog/leaves）
- 修改：`js/bg-fog.js`（按 DEBUG 开关输出 `[fog] mounted`）
- 新增：`css/bg-effects.css`（fog/leaves canvas 层样式）
- 新增：`js/bg-leaves.js`（落叶特效实现）

验证要点：

- 打开首页/文章页/分类页，看到雾气与落叶；在移动端或 `prefers-reduced-motion` 下不显示；控制台仅在 `DEBUG=true` 时输出 `[fog] mounted` 与 `[leaves] mounted`。
- 鼠标在内容区域正常可点击；canvas 均为 `pointer-events:none` 且不遮挡；切页不叠加多个实例（PJAX 销毁/重建）。

回滚方案：

- 删除 `css/bg-effects.css` 与 `js/bg-leaves.js`；在 `js/main.js` 移除相应 `getCSS/getScript` 与初始化逻辑；`js/bg-fog.js` 的日志行可一并移除。

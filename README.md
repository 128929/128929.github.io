# 文章详情页前端工程

## 快速开始
- 安装依赖：`npm i`
- 启动开发：`npm run dev`
- 构建生产包：`npm run build`
- 本地预览：`npm run preview`

## 目录
- `src/views/Article.vue`
- `src/assets/css/article.css`
- `src/components/ArticleMeta.vue`、`ArticleToc.vue`、`CommentSection.vue`
- `src/plugins/markdown.js`
- `src/composables/useTheme.js`、`useFontSize.js`、`useI18n.js`
- `tests/unit/*.spec.ts`、`cypress/e2e/article.cy.ts`

## 特性
- 代码高亮、MathJax、Mermaid 按需加载
- 阅读进度条与 TOC 跟随
- 暗黑模式、字体大小、语言切换
- PWA 离线缓存、RSS 拉取

## 质量
- Lint：`npm run lint`
- 单元测试：`npm run test`
- E2E：`npm run test:e2e`
- Lighthouse：`npm run lhci`

## 部署到 GitHub Pages
- 使用 GitHub Actions 构建并发布到 `gh-pages`
- 回滚：保留上一版本构建产物，切换 Pages 指向或回退 commit

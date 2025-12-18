# 博客部署到GitHub Pages文档

## 1. 背景介绍

### 1.1 什么是静态博客
静态博客是指使用静态HTML、CSS和JavaScript构建的网站，不需要服务器端的动态处理。相比动态博客，静态博客具有以下优势：
- 加载速度快，性能优异
- 安全性高，不易受到黑客攻击
- 部署简单，成本低
- 易于维护和备份

### 1.2 为什么选择GitHub Pages
GitHub Pages是GitHub提供的免费静态网站托管服务，非常适合部署个人博客：
- 免费使用，无需服务器成本
- 自动部署，与Git版本控制集成
- 支持自定义域名
- 全球CDN加速，访问速度快
- 稳定可靠，GitHub提供的服务保障

## 2. 前置条件

### 2.1 环境要求
- **Git**：版本控制工具，用于管理代码和部署
- **Node.js**（可选）：如果使用Hexo等静态博客生成器，需要Node.js环境
- **GitHub账号**：用于创建仓库和托管博客

### 2.2 本地环境检查

#### 2.2.1 检查Git版本
```bash
git --version
# 示例输出：git version 2.51.0.windows.1
```

#### 2.2.2 检查Git用户配置
```bash
git config --global user.name
git config --global user.email
```

如果没有配置，使用以下命令配置：
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

## 3. 操作步骤

### 3.1 本地博客准备

#### 3.1.1 现有博客检查
确保本地博客目录包含完整的静态文件：
- `index.html`：博客首页
- `css/`：样式文件
- `js/`：JavaScript文件
- `posts/`：博客文章
- 其他必要的静态资源

#### 3.1.2 博客目录结构示例
```
自己的博客/
├── 404/                  # 404页面
├── about/                # 关于页面
├── archives/             # 归档页面
├── assets/               # 静态资源
├── audio/                # 音频文件
├── categories/           # 分类页面
├── css/                  # 样式文件
├── custom/               # 自定义文件
├── gallery/              # 画廊页面
├── img/                  # 图片资源
├── js/                   # JavaScript文件
├── link/                 # 友链页面
├── movies/               # 电影页面
├── music/                # 音乐页面
├── posts/                # 博客文章
├── project/              # 项目页面
├── shuoshuo/             # 说说页面
├── tags/                 # 标签页面
├── 404.html              # 404错误页面
├── atom.xml              # RSS订阅
├── index.html            # 博客首页
├── manifest.json         # Web应用清单
├── search.xml            # 搜索索引
└── sitemap.xml           # 站点地图
```

### 3.2 Git仓库初始化

#### 3.2.1 在本地博客目录初始化Git
```bash
cd 自己的博客
git init
```

#### 3.2.2 创建.gitignore文件
创建适合静态博客的.gitignore文件，忽略不必要的文件：

```bash
# Dependencies
node_modules/
.npm/

# Build outputs
dist/
public/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS files
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
.cache/

# Environment variables
.env
.env.local
.env.*.local

# Testing
coverage/
.nyc_output/

# Hexo specific
.deploy*/
.db
```

### 3.3 GitHub仓库创建

#### 3.3.1 登录GitHub
访问 https://github.com 并登录您的GitHub账号。

#### 3.3.2 创建新仓库
- 点击右上角"+"号，选择"New repository"
- 仓库名称：建议使用 `<username>.github.io`（例如：`128929.github.io`）
- 仓库类型：选择"Public"
- 初始化选项：不勾选任何初始化选项
- 点击"Create repository"

### 3.4 本地仓库与GitHub仓库关联

#### 3.4.1 复制GitHub仓库地址
在GitHub仓库页面，复制仓库的HTTPS或SSH地址，例如：
- HTTPS：`https://github.com/128929/128929.github.io.git`
- SSH：`git@github.com:128929/128929.github.io.git`

#### 3.4.2 添加远程仓库
```bash
git remote add origin https://github.com/128929/128929.github.io.git
```

### 3.5 提交并推送

#### 3.5.1 添加文件到暂存区
```bash
git add .
```

#### 3.5.2 提交文件
```bash
git commit -m "Initial commit"
```

#### 3.5.3 推送文件到GitHub
```bash
git push -u origin master
```

**注意**：如果远程仓库已存在内容，可能需要强制推送：
```bash
git push -f origin master
```

## 4. GitHub Pages配置

### 4.1 启用GitHub Pages
1. 进入GitHub仓库
2. 点击"Settings"选项卡
3. 在左侧菜单中找到"Pages"
4. 在"Source"部分：
   - 选择"Branch: master"
   - 选择"/(root)"
5. 点击"Save"

### 4.2 访问博客
GitHub Pages部署完成后，您可以通过以下地址访问博客：
- 如果仓库名称是 `<username>.github.io`：`https://<username>.github.io`
- 如果仓库名称是其他：`https://<username>.github.io/<repo-name>`

## 5. 注意事项

### 5.1 常见问题及解决方案

#### 5.1.1 推送失败：权限问题
**错误信息**：`Permission denied (publickey)`
**解决方案**：
- 检查SSH密钥是否正确配置
- 或使用HTTPS地址进行推送
- 确保GitHub账号有权限访问该仓库

#### 5.1.2 推送失败：远程仓库有未同步内容
**错误信息**：`Updates were rejected because the remote contains work that you do not have locally`
**解决方案**：
- 如果确认本地内容是最新的，使用强制推送：`git push -f origin master`
- 否则，先拉取并合并远程内容：`git pull origin master --allow-unrelated-histories`

#### 5.1.3 GitHub Pages访问404
**可能原因**：
- 部署尚未完成（通常需要1-5分钟）
- 分支或路径设置错误
- 缺少index.html文件
**解决方案**：
- 等待几分钟后重试
- 检查GitHub Pages设置
- 确保根目录有index.html文件

### 5.2 最佳实践

1. **定期备份**：确保本地有完整的博客备份
2. **使用分支**：建议使用分支管理不同版本的博客内容
3. **提交信息规范**：使用清晰的提交信息，便于回溯历史
4. **自定义域名**：如果需要，可以配置自定义域名
5. **添加CNAME文件**：如果使用自定义域名，需要在根目录添加CNAME文件

## 6. 后续维护

### 6.1 更新博客内容
1. 在本地修改或添加博客内容
2. 运行以下命令更新到GitHub：
   ```bash
   git add .
   git commit -m "Update blog content"
   git push origin master
   ```
3. 等待几分钟，GitHub Pages会自动部署更新

### 6.2 博客主题更新
1. 更新本地主题文件
2. 按照上述步骤提交并推送
3. 检查部署后的效果

## 7. 文档更新日志

| 版本 | 日期       | 更新内容               | 更新人 |
|------|------------|------------------------|--------|
| 1.0  | 2025-12-18 | 初始文档创建           | 128929 |

## 8. 参考资料

- [GitHub Pages官方文档](https://pages.github.com/)
- [Git官方文档](https://git-scm.com/doc)
- [Hexo官方文档](https://hexo.io/docs/)（如果使用Hexo）

---

**文档作者**：128929  
**联系方式**：1289296860@qq.com  
**最后更新**：2025-12-18
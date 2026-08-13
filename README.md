# HiCode Docs

基于 **Next.js SSG（静态站点生成）** 的 Markdown 文档站点，一套代码同时支持发布到 **GitHub Pages** 与 **Cloudflare Pages**。

## 特性

- **SSG 静态导出**：`output: "export"`，构建产物为纯静态 HTML，加载快、无需服务器
- **Markdown 驱动**：文档以 Markdown 编写，放在 `src/content/` 目录，支持 GFM 表格、任务列表等语法
- **分类 / 封面 / 标签**：Frontmatter 声明 `category`、`cover`、`tags`，首页卡片瀑布流展示
- **滚动无限加载**：构建期生成 `public/posts-data.json`，客户端渐进渲染，保持纯静态托管
- **双平台部署**：通过环境变量控制 `basePath`，无缝适配 GitHub Pages 子路径与 Cloudflare Pages 根路径
- **CI 自动发布**：内置 GitHub Actions 工作流，推送即部署

## 技术栈

| 依赖 | 说明 |
| ---- | ---- |
| Next.js 16 (App Router) | 框架，静态导出 |
| React 19 | UI 库 |
| gray-matter | Markdown Frontmatter 解析 |
| react-markdown + remark-gfm | Markdown 渲染（支持 GFM） |
| GitHub Actions | GitHub Pages / Cloudflare Pages 自动部署 |

## 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 本地开发 http://localhost:3000
```

## 项目结构

```
.
├── .github/workflows/
│   ├── deploy-github-pages.yml       # GitHub Pages 自动部署
│   └── deploy-cloudflare-pages.yml   # Cloudflare Pages 自动部署
├── public/
│   ├── _headers                     # Cloudflare Pages 响应头（含缓存策略）
│   ├── covers/                      # 文章封面（SVG）
│   ├── favicon.svg
│   ├── posts-data.json              # 构建期自动生成，勿手改
│   └── robots.txt
├── src/
│   ├── app/                          # Next.js App Router 页面
│   │   ├── page.tsx                  # 首页
│   │   ├── posts/page.tsx            # 文档列表
│   │   └── posts/[slug]/page.tsx     # 文档详情（SSG 生成）
│   ├── components/
│   │   ├── Markdown.tsx              # Markdown 渲染组件（basePath 兼容）
│   │   ├── Admonition.tsx            # :::tip 等提示框指令
│   │   ├── Card.tsx                  # :::card 链接卡片指令
│   │   ├── Carousel.tsx              # :::carousel 轮播图指令（支持全屏查看）
│   │   ├── PostImage.tsx             # 文章图片（点击全屏查看）
│   │   ├── PostCard.tsx              # 文章卡片（封面/标题/分类/标签/时间）
│   │   ├── PostMasonry.tsx           # 瀑布流 + 滚动无限加载（客户端）
│   │   ├── SiteHeader.tsx
│   │   └── SiteFooter.tsx
│   ├── content/                      # ★ Markdown 文档目录
│   │   └── *.md                      # 每篇一个 Markdown 文件
│   └── lib/
│       └── posts.ts                  # Markdown 读取工具
├── scripts/
│   └── generate-posts-json.mjs       # 构建期生成 posts-data.json（无限加载数据源）
├── next.config.ts                    # 静态导出 + basePath 配置
└── wrangler.toml                     # Cloudflare Pages 构建设置
```

## 编写文档

在 `src/content/` 下新建 `.md` 文件即可，使用 YAML Frontmatter 声明元数据：

```md
---
title: "文档标题"
date: "2026-08-13"
excerpt: "摘要"
category: "分类名"          # 可选
cover: "/covers/xxx.svg"   # 可选，站内路径或外部 URL
tags: ["标签1", "标签2"]   # 可选
---

正文内容，支持 **Markdown** 与 GFM 语法。
```

### 自定义组件（指令语法）

除标准 Markdown 外，还支持 `remark-directive` 指令语法，可映射到自定义 React 组件（如提示框）：

```md
:::tip
这是一段 tip 提示框。
:::

:::warning
这是一段 warning 警告框。
:::
```

支持类型：`note`、`tip`、`warning`、`danger`、`success`。

链接卡片（展示图标、描述与跳转链接，点击整卡跳转）：

```md
:::card{title="Next.js" url="https://nextjs.org" image="/images/nextjs.svg"}
用于构建现代 Web 应用的 React 框架。
:::
```

支持的指令属性：`title`（标题）、`url`（跳转链接，外部链接新窗口打开）、
`image`（图标图片，支持站内 `/images/xxx.png` 与外部 URL）。

新增自定义组件：在 `src/lib/remark-custom.ts` 中注册指令类型，在
`src/components/Markdown.tsx` 的 `components` 中映射到对应的 React 组件。

## 构建与本地预览

```bash
npm run build     # 构建，产物输出到 out/
npm run preview   # 本地预览静态产物
npm run typecheck # TypeScript 类型检查
```

## 发布到 GitHub Pages

1. 在仓库 `Settings → Pages` 中将 Source 设为 **GitHub Actions**
2. 推送代码到 `main` 分支，`.github/workflows/deploy-github-pages.yml` 会自动构建部署
3. 访问 `https://<user>.github.io/<repo>/`

## 发布到 Cloudflare Pages

**方式一（推荐）**：Cloudflare Dashboard 创建 Pages 项目 → Connect to Git → 构建设置：

- Build command: `npm run build`
- Build output directory: `out`

**方式二**：使用仓库内置的 `deploy-cloudflare-pages.yml` 工作流，需配置 Secrets：
`CF_API_TOKEN`（Pages:Edit 权限）与 `CF_ACCOUNT_ID`。

### 添加 Google Analytics（谷歌统计）

项目内置 GA4 统计组件（`src/components/GoogleAnalytics.tsx`），构建时读取环境变量
`NEXT_PUBLIC_GA_ID`：设置了才注入 gtag 脚本，未设置时不输出任何内容，不影响其他平台部署。

1. 在 Google Analytics 后台创建 GA4 媒体资源 → 添加 Web 数据流，获取形如 `G-XXXXXXXXXX` 的测量 ID
2. 按你的部署方式配置：

- **方式一（Cloudflare Pages 直连 Git）**：Cloudflare Dashboard → Pages → 你的项目 →
  **Settings → Environment variables**，添加 `NEXT_PUBLIC_GA_ID`（Production 环境），
  保存后到 **Deployments** 重新部署一次
- **方式二（GitHub Actions 部署）**：GitHub 仓库 → **Settings → Secrets and variables → Actions**，
  新建 Secret `NEXT_PUBLIC_GA_ID`，然后推送代码触发部署

3. 验证：构建后检查 `out/index.html` 中是否包含 `googletagmanager.com/gtag/js`；
   发布后可在 GA4 后台 **Realtime** 面板实时确认访问数据

### 添加 Google AdSense（谷歌广告）

项目内置 AdSense 自动广告组件（`src/components/GoogleAdsense.tsx`），构建时读取环境变量
`NEXT_PUBLIC_ADSENSE_CLIENT`：设置了才加载广告脚本，未设置时不输出任何内容。

1. 站点内容通过 **Google AdSense 审核**（需有足够的原创内容与隐私政策等页面）
2. 在 AdSense 后台获取发布商 ID，形如 `ca-pub-XXXXXXXXXXXXXXXX`
3. 按你的部署方式配置（同 Google Analytics 的两种方式，变量名改为 `NEXT_PUBLIC_ADSENSE_CLIENT`）
4. 审核通过后在 AdSense 后台 **自动广告** 中开启广告位类型（如信息流、插页式等），
   Google 会根据页面内容自动投放广告

> 如需在文章指定位置插入**手动广告单元**，可在目标组件中放置
> `<ins class="adsbygoogle" data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" />`
> 并调用 `(adsbygoogle = window.adsbygoogle || []).push({})`。

## 环境变量

| 变量 | 说明 | 示例 |
| ---- | ---- | ---- |
| `NEXT_PUBLIC_BASE_PATH` | 部署子路径（GitHub Pages 项目站点必填） | `/repo-name`，Cloudflare 为空 |
| `NEXT_PUBLIC_SITE_URL` | 站点地址，用于 SEO 元数据 | `https://example.github.io/repo` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 测量 ID（可选，设置后构建期自动注入统计代码） | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense 发布商 ID（可选，设置后构建期加载自动广告脚本） | `ca-pub-XXXXXXXXXXXXXXXX` |

## License

MIT

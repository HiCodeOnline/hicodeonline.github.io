---
title: "部署指南：GitHub Pages 与 Cloudflare Pages"
date: "2026-08-12"
excerpt: "详细介绍如何将本站发布到 GitHub Pages 与 Cloudflare Pages，以及 basePath 的工作原理。"
tags: ["部署", "GitHub Pages", "Cloudflare Pages"]
---

本项目基于 Next.js 的 `output: "export"` 静态导出，构建产物输出到 `out/` 目录，可以部署到任意静态托管平台。

## 工作原理

- `next.config.ts` 中的 `basePath` 由环境变量 `NEXT_PUBLIC_BASE_PATH` 控制
- **GitHub Pages** 项目站点部署在子路径 `https://<user>.github.io/<repo>/`，需设置 `NEXT_PUBLIC_BASE_PATH=/<repo>`
- **Cloudflare Pages** 部署在根路径，`NEXT_PUBLIC_BASE_PATH` 保持为空即可

## 本地构建与预览

```bash
npm install
npm run build     # 构建产物输出到 out/
npm run preview   # 本地预览 out/ 目录
```

## 发布到 GitHub Pages

仓库已内置 GitHub Actions 工作流（`.github/workflows/deploy-github-pages.yml`），
推送 `main` 分支后会自动构建并以子路径部署：

1. 在 GitHub 仓库 `Settings → Pages` 中，将 Source 设置为 **GitHub Actions**
2. 推送代码到 `main` 分支，等待工作流执行完成
3. 访问 `https://<user>.github.io/<repo>/`

> 注意：若你的仓库是用户主页仓库 `<user>.github.io`，请手动将工作流中的
> `NEXT_PUBLIC_BASE_PATH` 改为空字符串（用户站点部署在根路径）。

### 手动部署

```bash
NEXT_PUBLIC_BASE_PATH=/<repo> npm run build
npx gh-pages -d out
```

## 发布到 Cloudflare Pages

### 方式一：连接 Git 仓库（推荐）

1. 在 [Cloudflare Dashboard](https://dash.cloudflare.com) 创建 Pages 项目
2. 选择 **Connect to Git**，授权并选择本仓库
3. 构建设置如下（也可在 `wrangler.toml` 中配置）：

   | 配置项 | 值 |
   | ------ | -- |
   | Build command | `npm run build` |
   | Build output directory | `out` |
   | Node.js version | `22` |

4. 保存后 Cloudflare 会自动构建并部署，访问 `https://<project>.pages.dev`

### 方式二：Wrangler CLI / GitHub Actions

本地直接上传：

```bash
npm install -g wrangler
wrangler login
npx wrangler pages deploy out --project-name=<project-name>
```

仓库也提供了 `.github/workflows/deploy-cloudflare-pages.yml` 工作流，
只需在仓库 `Settings → Secrets and variables → Actions` 中配置：

- `CF_API_TOKEN`：Cloudflare API Token（权限需包含 Pages:Edit）
- `CF_ACCOUNT_ID`：Cloudflare 账户 ID

## 环境变量一览

| 变量 | 说明 | 示例 |
| ---- | ---- | ---- |
| `NEXT_PUBLIC_BASE_PATH` | 部署子路径 | GitHub Pages 为 `/repo`，Cloudflare 为空 |
| `NEXT_PUBLIC_SITE_URL` | 站点完整地址，用于 SEO 元数据 | `https://example.github.io/repo` |

## 常见问题

### 部署后样式/链接 404？

多为 `basePath` 未正确设置。GitHub Pages 项目站点必须设置
`NEXT_PUBLIC_BASE_PATH=/<仓库名>`，重新构建后部署即可。

### 如何新增一篇文档？

在 `src/content/` 下新建 `my-doc.md`，写入 Frontmatter 与正文，
推送到仓库后自动构建发布。

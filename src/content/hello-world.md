---
title: "你好，世界"
date: "2026-08-13"
excerpt: "欢迎来到 HiCode Docs —— 一个基于 Next.js 静态导出（SSG）的 Markdown 文档站点。"
category: "入门"
cover: "/covers/cover-hello.svg"
tags: ["Next.js", "SSG", "Markdown"]
---

欢迎来到 **HiCode Docs**！这是一个使用 Next.js 构建的 SSG（静态站点生成）项目，文档全部以 Markdown 编写。

## 如何使用

在 `src/content/` 目录下新建一个 `.md` 文件即可自动生成页面：

```md
---
title: "我的文档标题"
date: "2026-08-13"
excerpt: "摘要内容"
category: "分类名"           # 可选，用于卡片上的分类徽标
cover: "/covers/xxx.svg"    # 可选，文章封面
tags: ["标签1", "标签2"]
---

这里是正文内容，支持 **Markdown** 语法。
```

## 支持的特性

- **Frontmatter**：通过 `gray-matter` 解析标题、日期、摘要、标签等元数据
- **GFM 语法**：通过 `remark-gfm` 支持表格、任务列表、删除线等扩展语法
- **静态导出**：构建时生成纯静态 HTML，部署到任意静态托管平台

### 表格示例

| 特性 | 说明 | 是否支持 |
| ---- | ---- | :------: |
| 表格 | GFM 表格 | ✅ |
| 任务列表 | `- [ ]` 待办 | ✅ |
| 代码高亮 | 代码块 | ✅ |
| 图片 | 站内/站外 | ✅ |

### 任务列表示例

- [x] 搭建 Next.js SSG 项目
- [x] 编写 Markdown 渲染器
- [ ] 发布到 GitHub Pages
- [ ] 发布到 Cloudflare Pages

> 提示：编辑 `src/content/` 下的 Markdown 文件，刷新页面即可预览效果。

## 自定义组件示例

通过 `remark-directive` 指令语法，可以在 Markdown 中直接使用自定义组件：

```md
:::tip
这是一段 **tip** 提示框。
:::
```

:::tip
这是一段 **tip** 提示框，源码为 `:::tip 内容 :::`。
:::

:::warning
部署到 GitHub Pages 前，记得设置 `NEXT_PUBLIC_BASE_PATH`。
:::

:::danger
永远不要在文档中泄露密钥或敏感信息！
:::

:::success
部署成功！站点已经上线。
:::

## 链接卡片示例

通过 `:::card` 指令可以生成带图标、描述和跳转链接的卡片：

```md
:::card{title="Next.js" url="https://nextjs.org" image="/images/nextjs.svg"}
用于构建现代 Web 应用的 React 框架，本站基于它构建。
:::
```

:::card{title="Next.js" url="https://nextjs.org" image="/images/nextjs.svg"}
用于构建现代 Web 应用的 React 框架，本站基于它构建。
:::

:::card{title="Cloudflare Pages" url="https://pages.cloudflare.com" image="/images/cloudflare.svg"}
全球边缘网络托管的静态站点服务，支持自动构建、全球 CDN 与免费 HTTPS。
:::

## 轮播图示例

通过 `:::carousel` 指令可以将多张图片组合为轮播图，点击图片可全屏查看：

```md
:::carousel{title="站点封面预览"}
![你好，世界](/covers/cover-hello.svg)
![部署指南](/covers/cover-deploy.svg)
![静态生成](/covers/cover-ssg.svg)
:::
```

:::carousel{title="站点封面预览"}
![你好，世界](/covers/cover-hello.svg)
![部署指南](/covers/cover-deploy.svg)
![静态生成](/covers/cover-ssg.svg)
:::

## 了解更多

前往[部署指南](/posts/deployment-guide)查看如何发布到 GitHub Pages 与 Cloudflare Pages。

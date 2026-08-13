---
title: "静态站点 SEO 优化指南"
date: "2026-08-03"
excerpt: "语义化 HTML、结构化数据、sitemap 与 meta 标签，让静态博客获得更好的搜索引擎表现。"
category: "教程"
cover: "/covers/cover-seo.svg"
tags: ["SEO", "性能"]
---

## 语义化 HTML

使用正确的标签层级：`<h1>` 每页唯一，`<article>` 包裹正文，`<time>` 标记发布时间。

## Meta 标签

每篇文章都应输出：

- `title` 与 `description`
- `og:title`、`og:description`、`og:image`（封面图）
- `canonical` 链接

## Sitemap 与 RSS

构建期生成 `sitemap.xml` 与 `rss.xml` 并提交到 Search Console，可加速收录。

## 性能指标

- 图片使用 `loading="lazy"` 与合适的尺寸
- 静态资源长缓存（`immutable`）
- 首屏内容在 SSG HTML 中直接输出

## 结构化数据

在文章页输出 `Article` / `BlogPosting` JSON-LD，让搜索结果展示更丰富。

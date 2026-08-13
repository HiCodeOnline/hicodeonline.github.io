---
title: "Next.js SSG 静态生成深入解析"
date: "2026-08-11"
excerpt: "理解 App Router 下的静态导出机制：页面何时在构建期被渲染、如何与客户端交互保持兼容。"
category: "前端"
cover: "/covers/cover-ssg.svg"
tags: ["Next.js", "SSG", "App Router"]
---

Next.js 的 `output: "export"` 会在构建期把整个站点渲染为纯静态 HTML/CSS/JS，输出到 `out/` 目录。

## 哪些内容会在构建期生成

- 所有服务端组件（Server Components）在构建期渲染一次
- 客户端组件同样会生成首屏 HTML，供 SEO 与首屏体验
- 静态资源（`public/` 目录）原样复制

## 与客户端交互的边界

SSG 站点没有运行时服务器，因此：

- 不能使用 Server Actions（需要运行时）
- 不能依赖运行时 API 路由
- 客户端交互必须放在 `"use client"` 组件中，通过浏览器能力完成

## 渐进式加载的思路

构建期把全部文章的摘要写入 `public/posts-data.json`，首页先静态渲染第一屏卡片，滚动到底部时再由客户端组件拉取该 JSON 并增量渲染。这样既保留了 SSG 的首屏与 SEO 优势，又实现了「无限加载」的交互。

> 关键点：数据在**构建期**就绪，只是展示时机由客户端控制。

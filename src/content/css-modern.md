---
title: "现代 CSS 布局技术：从 Grid 到瀑布流"
date: "2026-08-07"
excerpt: "CSS Grid、多列布局（multi-column）与容器查询，如何在不依赖 JS 的情况下实现瀑布流。"
category: "前端"
cover: "/covers/cover-css.svg"
tags: ["CSS", "布局"]
---

## CSS Grid

Grid 适合二维布局，配合 `auto-fill` 与 `minmax` 可以轻松实现响应式网格。

## 多列布局与瀑布流

`column-count` / `columns` 配合 `break-inside: avoid` 是最简单的瀑布流实现：

```css
.masonry {
  columns: 3;
  column-gap: 1.25rem;
}

.masonry > * {
  break-inside: avoid;
}
```

卡片高度由内容决定，图片使用自然宽高比，视觉上便有了错落感。

## 容器查询

`@container` 让组件根据自身容器宽度响应，而不是依赖视口，非常适合卡片类组件复用。

## 响应式断点建议

```css
@media (max-width: 1024px) { .masonry { columns: 2; } }
@media (max-width: 640px)  { .masonry { columns: 1; } }
```

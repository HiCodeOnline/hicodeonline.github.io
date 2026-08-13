---
title: "Markdown 语法速查：写作一篇好文档"
date: "2026-08-10"
excerpt: "从标题、列表到表格、任务清单，一篇速查清单帮你快速上手 Markdown 写作。"
category: "教程"
cover: "/covers/cover-markdown.svg"
tags: ["Markdown", "写作"]
---

本站所有文章都以 Markdown 编写，下面是一份常用语法速查。

## 标题与段落

```md
# 一级标题
## 二级标题
### 三级标题
```

## 强调与列表

```md
**加粗**、*斜体*、~~删除线~~、`行内代码`

- 无序列表项
1. 有序列表项
```

## 表格与任务清单

```md
| 列 A | 列 B |
| ---- | ---- |
| 值 1 | 值 2 |

- [x] 已完成
- [ ] 待办
```

## 引用与代码块

```md
> 这是一段引用。

```js
console.log("hello");
```
```

## Frontmatter 字段

每篇文章顶部以 `---` 包裹的元数据支持：

| 字段 | 说明 | 必填 |
| ---- | ---- | :--: |
| `title` | 标题 | ✅ |
| `date` | 日期（`YYYY-MM-DD`） | ✅ |
| `excerpt` | 摘要 | ❌ |
| `category` | 分类 | ❌ |
| `cover` | 封面图路径 | ❌ |
| `tags` | 标签数组 | ❌ |

## 轮播图指令

`:::carousel` 容器指令可以将多张图片组合为轮播图，可选 `title` 属性作为标题：

```md
:::carousel{title="设计稿预览"}
![封面 A](/covers/cover-a.svg)
![封面 B](/covers/cover-b.svg)
![封面 C](/covers/cover-c.svg)
:::
```

- 指令内每张图片用普通 Markdown 图片语法 `![描述](路径)` 编写
- 点击当前图片进入全屏查看，全屏支持左右切换（按钮 / 键盘方向键 / 触摸滑动）
- 指示点可点击跳转到对应图片
- 图片路径支持站内绝对路径与外部 URL

---
title: "TypeScript 实用技巧十则"
date: "2026-08-06"
excerpt: "从类型收窄、联合类型到 Omit、satisfies，提升日常开发体验的十个实用技巧。"
category: "前端"
cover: "/covers/cover-ts.svg"
tags: ["TypeScript", "工程化"]
---

## 1. 使用 satisfies 保持类型推断

```ts
const config = { strict: true } satisfies Config;
```

既校验了结构，又保留了字面量类型。

## 2. Omit 派生类型

```ts
type PostMeta = Omit<Post, "content">;
```

列表页、卡片组件只需要元信息时非常方便。

## 3. 联合类型的收窄

```ts
if (typeof value === "string") { /* 收窄 */ }
```

## 4. 泛型约束

```ts
function get<T extends object>(obj: T, key: keyof T) { ... }
```

## 5. 工具类型

`Partial`、`Required`、`Readonly`、`Pick`、`Record` 等工具类型组合使用，可以显著减少重复类型定义。

> 本站代码全部通过 `npm run typecheck` 校验。

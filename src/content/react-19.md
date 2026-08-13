---
title: "React 19 新特性一览"
date: "2026-08-09"
excerpt: "Actions、useOptimistic、use() Hook 与更简单的文档元数据管理，React 19 带来了哪些变化。"
category: "前端"
cover: "/covers/cover-react.svg"
tags: ["React", "前端"]
---

React 19 于 2025 年正式发布，带来了不少长期演进的新特性。

## Actions 与表单

表单提交可以直接使用 `action` 属性，配合 `useActionState` 处理异步状态：

```jsx
function Form() {
  const [state, formAction] = useActionState(submit, null);
  return <form action={formAction}>...</form>;
}
```

## useOptimistic

乐观更新可以基于状态「上一份」的值立即渲染预期结果，服务端确认后再纠正。

## use() Hook

`use(promise)` 可以直接在组件中读取 Promise 或 Context，配合 Suspense 使用非常自然。

## 文档元数据

`<title>`、`<meta>` 等标签可以直接写在组件内，React 会自动提升到 `<head>`。

> 本站基于 React 19 + Next.js 16 构建，以上特性均有使用场景。

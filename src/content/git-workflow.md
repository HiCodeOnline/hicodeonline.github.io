---
title: "Git 工作流最佳实践"
date: "2026-08-08"
excerpt: "分支策略、提交信息规范、代码评审与历史重写，一套可持续的 Git 工作流建议。"
category: "工具"
cover: "/covers/cover-git.svg"
tags: ["Git", "协作"]
---

## 分支策略

- `main`：始终可部署的稳定分支
- `feature/*`：功能分支，从 `main` 拉出，合并后删除
- `release/*`：发布分支，仅用于打补丁

## 提交信息规范

推荐 Conventional Commits：

```text
feat: 新增文章瀑布流
fix: 修复封面图加载失败
docs: 更新部署文档
```

## 常用指令备忘

```bash
git switch -c feature/xxx   # 新建并切换分支
git commit --amend          # 修正上一次提交
git rebase -i HEAD~3        # 交互式整理最近三次提交
```

## 评审要点

- 每次 PR 尽量小，便于 review
- 在合并前跑一遍 `npm run typecheck && npm run build`
- 避免把无关改动混进同一个 PR

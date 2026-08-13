---
title: "VS Code 效率插件与快捷键"
date: "2026-08-02"
excerpt: "把编辑器调教成趁手的工具：推荐插件清单、主题与高频快捷键。"
category: "工具"
cover: "/covers/cover-vscode.svg"
tags: ["VS Code", "效率"]
---

## 推荐插件

| 插件 | 用途 |
| ---- | ---- |
| Prettier | 统一代码格式 |
| ESLint | 静态检查 |
| GitLens | 代码溯源与历史 |
| Error Lens | 行内错误提示 |
| Tailwind CSS IntelliSense | 样式提示（若使用 Tailwind） |

## 高频快捷键

| 快捷键 | 功能 |
| ------ | ---- |
| `Ctrl+Shift+P` | 命令面板 |
| `Ctrl+P` | 快速打开文件 |
| `F12` | 跳转到定义 |
| `Shift+F12` | 查找所有引用 |
| `Ctrl+Shift+L` | 全选相同词 |

## 工作区设置

在 `.vscode/settings.json` 中启用 `formatOnSave` 与 `editor.codeActionsOnSave`，让保存即格式化。

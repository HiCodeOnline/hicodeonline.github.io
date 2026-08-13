---
title: "Cloudflare Pages 进阶配置"
date: "2026-08-05"
excerpt: "自定义域名、重定向规则、缓存策略与 Wrangler CLI 的高级用法。"
category: "部署"
cover: "/covers/cover-cloudflare.svg"
tags: ["Cloudflare", "部署"]
---

## 自定义域名

在 Pages 项目 `Custom domains` 中添加域名，Cloudflare 会自动配置 DNS 与 HTTPS 证书。

## 重定向与头部

`_headers` 文件可以按路径配置响应头：

```text
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
```

## 缓存策略

静态站点非常适合全量缓存：

```text
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

## Wrangler CLI 常用命令

```bash
wrangler pages deploy out --project-name=my-site
wrangler pages project list
```

## 结合 GitHub Actions

在 `.github/workflows/deploy-cloudflare-pages.yml` 中配置 `CF_API_TOKEN` 与 `CF_ACCOUNT_ID` 两个 Secret，推送即可自动部署。

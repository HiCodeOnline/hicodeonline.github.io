---
title: "校园二手交易平台"
date: "2026-07-01"
excerpt: "二手物品上架、聊天沟通，支持国际化"
category: "WEB"           # 可选，用于卡片上的分类徽标
cover: "/images/hisecondhandwithgo/cover.webp"    # 可选，文章封面
tags: ["Go", "React", "Next.js", "二手"]
---

写这个文档确实偷了懒，如果需要详细步骤，在Github仓库提个issue，我会花时间补充完整的文档内容

## 源码仓库

:::card{title="GitHub" url="https://github.com/HiCodeOnline/WebHiSecondHandWithGo" image="/github.svg"}
:::

:::card{title="Gitee" url="https://gitee.com/LikeOrLove/web-hi-second-hand-with-go" image="/gitee.svg"}
:::

## 效果图

:::carousel{title="APP效果图"}
![图1](/images/hisecondhandwithgo/p1.webp)
![图2](/images/hisecondhandwithgo/p2.webp)
![图3](/images/hisecondhandwithgo/p3.webp)
![图3](/images/hisecondhandwithgo/p4.webp)
![图3](/images/hisecondhandwithgo/p5.webp)
![图3](/images/hisecondhandwithgo/p6.webp)
![图3](/images/hisecondhandwithgo/p7.webp)
:::

## 开发环境

- Windows 11
- Visual Studio Code / Trae / CodeBuddy
- Go 1.26.4
- Node.js 24.18.0

## 技术栈

- 语言和框架
    - Go
    - Fiber
    - React
    - Next.js
    - Tailwind CSS
- 中间件
    - PostgreSQL
    - Redis
    - RustFS
    - Meilisearch


## 手把手教你部署

### 1、下载源码

选择文章开头GitHub、Gitee中的任意一个渠道，下载源码，源码目录包含了后端api、PC前端、移动端前端三个项目

### 2、准备环境

可以使用Visual Studio Code / Trae / CodeBuddy或者其他你熟悉的IDE打开项目

:::tip
推荐通过Docker运行，项目也提供了完整的Docker运行支持，源码目录下的docker-compose文件夹下包含了所需中间件的运行配置文件
:::

#### 2.1、部署PostgreSQL

基于docker-compose文件夹下的配置文件部署，修改.env文件中的环境变量

#### 2.2、部署Redis

基于docker-compose文件夹下的配置文件部署，修改.env文件中的环境变量

#### 2.3、部署RustFS

基于docker-compose文件夹下的配置文件部署，修改.env文件中的环境变量

:::info
部署完成后创建私有bucket和公开的bucket，并创建密钥用于访问
:::

#### 2.4、部署MeiliSearch

基于docker-compose文件夹下的配置文件部署，修改.env文件中的环境变量

#### 2.5、部署后端API

api目录下提供了Dockerfile文件用于构建镜像，docker-compose.yaml文件用于运行容器，修改config-prod.yaml文件中的配置项

#### 2.6、部署PC前端

pcweb目录下提供了Dockerfile文件用于构建镜像，docker-compose.yaml文件用于运行容器

根据README.md文件中的build命令构建容器

#### 2.7、部署手机端前端

phoneweb目录下提供了Dockerfile文件用于构建镜像，docker-compose.yaml文件用于运行容器

根据README.md文件中的build命令构建容器

#### 2.8、部署Nginx

调整配置文件，通过dockerfile文件构建镜像后部署


## 🚀二次开发

项目前后端分离，前端分PC端和手机端，区别在于PC端有管理员后台管理功能

后端基于Go + Fiber开发，高性能、高并发，设计可进行水平扩展以支持大规模用户访问，理论单机即可轻松应对校内环境


## ❤️支持作者

:::tip
关注微信公众号，及时获取最新源码通知，顺便帮助作者增加收入以支撑开源事业
![](/wxgzh.webp)
:::

**有需求和问题请在源码仓库中提issue，作者会及时回复**

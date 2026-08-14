---
title: "新拟态设计支出记账APP"
date: "2026-07-13"
excerpt: "原生Android Jetpack Compose技术栈实现，支持国际化、暗黑主题"
category: "Android"           # 可选，用于卡片上的分类徽标
cover: "/images/hihanfuwithneumorphism/cover.webp"    # 可选，文章封面
tags: ["JetpackCompose", "记账"]
---

## 源码仓库【Apache 2.0】

:::card{title="GitHub" url="https://nextjs.org" image="/github.svg"}
:::

:::card{title="GitHub" url="https://nextjs.org" image="/gitee.svg"}
:::

:::card{title="CNB" url="https://nextjs.org" image="/cnb.svg"}
:::

## 效果图

:::carousel{title="APP效果图"}
![图1](/covers/cover-hello.svg)
![图2](/covers/cover-deploy.svg)
![图3](/covers/cover-ssg.svg)
:::

## 开发环境

- Windows 11
- Android Studio Quail 1 | 2026.1.1 Patch 2

## 技术栈

- Kotlin
- Jetpack Compose
- Room
- Navigation API
- 国际化支持
- 暗黑主题支持


## 手把手教你打包

### 1、下载源码

选择文章开头GitHub、Gitee、CNB中的任意一个渠道，下载源码

### 2、加载源码

使用Android Studio打开源码项目，等待项目加载完成

:::warning
如果下载Gradle失败？有两种方式解决：
- 使用代理
- 修改gradle/wrapper/gradle-wrapper.properties中的distributionUrl属性，将Gradle的下载链接替换为国内镜像站点，如：https\://mirrors.tencent.com/gradle/gradle-9.6.1-bin.zip
:::

:::warning
如果下载依赖慢或失败？有两种方式解决：
- 使用代理
- 修改settings.gradle，找到repository相关的配置，修改为国内镜像加速地址（添加阿里云公共仓库和 Google 镜像）： 

```
# 在原来的仓库配置前面加上这两个配置
maven { url = uri("https://maven.aliyun.com/nexus/content/groups/public/") } 
maven { url = uri("https://maven.aliyun.com/nexus/content/repositories/google") }
```
:::

### 3、自定义图标

右键点击app文件夹，找到New -> Image Asset，在Path路径选择自己制作的图标文件，调整合适的裁剪大小确定后即可完成图标替换



### 4、源码打包


生成之前需要先生成一个专门用于release的keystore文件

::: danger
生成这个文件的信息一定要记住，用于后续升级时打包，否则会出现问题
:::

有多种方式可用于生成

- 使用Android Studio自带的可视化生成窗口（但是我在使用的时候可能方式不对，生成不了）
- 使用命令行生成（推荐）

    ```shell
    # Android Studio 自带了该工具
    # F:\software\AndroidStudio\jbr\bin
    keytool -genkey -v -keystore hiwallet.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
    ```

生成完成后，在生成弹窗中选择该文件，按提示步骤即可完成打包操作


## 🚀二次开发

源码目录设计
```plaintext
app/
├── src/
│   ├── main/java/online/hicode/android/hihanfu/
│   │   ├── data/  数据层
│   │   │   ├── dao/   数据库操作
│   │   │   ├── database/   数据定义
│   │   │   ├── entity/   数据库实体
│   │   │   ├── repository/   数据操作
│   │   │   └── vo/   数据展示
│   │   ├── neumorphism/   新拟态设计
│   │   ├── ui/   界面层
│   │   │   ├── components/   组件
│   │   │   ├── navigation/   页面导航相关
│   │   │   ├── screen/   页面
│   │   │   └── theme/   主题
│   │   ├── utils/   工具类
│   │   ├── HiHanfuApplication.kt   Hilt APP入口
│   │   └── MainActivity.kt   应用入口
│   ├── res/
│   │   ├── drawable/ 图片资源，使用的svg图标通过Vector Image导入进这里使用
│   │   ├── values/  默认国际化字符串
│   │   └── xml/   一些配置文件
│   └── build.gradle.kts app应用的gradle配置文件
├── gradle/
│   ├── libs.versions.toml  集中管理依赖版本
│   └── wrapper/
│       └── gradle-wrapper.properties   gradle配置
├── build.gradle.kts
└── settings.gradle.kts
```


## ❤️支持作者

:::tip
关注微信公众号，及时获取最新源码通知，顺便帮助作者增加收入以支撑开源事业
![](/wxgzh.webp)
:::

**有需求和问题请在源码仓库中提issue，作者会及时回复**

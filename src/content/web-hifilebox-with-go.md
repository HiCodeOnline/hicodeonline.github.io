---
title: "文件提取工具【快递柜】"
date: "2026-08-17"
excerpt: "支持设置临时和长期提取码以支持用户进行文件提取，以文件箱为单位，内部包含多个文件，可一次可提取多个文件"
category: "WEB"           # 可选，用于卡片上的分类徽标
cover: "/images/hifileboxwithgo/p1.webp"    # 可选，文章封面
tags: ["Go", "Fiber", "文件提取"]
---

**Powered by AI**

## 源码仓库

:::card{title="GitHub" url="https://github.com/HiCodeOnline/WebHiFileBoxWithGo" image="/github.svg"}
:::

:::card{title="Gitee" url="https://gitee.com/LikeOrLove/web-hi-file-box-with-go" image="/gitee.svg"}
:::

## 效果图

:::carousel{title="应用效果图"}
![图1](/images/hifileboxwithgo/p1.webp)
![图2](/images/hifileboxwithgo/p2.webp)
![图2](/images/hifileboxwithgo/p3.webp)
![图2](/images/hifileboxwithgo/p4.webp)
:::

## 开发环境

- Windows 11
- Visual Studio Code / Trae / CodeBuddy
- Go 1.26.4


## 技术栈

- Go
- Fiber
- Sqlite

:::tip
项目已默认开启sqlite的wal模式，无需手动开启
:::

## 功能特性

- **匿名取件**：用户输入 6 位取件码即可打开文件箱下载文件，无需注册
- **管理员后台**：账号密码在 `config.yaml` 中配置，不开放注册
- **图片验证码**：登录页内置 4 位数字图片验证码，防暴力破解
- **取件箱管理**：创建/编辑/删除取件箱，支持启用/停用状态
- **文件管理**：每个取件箱可上传多个文件，支持大文件（默认 512MB）
- **取件码**：
  - 6 位数字，全局唯一（防重复验证）
  - 长期码：支持 永久 / 按月 / 按天 / 按小时 / 按次 五种有效期
  - 临时码：支持 按月 / 按天 / 按小时 / 按次 四种有效期
- **访问令牌**：匿名用户通过取件码打开文件箱后获得令牌，1 小时后失效需重新打开
- **统计报表**：仪表盘展示取件箱/文件/取件码数量、打开次数、下载次数、热门取件箱排行

## 使用流程

### 管理员

1. 访问 `/login` 登录
2. 在「取件箱」页面新建取件箱（名称、描述、状态）
3. 进入取件箱编辑页：
   - 上传文件（支持多文件）
   - 生成取件码（选择长期码/临时码 + 有效期类型）
4. 将取件码发送给需要取件的用户
5. 在「仪表盘」或「提取统计」查看访问数据

### 匿名用户

1. 访问首页
2. 输入 6 位取件码，点击「打开文件箱」
3. 在文件箱页面查看文件列表，点击「下载」获取文件
4. 令牌 1 小时后失效，需重新输入取件码打开

## 手把手教你部署

### 1、下载源码

选择文章开头GitHub、Gitee中的任意一个渠道，下载源码

### 2、准备环境

下载并安装Go环境，并配置GO相关的环境变量

可以使用Visual Studio Code / Trae / CodeBuddy或者其他你熟悉的IDE打开项目


### 3、打包

Windows下打包成Linux运行二进制文件需要先执行环境变量

```powershell
$env:GOOS="linux"
$env:GOARCH="amd64"
$env:CGO_ENABLED="0"
```

开始构建打包

```powershell
go build -o hifilebox_linux_amd64 .
```

### 4、部署

在服务器上创建应用目录，数据库目录、文件上传目录

- /data/apps/filebox
- /data/apps/filebox/upload
- /data/apps/filebox/database

将打包好的二进制文件上传到应用目录下，并赋予可执行权限

```shell
chmod u+x /data/apps/filebox/hifilebox_linux_amd64
```

上传配置文件（config.yaml）、模板文件夹（templates）、静态资源文件夹（static）到应用目录下

修改配置文件中的配置

```yaml
# HiFileBox 配置文件
# 修改后需重启应用生效

server:
  # 监听地址与端口（使用Nginx代理时可设置为127.0.0.1）
  host: "0.0.0.0"
  port: 8088
  # 应用名称（显示在页面标题）
  app_name: "HiFileBox"
  # 是否启用调试日志
  debug: false

# 管理员账号（仅后台配置，不开放注册）
admin:
  username: "xxxxxxx"
  password: "Xx@Xxxxx#xxX"
  # 登录会话有效期（小时）
  session_ttl: 12

# 存储配置
storage:
  # SQLite 数据库文件路径
  database: "/data/apps/filebox/database/hifilebox.db"
  # 上传文件存储目录
  upload_dir: "/data/apps/filebox/upload"
  # 单文件最大上传大小（MB）
  max_upload_mb: 512

# 访问令牌配置（匿名用户通过取件码打开文件箱后的会话令牌）
access_token:
  # 有效期（小时），1 小时后失效需重新打开
  ttl_hours: 1

# 取件码配置
pickup_code:
  # 长度（位数）
  length: 6
  # 临时取件码默认使用次数上限（仅当 validity_type=count 时生效，0 表示不限制）
  default_max_uses: 1
```

使用systemctl管理filebox应用，添加filebox.service文件

```txt
[Unit]
Description=HiFileBox App
After=network.target

[Service]
Type=simple
# 运行用户（安全考虑，切勿使用root）
User=xxxxx
Group=xxxxx
# 工作目录
WorkingDirectory=/data/apps/filebox
# 启动命令
ExecStart=/data/apps/filebox/hifilebox_linux_amd64 /data/apps/filebox/config.yaml
# 崩溃后自动重启
Restart=always
# 等待5秒后重启
RestartSec=5
# 生产环境建议限制日志大小，防止磁盘爆满
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

启动应用

```shell
# 新增service文件后执行重新加载
systemctl daemon-reload
# 启动filebox服务
systemctl start filebox
# 查看filebox运行状态
systemctl status filebox
# 重启filebox服务
systemctl restart filebox
# 设置开机启动
systemctl enable filebox
```

配置Nginx（可选）

在配置文件中添加配置

```txt
upstream filebox {
    server 127.0.0.1:8088 weight=1;
    keepalive 64;
}


server {
    listen       80;
    server_name  xx.xxxx.xxx;
    return 301 https://xx.xxxx.xxx$request_uri;
}

server {
    listen       443 ssl;
    server_name  xx.xxxx.xxx;

    http2 on;

    ssl_certificate      /data/nginx/certs/xx.xxxx.xxx_nginx/xx.xxxx.xxx_bundle.pem;
    ssl_certificate_key  /data/nginx/certs/xx.xxxx.xxx_nginx/xx.xxxx.xxx.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_session_cache    shared:SSL:10m;
    ssl_session_timeout  10m;
    ssl_session_tickets off; 
    ssl_prefer_server_ciphers  on;

    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 1.1.1.1 valid=300s;
    resolver_timeout 5s;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://filebox/; 

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;          # 启用HTTP/1.1以支持keepalive
        proxy_set_header Connection "";  # 清空Connection头，配合keepalive使用

        # 超时设置，根据业务响应时间调整[citation:5][citation:8]
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        client_max_body_size 512M;
    }
}
```


## 🚀二次开发

当前项目设计简单，及其方便扩展

使用Trae、CodeBuddy等IDE打开项目，推荐通过AI添加功能

### 项目结构

```
hifilebox/
├── config.yaml              # 配置文件
├── main.go                  # 入口，路由装配
├── go.mod / go.sum
├── package.json             # Tailwind 构建脚本
├── tailwind.config.js
├── internal/
│   ├── config/              # 配置加载
│   ├── db/                  # 数据库初始化与迁移
│   ├── models/              # 数据模型与仓储层
│   │   ├── models.go        # Box/File/Code/AccessToken/AccessLog
│   │   ├── box_repo.go
│   │   ├── file_repo.go
│   │   ├── code_repo.go
│   │   ├── token_repo.go
│   │   ├── log_repo.go
│   │   └── format.go        # 模板格式化函数
│   ├── utils/               # 工具函数
│   │   ├── code.go          # 取件码生成（防重复）
│   │   ├── captcha.go       # 图片验证码
│   │   └── filetype.go      # 文件类型识别
│   ├── middleware/          # 中间件
│   │   ├── admin.go         # 管理员会话鉴权
│   │   └── access.go        # 匿名访问令牌校验
│   ├── services/            # 业务服务层
│   │   └── pickup.go        # 取件码兑换、令牌发放
│   └── handlers/            # HTTP 处理器
│       ├── container.go     # 依赖容器
│       ├── public.go        # 首页、取件、下载
│       ├── auth.go          # 登录、验证码、登出
│       └── admin_*.go       # 管理后台各页面
├── templates/               # HTML 模板
│   ├── layout.html          # 公共布局
│   ├── index.html           # 首页取件卡
│   ├── login.html           # 登录页
│   ├── box.html             # 文件箱查看页
│   ├── error.html           # 错误页
│   ├── admin_layout.html    # 管理后台布局（含侧边栏）
│   ├── partials/
│   │   └── pickup_error.html
│   └── admin/
│       ├── dashboard.html   # 仪表盘
│       ├── boxes.html       # 取件箱列表
│       ├── box_form.html    # 取件箱编辑（含文件/取件码管理）
│       └── stats.html       # 提取统计
├── static/
│   ├── css/style.css        # Tailwind 编译产物
│   ├── src/input.css        # Tailwind 源文件
│   └── js/htmx.min.js       # HTMX 库
├── data/                    # 运行时生成：SQLite 数据库
├── uploads/                 # 运行时生成：上传文件
└── cmd/seed/                # 种子/测试工具
```

### 启动

默认已安装Go，执行

```shell
go mod tidy
```

运行

```shell
go run main.go
```


## 安全说明

- 管理员密码以明文存储在 `config.yaml`，请设置强密码并保护文件权限
- 上传文件以 UUID 重命名存储，避免路径遍历
- 访问令牌通过 HttpOnly Cookie 传递，1 小时自动失效
- 验证码校验后立即清除，防止重放
- 取件码全局唯一，生成时进行防重复校验（最多 200 次尝试）
- 过期令牌每 10 分钟自动清理

## ❤️支持作者

:::tip
关注微信公众号，及时获取最新源码通知，顺便帮助作者增加收入以支撑开源事业
![](/wxgzh.webp)
:::

**有需求和问题请在源码仓库中提issue，作者会及时回复**

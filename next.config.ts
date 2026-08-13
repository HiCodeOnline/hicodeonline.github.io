import type { NextConfig } from "next";

// GitHub Pages 项目站点部署在子路径下：https://<user>.github.io/<repo>/
// 此时需要设置 NEXT_PUBLIC_BASE_PATH=/<repo>（GitHub Actions 中会自动注入）
// Cloudflare Pages 部署在根路径，保持为空即可
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // 静态导出（SSG）：构建产物输出到 out/ 目录
  output: "export",

  // 根据环境变量控制子路径，兼容 GitHub Pages / Cloudflare Pages
  basePath,

  // 生成 index.html 形式的文件（如 posts/hello/index.html），兼容 GitHub Pages
  trailingSlash: true,

  images: {
    // 静态导出不支持图片优化，必须关闭
    unoptimized: true,
  },
};

export default nextConfig;

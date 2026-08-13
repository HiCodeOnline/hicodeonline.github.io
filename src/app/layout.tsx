import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const siteName = "HiCode Docs";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  title: {
    default: `${siteName} — Markdown 文档站点`,
    template: `%s | ${siteName}`,
  },
  description:
    "基于 Next.js 静态导出（SSG）的 Markdown 文档站点，支持发布到 GitHub Pages 与 Cloudflare Pages。",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    title: `${siteName} — Markdown 文档站点`,
    description:
      "基于 Next.js 静态导出（SSG）的 Markdown 文档站点，支持发布到 GitHub Pages 与 Cloudflare Pages。",
    siteName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

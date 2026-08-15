import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAdsense from "@/components/GoogleAdsense";
import Busuanzi from "@/components/Busuanzi";

const siteName = "HiCode.Onlline";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hicode.online";

export const metadata: Metadata = {
  title: {
    default: `${siteName} — 开源源代码文档站点`,
    template: `%s | ${siteName}`,
  },
  icons: {
    icon: '/favicon.svg', // 指向 public 目录下的文件
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  description:
    "HiCode.Online开源事业文章站点。",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    title: `${siteName} — 开源源代码文档站点`,
    description:
      "HiCode.Online开源事业文章站点",
    siteName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <Busuanzi />
        <GoogleAnalytics />
        <GoogleAdsense />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

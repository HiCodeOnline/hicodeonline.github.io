import Script from "next/script";

/**
 * Google Analytics 4 (GA4) 统计脚本。
 *
 * 构建时读取环境变量 NEXT_PUBLIC_GA_ID：
 * - 设置了（如 G-XXXXXXXXXX）→ 注入 gtag.js 统计代码
 * - 未设置 → 不输出任何内容，便于本地开发与多平台部署
 *
 * 部署时在 Cloudflare Pages 环境变量 / GitHub Actions Secrets 中配置该变量即可。
 * 使用 afterInteractive 策略，脚本在页面加载后异步加载，不阻塞首屏，兼容静态导出（SSG）。
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) {
    return null;
  }

  return (
    <>
      {/* gtag.js 加载器 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      {/* GA4 初始化 */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}

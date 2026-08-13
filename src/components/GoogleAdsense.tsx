import Script from "next/script";

/**
 * Google AdSense 广告支持（Auto Ads 自动广告）。
 *
 * 构建时读取环境变量 NEXT_PUBLIC_ADSENSE_CLIENT：
 * - 设置了（如 ca-pub-XXXXXXXXXXXXXXXX）→ 加载 AdSense 自动广告脚本
 * - 未设置 → 不输出任何内容，不影响其他平台部署
 *
 * 启用前提：站点需先通过 Google AdSense 审核，并在 AdSense 后台开启自动广告。
 * 如需在指定位置插入手动广告单元，可在对应组件中另建 <ins class="adsbygoogle">
 * 广告位并调用 (adsbygoogle = window.adsbygoogle || []).push({})。
 */
export default function GoogleAdsense() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!client) {
    return null;
  }

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

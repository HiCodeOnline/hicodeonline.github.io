import Script from "next/script";

/**
 * Busuanzi统计。
 *
 */
export default function Busuanzi() {
  // 设置为ON代表启用
  const enable = process.env.NEXT_PUBLIC_BUSUANZI_ENABLE;

  if (!enable) {
    return null;
  }
  return (
    <Script
      defer={true}
      src={`https://events.vercount.one/js`}
    />
  );
}

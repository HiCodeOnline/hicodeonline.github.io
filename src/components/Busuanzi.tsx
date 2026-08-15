import Script from "next/script";

/**
 * Busuanzi统计。
 *
 */
export default function Busuanzi() {
  return (
    <Script
      src={`https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js`}
    />
  );
}

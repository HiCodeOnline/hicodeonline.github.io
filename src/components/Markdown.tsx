import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { remarkCustomDirectives } from "@/lib/remark-custom";
import Admonition from "@/components/Admonition";
import Card from "@/components/Card";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Markdown 内的内部链接需要加上 basePath，
 * 否则部署到 GitHub Pages 子路径下会 404（Cloudflare Pages 根路径不受影响）。
 */
function resolveHref(href: string | undefined): string | undefined {
  if (!href) return href;
  // 外部链接、锚点、协议链接不做处理
  if (/^(https?:|mailto:|tel:|#|\/\/)/i.test(href)) return href;
  if (basePath && !href.startsWith(basePath)) {
    return `${basePath}${href.startsWith("/") ? "" : "/"}${href}`;
  }
  return href;
}

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkDirective, remarkCustomDirectives]}
      // rehype-slug：为标题生成 id 锚点（目录跳转依赖）
      // rehype-highlight：同步插件，输出 CSS 类（.hljs-*）；
      //   detect 让无语言标记的代码块也自动检测，ignoreMissing 避免未知语言抛错
      rehypePlugins={[
        rehypeSlug,
        [rehypeHighlight, { detect: true, ignoreMissing: true }],
      ]}
      components={
        {
          // 覆盖内置元素：为内部链接补 basePath
          a: ({ href, children }: { href?: string; children?: ReactNode }) => (
            <a href={resolveHref(href)}>{children}</a>
          ),
          // 自定义元素：:::tip 等指令语法 → Admonition 组件
          admonition: (props: any) => <Admonition {...props} />,
          // 自定义元素：:::card{...} 指令 → Card 组件
          card: (props: any) => <Card {...props} />,
        } as any // react-markdown 的 Components 类型不含 admonition/card 自定义键
      }
    >
      {content}
    </ReactMarkdown>
  );
}

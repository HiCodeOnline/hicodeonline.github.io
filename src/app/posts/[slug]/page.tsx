import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Markdown from "@/components/Markdown";
import TableOfContents from "@/components/TableOfContents";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** 将站内绝对路径（/xxx）拼上 basePath，外部 URL 原样返回 */
function resolveAsset(path: string) {
  if (!path || /^https?:\/\//.test(path) || path.startsWith("data:")) return path;
  return `${basePath}${path}`;
}

// SSG：在构建时生成所有文档页面
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// 未在 generateStaticParams 中声明的 slug 直接返回 404
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      ...(post.cover ? { images: [resolveAsset(post.cover)] } : {}),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container post">
      <header className="post-header">
        <h1>{post.title}</h1>
        <p className="post-meta">
          {post.category ? (
            <span className="post-category">{post.category}</span>
          ) : null}
          <time dateTime={post.date}>{post.date}</time>
          {post.tags && post.tags.length > 0 && (
            <span> &nbsp;&nbsp;·&nbsp;&nbsp;{post.tags.join(" , ")}</span>
          )}
          &nbsp;
          <span id="busuanzi_container_page_pv"><span id="busuanzi_value_page_pv"></span></span>
        </p>
      </header>
      <div className="post-layout">
        <div className="post-body">
          <Markdown content={post.content} />
        </div>
        <aside className="post-toc">
          <TableOfContents />
        </aside>
      </div>
    </article>
  );
}

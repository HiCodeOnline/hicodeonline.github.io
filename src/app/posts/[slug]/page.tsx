import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Markdown from "@/components/Markdown";
import TableOfContents from "@/components/TableOfContents";

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
  return { title: post.title, description: post.excerpt };
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
          <time dateTime={post.date}>{post.date}</time>
          {post.tags && post.tags.length > 0 && (
            <span> · {post.tags.join(" / ")}</span>
          )}
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

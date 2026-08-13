import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "文档列表",
  description: "本站全部 Markdown 文档列表。",
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="container">
      <h1>文档</h1>
      <p className="page-desc">
        所有文档均由 <code>src/content/</code> 目录下的 Markdown 文件生成。
      </p>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>
              <span className="post-title">{post.title}</span>
              <time dateTime={post.date}>{post.date}</time>
            </Link>
            {post.category && <span className="post-category">{post.category}</span>}
            {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

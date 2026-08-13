import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <div className="container">
      <section className="hero">
        <h1>HiCode Docs</h1>
        <p className="hero-sub">
          一个基于 Next.js 静态导出（SSG）的文档站点，
          文档使用 Markdown 编写，一键发布到{" "}
          <strong>GitHub Pages</strong> 与 <strong>Cloudflare Pages</strong>。
        </p>
        <div className="hero-actions">
          <Link href="/posts/" className="btn btn-primary">
            浏览文档
          </Link>
          <a
            className="btn"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            查看源码
          </a>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>SSG 静态导出</h3>
          <p>构建时生成纯静态 HTML，加载快、安全性高，无需服务器。</p>
        </div>
        <div className="feature-card">
          <h3>Markdown 驱动</h3>
          <p>在 src/content/ 中编写 Markdown 即生成页面，支持 GFM 表格等语法。</p>
        </div>
        <div className="feature-card">
          <h3>双平台发布</h3>
          <p>一套代码同时适配 GitHub Pages 与 Cloudflare Pages。</p>
        </div>
      </section>

      <section className="latest-posts">
        <h2>最新文档</h2>
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/posts/${post.slug}`}>
                <span className="post-title">{post.title}</span>
                <time dateTime={post.date}>{post.date}</time>
              </Link>
              {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** 将站内绝对路径（/xxx）拼上 basePath，外部 URL 原样返回 */
function resolveAsset(path: string) {
  if (!path || /^https?:\/\//.test(path) || path.startsWith("data:")) return path;
  return `${basePath}${path}`;
}

function formatDate(date: string) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  if (!y || !m || !d) return date;
  return `${y}年${Number(m)}月${Number(d)}日`;
}

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="post-card">
      <Link href={`/posts/${post.slug}`} className="post-card__link">
        {post.cover ? (
          <div className="post-card__cover">
            <img
              src={resolveAsset(post.cover)}
              alt={post.title}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <div className="post-card__cover post-card__cover--fallback" aria-hidden="true">
            <span>{post.title.slice(0, 1)}</span>
          </div>
        )}

        <div className="post-card__body">
          {post.category ? (
            <span className="post-card__category">{post.category}</span>
          ) : null}

          <h3 className="post-card__title">{post.title}</h3>

          {post.excerpt ? <p className="post-card__excerpt">{post.excerpt}</p> : null}

          <div className="post-card__footer">
            {post.tags && post.tags.length > 0 ? (
              <div className="post-card__tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="post-card__tag">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
            <time className="post-card__date" dateTime={post.date}>
              {formatDate(post.date)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}

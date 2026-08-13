"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PostMeta } from "@/lib/posts";
import PostCard from "./PostCard";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
/** 每次滚动加载的条数 */
const PAGE_SIZE = 6;
/** 构建期生成的静态数据文件（见 scripts/generate-posts-json.mjs） */
const DATA_URL = `${basePath}/posts-data.json`;

export default function PostMasonry({
  initialPosts,
  totalCount,
}: {
  /** 首屏由 SSG 渲染的文章 */
  initialPosts: PostMeta[];
  /** 文章总数（构建期已知），用于判断是否还有更多 */
  totalCount: number;
}) {
  const [visibleCount, setVisibleCount] = useState(initialPosts.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length < totalCount);

  // 供 IntersectionObserver 回调读取的最新状态
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(initialPosts.length < totalCount);
  const visibleCountRef = useRef(initialPosts.length);
  const allPostsRef = useRef<PostMeta[] | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      // 首次加载时拉取构建期生成的完整数据
      if (!allPostsRef.current) {
        const res = await fetch(DATA_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`加载文章数据失败：${res.status}`);
        allPostsRef.current = (await res.json()).posts as PostMeta[];
      }
      const all = allPostsRef.current;
      // 轻微延迟，让「加载中」的交互感更明显
      await new Promise((r) => setTimeout(r, 400));
      const next = Math.min(visibleCountRef.current + PAGE_SIZE, all.length);
      visibleCountRef.current = next;
      setVisibleCount(next);
      const more = next < all.length;
      hasMoreRef.current = more;
      setHasMore(more);
    } catch (err) {
      console.error("[PostMasonry]", err);
      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <section className="masonry-section" aria-label="文章列表">
      <div className="masonry">
        {initialPosts
          .slice(0, visibleCount)
          .map((post) => <PostCard key={post.slug} post={post} />)}
      </div>

      {loading ? (
        <div className="masonry masonry--skeleton" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="post-card post-card--skeleton">
              <div className="post-card__cover post-card__skeleton-block" />
              <div className="post-card__body">
                <div className="post-card__skeleton-block post-card__skeleton-line" />
                <div className="post-card__skeleton-block post-card__skeleton-title" />
                <div className="post-card__skeleton-block post-card__skeleton-line" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div ref={sentinelRef} className="masonry-sentinel" />

      {!hasMore ? (
        <p className="masonry-end">—— 已经到底啦 ——</p>
      ) : null}
    </section>
  );
}

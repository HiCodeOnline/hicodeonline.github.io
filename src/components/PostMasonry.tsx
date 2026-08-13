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
  categories = [],
  categoryCounts = {},
}: {
  /** 首屏由 SSG 渲染的文章 */
  initialPosts: PostMeta[];
  /** 文章总数（构建期已知），用于判断是否还有更多 */
  totalCount: number;
  /** 全部分类，用于顶部分类过滤条 */
  categories?: string[];
  /** 各分类的文章数量 */
  categoryCounts?: Record<string, number>;
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(initialPosts.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length < totalCount);

  // 供 IntersectionObserver 回调 / 异步函数读取的最新状态
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(initialPosts.length < totalCount);
  const visibleCountRef = useRef(initialPosts.length);
  const activeCategoryRef = useRef<string | null>(null);
  const allPostsRef = useRef<PostMeta[] | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  /** 确保全量文章数据已加载（构建期生成的 JSON） */
  const ensureLoaded = useCallback(async (): Promise<PostMeta[]> => {
    if (allPostsRef.current) return allPostsRef.current;
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`加载文章数据失败：${res.status}`);
    const all = (await res.json()).posts as PostMeta[];
    allPostsRef.current = all;
    return all;
  }, []);

  /** 按当前分类过滤后的文章列表 */
  const getFiltered = useCallback(() => {
    const all = allPostsRef.current ?? initialPosts;
    const cat = activeCategoryRef.current;
    if (!cat) return all;
    return all.filter((post) => post.category === cat);
  }, [initialPosts]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      await ensureLoaded();
      const filtered = getFiltered();
      // 轻微延迟，让「加载中」的交互感更明显
      await new Promise((r) => setTimeout(r, 400));
      const next = Math.min(visibleCountRef.current + PAGE_SIZE, filtered.length);
      visibleCountRef.current = next;
      setVisibleCount(next);
      const more = next < filtered.length;
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
  }, [ensureLoaded, getFiltered]);

  /** 切换分类：重置分页，并从全量数据中按分类重新过滤 */
  const handleSelectCategory = useCallback(
    async (category: string | null) => {
      if (category === activeCategoryRef.current) return;
      activeCategoryRef.current = category;
      setActiveCategory(category);
      setLoading(true);
      loadingRef.current = true;
      try {
        await ensureLoaded();
        const filtered = getFiltered();
        const next = Math.min(PAGE_SIZE, filtered.length);
        visibleCountRef.current = next;
        setVisibleCount(next);
        const more = next < filtered.length;
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
    },
    [ensureLoaded, getFiltered],
  );

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

  // 渲染用的数据源：全量数据加载前使用 SSG 首屏数据
  const source = allPostsRef.current ?? initialPosts;
  const filtered = activeCategory
    ? source.filter((post) => post.category === activeCategory)
    : source;
  const displayed = filtered.slice(0, visibleCount);
  const isEmpty = filtered.length === 0;

  return (
    <section className="masonry-section" aria-label="文章列表">
      <div className="masonry-filters" role="group" aria-label="按分类过滤">
        <button
          type="button"
          className={`masonry-filter${!activeCategory ? " is-active" : ""}`}
          aria-pressed={!activeCategory}
          onClick={() => void handleSelectCategory(null)}
        >
          全部
          <span className="masonry-filter__count">{totalCount}</span>
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`masonry-filter${activeCategory === category ? " is-active" : ""}`}
            aria-pressed={activeCategory === category}
            onClick={() => void handleSelectCategory(category)}
          >
            {category}
            {categoryCounts[category] ? (
              <span className="masonry-filter__count">{categoryCounts[category]}</span>
            ) : null}
          </button>
        ))}
      </div>

      {isEmpty && !loading ? (
        <p className="masonry-empty">该分类下暂无文章</p>
      ) : (
        <div className="masonry">
          {displayed.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

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

      {!isEmpty && !hasMore ? (
        <p className="masonry-end">—— 已经到底啦 ——</p>
      ) : null}
    </section>
  );
}

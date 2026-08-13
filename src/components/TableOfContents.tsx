"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string; level: number };

/**
 * 文章侧边目录：挂载后从 .post-body 中提取 h2/h3/h4 生成目录，
 * 滚动时高亮当前章节，点击平滑滚动到对应标题。
 * 从实际渲染的 DOM 提取标题，与正文 id 完全一致，无需额外解析步骤。
 */
export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const body = document.querySelector<HTMLElement>(".post-body");
    if (!body) return;

    const headings = Array.from(body.querySelectorAll("h2, h3, h4"))
      .map((h) => ({
        id: (h as HTMLElement).id,
        text: h.textContent?.trim() ?? "",
        level: Number(h.tagName.charAt(1)),
      }))
      .filter((h) => h.id && h.text);

    if (headings.length === 0) return;
    setItems(headings);

    // 滚动监听：视口顶部带状区域内的标题即为当前章节
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="toc" aria-label="目录">
      <p className="toc-title">目录</p>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={`toc-item toc-level-${item.level}`}>
            <a
              href={`#${item.id}`}
              className={activeId === item.id ? "active" : undefined}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                  history.replaceState(null, "", `#${item.id}`);
                }
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

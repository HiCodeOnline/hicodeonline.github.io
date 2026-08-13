"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

type CarouselImage = { src: string; alt?: string; title?: string };

type CarouselProps = {
  /** remark 阶段从容器指令内提取的图片列表（JSON 字符串） */
  images?: string;
  title?: string;
};

/** 将站内绝对路径（/xxx）拼上 basePath，外部 URL 原样返回 */
function resolveAsset(path: string) {
  if (!path || /^https?:\/\//.test(path) || path.startsWith("data:")) return path;
  return `${basePath}${path}`;
}

/**
 * Markdown 轮播图组件：
 *   :::carousel{title="示例"}
 *   ![描述 1](/covers/a.svg)
 *   ![描述 2](/covers/b.svg)
 *   :::
 * 点击图片全屏查看，全屏支持左右切换（按钮 / 键盘 / 触摸滑动）。
 */
export default function Carousel({ images, title }: CarouselProps) {
  const list: CarouselImage[] = useMemo(() => {
    try {
      const parsed = JSON.parse(images ?? "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [images]);

  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = list.length;
  const current = list[Math.min(index, Math.max(count - 1, 0))];

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  // 全屏时：锁定背景滚动 + 键盘快捷键
  useEffect(() => {
    if (!fullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      else if (e.key === "ArrowLeft") go(index - 1);
      else if (e.key === "ArrowRight") go(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen, go, index]);

  // 触摸滑动切换
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    go(index + (dx < 0 ? 1 : -1));
  };

  if (count === 0) return null;

  return (
    <>
      <figure className="carousel">
        {title ? <div className="carousel-title">{title}</div> : null}

        <div className="carousel-viewport">
          <img
            key={`${current.src}-${index}`}
            src={resolveAsset(current.src)}
            alt={current.alt ?? ""}
            title={current.title ?? title}
            loading="lazy"
            className="carousel-image"
            onClick={() => setFullscreen(true)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
          {count > 1 ? (
            <>
              <button
                type="button"
                className="carousel-arrow carousel-arrow--prev"
                onClick={() => go(index - 1)}
                aria-label="上一张"
              >
                ‹
              </button>
              <button
                type="button"
                className="carousel-arrow carousel-arrow--next"
                onClick={() => go(index + 1)}
                aria-label="下一张"
              >
                ›
              </button>
            </>
          ) : null}
        </div>

        {count > 1 ? (
          <div className="carousel-dots" role="tablist" aria-label="切换轮播图">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`第 ${i + 1} 张`}
                className={`carousel-dot${i === index ? " is-active" : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        ) : null}
      </figure>

      {fullscreen
        ? createPortal(
            <div
              className="lightbox carousel-lightbox"
              onClick={() => setFullscreen(false)}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="carousel-lightbox__stage"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <img
                  key={`${current.src}-${index}`}
                  src={resolveAsset(current.src)}
                  alt={current.alt ?? ""}
                  title={current.title ?? title}
                  draggable={false}
                />
              </div>

              {count > 1 ? (
                <>
                  <button
                    type="button"
                    className="carousel-lightbox__arrow carousel-lightbox__arrow--prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      go(index - 1);
                    }}
                    aria-label="上一张"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="carousel-lightbox__arrow carousel-lightbox__arrow--next"
                    onClick={(e) => {
                      e.stopPropagation();
                      go(index + 1);
                    }}
                    aria-label="下一张"
                  >
                    ›
                  </button>
                </>
              ) : null}

              <div
                className="carousel-lightbox__meta"
                onClick={(e) => e.stopPropagation()}
              >
                <span>
                  {index + 1} / {count}
                </span>
                {title ? (
                  <span className="carousel-lightbox__title">{title}</span>
                ) : null}
              </div>

              <button
                type="button"
                className="carousel-lightbox__close"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreen(false);
                }}
                aria-label="关闭"
              >
                ×
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

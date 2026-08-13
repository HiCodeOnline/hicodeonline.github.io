"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type PostImageProps = {
  src?: string;
  alt?: string;
  title?: string;
  width?: number | string;
  height?: number | string;
};

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const clamp = (v: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, v));
const touchDist = (a: React.Touch, b: React.Touch) =>
  Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

/**
 * 文章图片：支持 width/height 设置显示比例；
 * 点击后全屏查看，可滚轮/按钮/双指缩放、拖拽平移，Esc 或点击遮罩关闭。
 */
export default function PostImage({
  src,
  alt,
  title,
  width,
  height,
}: PostImageProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const dragRef = useRef<{
    startX: number;
    startY: number;
    ox: number;
    oy: number;
  } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const scaleRef = useRef(1);

  const zoomBy = useCallback((delta: number) => {
    setScale((s) => {
      const next = clamp(s + delta);
      scaleRef.current = next;
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    scaleRef.current = 1;
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  // 打开时：锁定背景滚动、键盘快捷键、滚轮缩放
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "+" || e.key === "=") zoomBy(0.25);
      else if (e.key === "-") zoomBy(-0.25);
      else if (e.key === "0") reset();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 0.25 : -0.25);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [open, zoomBy, reset, close]);

  // 鼠标拖拽平移
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
    const onMove = (ev: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;
      setOffset({
        x: d.ox + (ev.clientX - d.startX),
        y: d.oy + (ev.clientY - d.startY),
      });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // 触屏：单指拖动，双指缩放
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches;
    if (t.length === 1) {
      dragRef.current = {
        startX: t[0].clientX,
        startY: t[0].clientY,
        ox: offset.x,
        oy: offset.y,
      };
      pinchRef.current = null;
    } else if (t.length === 2) {
      dragRef.current = null;
      pinchRef.current = { dist: touchDist(t[0], t[1]), scale: scaleRef.current };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches;
    if (t.length === 2 && pinchRef.current) {
      e.preventDefault();
      const d = touchDist(t[0], t[1]);
      const next = clamp(pinchRef.current.scale * (d / pinchRef.current.dist));
      scaleRef.current = next;
      setScale(next);
    } else if (t.length === 1 && dragRef.current) {
      const d = dragRef.current;
      setOffset({
        x: d.ox + (t[0].clientX - d.startX),
        y: d.oy + (t[0].clientY - d.startY),
      });
    }
  };

  const onTouchEnd = () => {
    dragRef.current = null;
    pinchRef.current = null;
  };

  // 正文内的显示尺寸（超出容器时 max-width: 100% 兜底）
  const w = width ? Number(width) : undefined;
  const h = height ? Number(height) : undefined;
  const displayStyle: React.CSSProperties = { maxWidth: "100%", height: "auto" };
  if (w) displayStyle.width = `${w}px`;
  if (h) displayStyle.height = `${h}px`;

  const lightbox = open
    ? createPortal(
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true">
          <div
            className="lightbox-stage"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={src}
              alt={alt}
              title={title}
              draggable={false}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              }}
            />
          </div>
          <div className="lightbox-toolbar" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => zoomBy(-0.25)} aria-label="缩小">
              −
            </button>
            <span className="lightbox-scale">{Math.round(scale * 100)}%</span>
            <button onClick={() => zoomBy(0.25)} aria-label="放大">
              +
            </button>
            <button onClick={reset} aria-label="重置缩放">
              重置
            </button>
            <button onClick={close} aria-label="关闭">
              关闭
            </button>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <figure className="post-image">
        <img
          src={src}
          alt={alt}
          title={title}
          style={displayStyle}
          loading="lazy"
          onClick={() => {
            reset();
            setOpen(true);
          }}
        />
        {alt && <figcaption>{alt}</figcaption>}
      </figure>
      {lightbox}
    </>
  );
}

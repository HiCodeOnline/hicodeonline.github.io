import type { ReactNode } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** 站内路径补 basePath，兼容 GitHub Pages 子路径部署 */
function resolvePath(p: string | undefined): string | undefined {
  if (!p) return p;
  if (/^(https?:|mailto:|tel:|#|\/\/)/i.test(p)) return p;
  if (basePath && !p.startsWith(basePath)) {
    return `${basePath}${p.startsWith("/") ? "" : "/"}${p}`;
  }
  return p;
}

type CardProps = {
  title?: string;
  image?: string;
  url?: string;
  children?: ReactNode;
};

export default function Card({ title, image, url, children }: CardProps) {
  const resolvedImage = resolvePath(image);
  const resolvedUrl = resolvePath(url);
  const isExternal = /^https?:/i.test(resolvedUrl ?? "");

  const body = (
    <>
      {resolvedImage && (
        <div className="card-image">
          <img src={resolvedImage} alt={title ?? "card image"} loading="lazy" />
        </div>
      )}
      <div className="card-content">
        {title && <h4 className="card-title">{title}</h4>}
        {children && <div className="card-desc">{children}</div>}
        {resolvedUrl && <span className="card-url">{resolvedUrl}</span>}
      </div>
    </>
  );

  // 有 url 时整卡可点击，外部链接新窗口打开
  if (resolvedUrl) {
    return (
      <a
        className="card"
        href={resolvedUrl}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
      >
        {body}
      </a>
    );
  }
  return <div className="card">{body}</div>;
}

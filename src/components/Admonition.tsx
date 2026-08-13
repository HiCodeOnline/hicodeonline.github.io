import type { ReactNode } from "react";

const icons: Record<string, string> = {
  note: "📝",
  tip: "💡",
  warning: "⚠️",
  danger: "🚫",
  success: "✅",
};

type AdmonitionProps = {
  type?: string;
  children?: ReactNode;
};

export default function Admonition({ type = "note", children }: AdmonitionProps) {
  return (
    <div className={`admonition admonition-${type}`}>
      <div className="admonition-title">
        <span>{icons[type] ?? "📌"}</span>
        <span>{type}</span>
      </div>
      <div className="admonition-body">{children}</div>
    </div>
  );
}

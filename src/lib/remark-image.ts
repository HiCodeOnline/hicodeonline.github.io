import { visit } from "unist-util-visit";
import type { Root, Text, Html, Image } from "mdast";

/**
 * 匹配 Typora 风格的图片尺寸语法：
 *   ![alt](url =300)        仅宽度
 *   ![alt](url =300x200)    宽 x 高
 *   ![alt](url "title" =300x200)
 * micromark 无法解析该语法（CommonMark 下整个会被当作普通文本），
 * 所以需要在文本节点层面用正则识别并重建 image 节点。
 */
const TYPO_IMG_RE =
  /!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\s+=\s*(\d+)(?:x(\d+))?\s*\)/g;

/** 解析 HTML 标签属性 */
function parseAttrs(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    if (m[1].startsWith("/")) continue;
    attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? "";
  }
  return attrs;
}

/**
 * 图片尺寸扩展插件，支持两种写法：
 * 1. Typora 风格 `![alt](url =300x200)`
 * 2. HTML 风格 `<img src="..." width="300" height="200" alt="...">`
 *
 * 解析出的 width/height 写入 mdast image 节点的 data.hProperties，
 * 由 react-markdown 的 img 组件读取并控制显示尺寸。
 */
export function remarkImageSize() {
  return (tree: Root) => {
    // 处理 Typora 风格语法（文本节点层面重建）
    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || index == null || index < 0) return;
      if (!TYPO_IMG_RE.test(node.value)) return;
      TYPO_IMG_RE.lastIndex = 0;

      const parts: (Text | Image)[] = [];
      let last = 0;
      let m: RegExpExecArray | null;
      while ((m = TYPO_IMG_RE.exec(node.value)) !== null) {
        if (m.index > last) {
          parts.push({ type: "text", value: node.value.slice(last, m.index) });
        }
        const [, alt, url, title, w, h] = m;
        const props: Record<string, number> = {};
        if (w) props.width = Number(w);
        if (h) props.height = Number(h);
        parts.push({
          type: "image",
          url,
          alt: alt || "",
          title: title || undefined,
          data: Object.keys(props).length ? { hProperties: props } : undefined,
        });
        last = m.index + m[0].length;
      }
      if (last < node.value.length) {
        parts.push({ type: "text", value: node.value.slice(last) });
      }
      parent.children.splice(index, 1, ...parts);
    });

    // 处理 HTML <img> 标签（react-markdown 默认不渲染原始 HTML，这里转为 image 节点）
    visit(tree, "html", (node: Html, index, parent) => {
      if (!parent || index == null || index < 0) return;
      const match = /^<img\b([^>]*)>/i.exec(node.value.trim());
      if (!match) return;
      const attrs = parseAttrs(match[1]);
      const src = attrs.src || attrs["data-src"];
      if (!src) return;

      const props: Record<string, number> = {};
      if (attrs.width) props.width = Number(attrs.width);
      if (attrs.height) props.height = Number(attrs.height);

      parent.children.splice(index, 1, {
        type: "image",
        url: src,
        alt: attrs.alt ?? "",
        title: attrs.title || undefined,
        data: Object.keys(props).length ? { hProperties: props } : undefined,
      });
    });
  };
}

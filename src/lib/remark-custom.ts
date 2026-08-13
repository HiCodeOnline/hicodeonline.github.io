import { visit } from "unist-util-visit";
import type { Root } from "mdast";

/**
 * 指令节点的自定义 data 结构。
 * 注意：不要直接继承 mdast 的 Data——它的 hProperties 是 hast 的 Properties 类型
 * （值类型受限），而指令属性值是 unknown，直接赋值会类型不兼容。
 */
type DirectiveData = {
  hName?: string;
  hProperties?: Record<string, unknown>;
};

type DirectiveNode = {
  type: string;
  name?: string;
  attributes?: Record<string, unknown>;
};

const ADMONITION_TYPES = new Set([
  "note",
  "tip",
  "warning",
  "danger",
  "success",
]);

/**
 * 将 remark-directive 解析出的指令节点转换为自定义元素：
 * - :::tip / :::warning 等 → <admonition type="tip"> → Admonition 组件
 * - :::card{title=... url=... image=...} → <card {...属性}> → Card 组件
 * - :::carousel{title=...} → <carousel images="..."> → Carousel 组件
 */
export function remarkCustomDirectives() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const directive = node as unknown as DirectiveNode;
        const name = directive.name ?? "";

        if (name === "card") {
          const data = (node.data ??= {}) as DirectiveData;
          data.hName = "card";
          // 指令属性（title/url/image 等）原样传给 Card 组件
          data.hProperties = { ...(directive.attributes ?? {}) };
        } else if (name === "carousel") {
          const images: { src: string; alt?: string; title?: string }[] = [];
          // 收集容器内所有图片节点
          visit(node as unknown as import("unist").Node, "image", (img) => {
            const image = img as unknown as {
              url: string;
              alt?: string | null;
              title?: string | null;
            };
            images.push({
              src: image.url,
              alt: image.alt ?? undefined,
              title: image.title ?? undefined,
            });
          });
          // 移除图片节点，避免与轮播展示重复渲染
          stripImages(node as unknown as import("unist").Node);
          const data = (node.data ??= {}) as DirectiveData;
          data.hName = "carousel";
          // 图片列表以 JSON 字符串传给 Carousel 组件
          data.hProperties = {
            ...(directive.attributes ?? {}),
            images: JSON.stringify(images),
          };
        } else if (ADMONITION_TYPES.has(name)) {
          const data = (node.data ??= {}) as DirectiveData;
          data.hName = "admonition";
          data.hProperties = { type: name };
        }
      }
    });
  };
}

/** 递归移除 mdast 树中的 image 节点 */
function stripImages(node: import("unist").Node): import("unist").Node {
  const n = node as unknown as { children?: import("unist").Node[] };
  const children = n.children;
  if (Array.isArray(children)) {
    n.children = children
      .filter((child) => (child as { type?: string }).type !== "image")
      .map((child) => stripImages(child));
  }
  return node;
}

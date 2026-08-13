/**
 * 构建期脚本：读取 src/content/*.md 的 frontmatter，
 * 生成 public/posts-data.json，供首页瀑布流「滚动无限加载」使用。
 * 这样无需运行时接口，纯静态托管（SSG）也能实现增量加载。
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src", "content");
const outFile = path.join(process.cwd(), "public", "posts-data.json");

if (!fs.existsSync(contentDir)) {
  console.error("[generate-posts-json] content dir not found:", contentDir);
  process.exit(1);
}

const files = fs
  .readdirSync(contentDir)
  .filter((f) => f.endsWith(".md"))
  .sort();

const posts = files
  .map((file) => {
    const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
    const { data } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      category: data.category ?? "",
      cover: data.cover ?? "",
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

fs.writeFileSync(outFile, JSON.stringify({ posts }, null, 2));
console.log(`[generate-posts-json] wrote ${posts.length} posts -> ${outFile}`);

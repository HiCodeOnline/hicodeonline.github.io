import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  content: string;
};

const postsDirectory = path.join(process.cwd(), "src", "content");

/** 读取单个 Markdown 文档（按 slug） */
export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    content,
  };
}

/** 获取全部文档，按日期倒序排列 */
export function getAllPosts(): Post[] {
  const files = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));

  const posts = files.map((file) => getPostBySlug(file.replace(/\.md$/, "")));

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

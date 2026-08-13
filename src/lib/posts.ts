import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  /** 文章分类 */
  category?: string;
  /** 文章封面：站内路径（如 /covers/xxx.svg）或外部 URL */
  cover?: string;
  tags?: string[];
  content: string;
};

/** 不含正文的元信息，用于列表 / 卡片 / posts-data.json */
export type PostMeta = Omit<Post, "content">;

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
    category: data.category ?? "",
    cover: data.cover ?? "",
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

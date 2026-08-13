import { getAllPosts } from "@/lib/posts";
import PostMasonry from "@/components/PostMasonry";

/** 首屏 SSG 渲染的文章数，其余由滚动无限加载 */
const INITIAL_COUNT = 6;

export default function HomePage() {
  const posts = getAllPosts();
  const initialPosts = posts.slice(0, INITIAL_COUNT).map(({ content, ...meta }) => meta);

  // 全部分类（按文章数降序）及各分类文章数，用于顶部分类过滤条
  const categories: string[] = [];
  const categoryCounts: Record<string, number> = {};
  for (const post of posts) {
    if (!post.category) continue;
    categoryCounts[post.category] = (categoryCounts[post.category] ?? 0) + 1;
    if (!categories.includes(post.category)) categories.push(post.category);
  }
  categories.sort((a, b) => categoryCounts[b] - categoryCounts[a]);

  return (
    <div>
      <div className="container container-wide" style={{marginTop: '24px'}}>
        <PostMasonry
          initialPosts={initialPosts}
          totalCount={posts.length}
          categories={categories}
          categoryCounts={categoryCounts}
        />
      </div>
    </div>
  );
}

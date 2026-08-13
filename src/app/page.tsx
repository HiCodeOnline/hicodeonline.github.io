import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import PostMasonry from "@/components/PostMasonry";

/** 首屏 SSG 渲染的文章数，其余由滚动无限加载 */
const INITIAL_COUNT = 6;

export default function HomePage() {
  const posts = getAllPosts();
  const initialPosts = posts.slice(0, INITIAL_COUNT).map(({ content, ...meta }) => meta);

  return (
    <div>
      <div className="container container-wide">
        <PostMasonry initialPosts={initialPosts} totalCount={posts.length} />
      </div>
    </div>
  );
}

import { PostList } from "@/components/posts/PostList";
import { getAllPosts } from "@/lib/mdx";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-4 font-semibold text-3xl underline-offset-4">
        Recent Posts
      </h1>
      <div className="mb-8">최근 작성한 게시물입니다</div>
      <PostList posts={posts} />
    </main>
  );
}

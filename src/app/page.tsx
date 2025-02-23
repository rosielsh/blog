import { PostList } from "@/components/posts/PostList";
import { getAllPosts } from "@/lib/mdx";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">merri</h1>
      <PostList posts={posts} />
    </main>
  );
}

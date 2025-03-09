import { CategoryFilter } from "@/components/posts/CategoryFilter";
import { PostList } from "@/components/posts/PostList";
import { getAllPosts, getAllCategories } from "@/lib/mdx";
import { Suspense } from "react";

export default async function PostListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const allPosts = await getAllPosts();
  const categories = await getAllCategories();

  const resolvedParams = await searchParams;
  const selectedCategory = resolvedParams.category;

  const filteredPosts = selectedCategory
    ? allPosts.filter((post) => post.category === selectedCategory)
    : allPosts;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-4 font-semibold text-3xl underline-offset-4">Posts</h1>
      <div className="mb-8">
        <Suspense fallback={<div>카테고리 로딩 중...</div>}>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
          />
        </Suspense>
      </div>
      <PostList posts={filteredPosts} />
      {filteredPosts.length === 0 && (
        <p className="text-center py-10 text-gray-500 dark:text-gray-400">
          아직 작성된 게시물이 없어요
        </p>
      )}
    </main>
  );
}

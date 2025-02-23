import { getAllPosts, getPostByFullPath } from "@/lib/mdx";
import { notFound } from "next/navigation";

// 동적 라우트 생성을 위한 params 생성
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.fullPath.split("/"),
  }));
}

// 게시물 페이지 컴포넌트
export default async function PostPage({
  params,
}: {
  params: { slug: string[] };
}) {
  // slug 배열을 경로 문자열로 변환
  const fullPath = params.slug.join("/");

  try {
    const { metadata } = await getPostByFullPath(fullPath);

    return (
      <article className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">{metadata.title}</h1>
          <p className="mt-2 text-gray-600">{metadata.desc}</p>
          <div className="mt-4 flex gap-4 text-sm text-gray-500">
            <span>{metadata.category}</span>
            <time>{new Date(metadata.date).toLocaleDateString()}</time>
          </div>
        </header>

        {/* 여기에 MDX 컨텐츠를 렌더링하는 컴포넌트가 들어갈 예정입니다 */}
      </article>
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}

import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllPosts, getPostByFullPath } from "@/lib/mdx";
import { MdxContent } from "@/components/posts/MdxContent";

// 정적 페이지 생성을 위한 경로 정보를 제공합니다
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    category: post.category,
    title: post.title,
  }));
}

// 게시물 페이지의 메타데이터를 생성합니다
export async function generateMetadata({
  params,
}: {
  params: { category: string; title: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const fullPath = `${resolvedParams.category}/${resolvedParams.title}`;

  try {
    const { metadata } = await getPostByFullPath(fullPath);
    return {
      title: metadata.title,
      description: metadata.desc,
    };
  } catch {
    return {
      title: "Post Not Found",
      description: "The post you're looking for does not exist.",
    };
  }
}

export default async function PostDetail({
  params,
}: {
  params: { category: string; title: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const fullPath = `${resolvedParams.category}/${resolvedParams.title}`;

  try {
    const { metadata, content } = await getPostByFullPath(fullPath);

    return (
      <article className="container mx-auto px-4 py-8">
        {/* 게시물 헤더 섹션 */}
        <header className="mb-8">
          {metadata.thumbnail && (
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={metadata.thumbnail}
                alt={metadata.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <h1 className="text-4xl font-bold">{metadata.title}</h1>
          <p className="mt-2 text-gray-600">{metadata.desc}</p>
          <div className="mt-4 flex gap-4 text-sm text-gray-500">
            <span>카테고리: {metadata.category}</span>
            <time>
              작성일:{" "}
              {new Date(metadata.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        {/* MDX 컨텐츠 렌더링 */}
        <div className="mt-8">
          <MdxContent source={content} />
        </div>
      </article>
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}

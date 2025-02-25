import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllPosts, getPostByFullPath } from "@/lib/mdx";
import { MdxContent } from "@/components/posts/MdxContent";
import { Comments } from "@/components/comments/Comments";
import { TableOfContents } from "@/components/posts/TableOfContents";
import { extractHeadings } from "@/lib/toc";
import { CalendarDays, Folder } from "lucide-react";

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    category: post.category,
    title: post.title,
  }));
}

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

    // MDX 콘텐츠에서 헤딩을 추출하여 목차 생성
    const headings = extractHeadings(content);
    const hasTableOfContents = headings.length > 0;

    return (
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* 메인 콘텐츠 영역 */}
          <main className="lg:col-span-9">
            <article>
              {/* 게시물 헤더 */}
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
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 justify-center">
                  <div className="flex items-center">
                    <Folder size={16} className="mr-1" />
                    <span>{metadata.category}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays size={16} className="mr-1" />
                    <time>
                      {new Date(metadata.date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              </header>

              {hasTableOfContents && (
                <div className="mb-6 block lg:hidden">
                  <details className="rounded-lg border p-4">
                    <summary className="cursor-pointer text-lg font-medium">
                      &nbsp;Table of contents
                    </summary>
                    <div className="mt-4">
                      <TableOfContents headings={headings} />
                    </div>
                  </details>
                </div>
              )}

              {/* 게시물 내용 */}
              <div className="mt-8">
                <MdxContent source={content} />
              </div>

              {/* 댓글 */}
              <div className="mt-16">
                <Comments />
              </div>
            </article>
          </main>

          {/* 사이드바 (데스크톱 전용) */}
          {hasTableOfContents && (
            <aside className="mt-8 hidden lg:sticky lg:top-20 lg:mt-0 lg:block lg:col-span-3 lg:self-start">
              <div className="rounded-lg bg-gray-50 p-6 dark:bg-black">
                <h2 className="mb-4 text-lg font-bold">Table of contents</h2>
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}

import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllPosts, getPostByFullPath } from "@/lib/mdx";
import { MdxContent } from "@/components/posts/MdxContent";
import { Comments } from "@/components/comments/Comments";
import { TableOfContents } from "@/components/posts/TableOfContents";
import { extractHeadings } from "@/lib/toc";
import { CalendarDays, Folder } from "lucide-react";
import { ScrollButton } from "@/components/posts/ScrollButton";
import { ReadingProgressBar } from "@/components/posts/ReadingProgressBar";

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
    const headings = extractHeadings(content);
    const hasTableOfContents = headings.length > 0;

    return (
      <>
        <ReadingProgressBar />
        <div className="container mx-auto px-4 py-8 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <main className="lg:col-span-9">
              <article>
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
                  <div className="mt-4 flex flex-col flex-wrap gap-2 text-sm text-gray-500 justify-center items-center">
                    <div className="flex items-center">
                      <Folder size={16} className="mr-1" />
                      <span className="text-teal-600 dark:text-teal-700">
                        {metadata.category}
                      </span>
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
                <div className="mt-8">
                  <MdxContent source={content} />
                </div>
                <div className="mt-16">
                  <Comments />
                </div>
              </article>
            </main>
            {hasTableOfContents && (
              <aside className="mt-8 hidden lg:sticky lg:top-20 lg:mt-0 lg:block lg:col-span-3 lg:self-start">
                <div className="rounded-lg bg-gray-50 p-6 dark:bg-black">
                  <h2 className="mb-4 text-lg font-bold">Table of contents</h2>
                  <TableOfContents headings={headings} />
                </div>
              </aside>
            )}
          </div>
          <ScrollButton />
        </div>
      </>
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}

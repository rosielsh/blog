import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { getAllSnippets, getSnippetBySlug } from "@/lib/snippets";
import { CodeBlock } from "@/components/snippets/CodeBlock";
import { ReadingProgressBar } from "@/components/posts/ReadingProgressBar";
import { ScrollButton } from "@/components/posts/ScrollButton";

interface SnippetDetailPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const snippets = await getAllSnippets();

  return snippets.map((snippet) => {
    const params = {
      category: snippet.category,
      slug: snippet.slug,
    };
    return params;
  });
}

export default async function SnippetDetailPage({
  params,
}: SnippetDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const { category, slug } = resolvedParams;

  const snippet = await getSnippetBySlug(category, slug);

  if (!snippet) {
    notFound();
  }

  return (
    <>
      <ReadingProgressBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/snippets/${category}`}
            className="inline-flex items-center text-teal-500 hover:text-teal-600"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>뒤로가기</span>
          </Link>

          <article className="bg-white dark:bg-white/10 rounded-lg p-10 mb-8">
            <header className="mb-8">
              <h1 className="text-2xl font-bold mb-2">{snippet.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {snippet.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 justify-center">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <time>{new Date(snippet.date).toLocaleDateString()}</time>
                </div>
                <div className="flex items-center">
                  <Tag size={16} className="mr-1" />
                  <span>{snippet.category}</span>
                </div>
              </div>
            </header>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">코드</h2>
              <CodeBlock code={snippet.code} language={snippet.language} />
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {snippet.content}
            </div>
          </article>
        </div>
        <ScrollButton />
      </div>
    </>
  );
}

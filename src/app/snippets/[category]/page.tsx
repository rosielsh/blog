import { notFound } from "next/navigation";
import { CategoryFilter } from "@/components/snippets/CategoryFilter";
import { SnippetList } from "@/components/snippets/SnippetList";
import { getAllCategories, getSnippetsByCategory } from "@/lib/snippets";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();

  return categories.map((category) => ({
    category,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const category = resolvedParams.category;
  const categories = getAllCategories();

  if (!categories.includes(category)) {
    notFound();
  }

  const snippets = await getSnippetsByCategory(category);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">Snippets</h1>
      <CategoryFilter categories={categories} currentCategory={category} />
      <SnippetList snippets={snippets} />
    </div>
  );
}

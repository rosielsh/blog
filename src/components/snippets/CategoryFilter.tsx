"use client";

import Link from "next/link";

interface CategoryFilterProps {
  categories: string[];
  currentCategory: string;
}

export function CategoryFilter({
  categories,
  currentCategory,
}: CategoryFilterProps) {
  const formatCategoryName = (category: string) => {
    if (category === "all") return "전체";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/snippets/${category}`}
            className={`px-4 py-2 rounded-full text-sm ${
              currentCategory === category
                ? "bg-teal-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {formatCategoryName(category)}
          </Link>
        ))}
      </div>
    </div>
  );
}

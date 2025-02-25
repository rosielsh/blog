"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      <Link
        href={pathname}
        className={`px-3 py-2 rounded-md transition-colors duration-200
          ${
            !selectedCategory
              ? "bg-primary text-primary-foreground font-medium"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
      >
        전체
      </Link>

      {categories.map((category) => (
        <Link
          key={category}
          href={`${pathname}?category=${encodeURIComponent(category)}`}
          className={`px-3 py-2 rounded-md transition-colors duration-200
            ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}

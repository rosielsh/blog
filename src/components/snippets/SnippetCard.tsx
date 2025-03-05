"use client";

import Link from "next/link";
import { Tag } from "lucide-react";
import { Snippet } from "@/lib/snippets";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <Link
      href={`/snippets/${snippet.category}/${snippet.slug}`}
      className="flex items-center text-gray-600 hover:text-teal-600"
    >
      <div className="border dark:border-gray-700 rounded-lg overflow-hidden transition-shadow">
        <div className="p-5">
          <h3 className="text-xl font-bold mb-2 truncate dark:text-white">
            {snippet.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {snippet.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3 relative">
            <div className="flex items-center absolute right-3">
              <Tag size={14} className="mr-1" />
              <span>{snippet.category}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

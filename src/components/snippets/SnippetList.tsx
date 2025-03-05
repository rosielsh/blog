"use client";

import { useState, useMemo } from "react";
import { Tag, Search } from "lucide-react";
import { SnippetCard } from "./SnippetCard";
import { Snippet } from "@/lib/snippets";

interface SnippetListProps {
  snippets: Snippet[];
}

export function SnippetList({ snippets }: SnippetListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSnippets = useMemo(() => {
    if (!searchTerm) return snippets;

    return snippets.filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [snippets, searchTerm]);

  return (
    <div>
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="pl-10 w-full py-2 px-4 border dark:border-gray-700 rounded-lg dark:bg-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Tag size={20} />
        <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
          {filteredSnippets.length}개
        </span>
      </h2>

      {filteredSnippets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={`${snippet.category}-${snippet.title}`}
              snippet={snippet}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl font-medium">
            {searchTerm
              ? "검색 결과가 없습니다."
              : "이 카테고리에 스니펫이 없습니다."}
          </p>
          <p className="text-gray-500 mt-2">
            {searchTerm
              ? "다른 검색어로 시도해보세요."
              : "새 스니펫을 추가하거나 다른 카테고리를 선택하세요."}
          </p>
        </div>
      )}
    </div>
  );
}

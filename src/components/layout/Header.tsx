"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-black dark:border-gray-700">
      <div className="container mx-auto px-4 w-[90%] mx-auto sm:w-[90%] lg:w-[75%] xl:w-[60%]">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="text-xl font-bold dark:text-white italic">
            MERILOG<span className="text-teal-400 dark:text-teal-700">.</span>
          </Link>

          {/* 네비게이션 */}
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="/"
                  className="px-2 py-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:font-semibold
          dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  home
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="px-2 py-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:font-semibold
          dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  posts
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="px-2 py-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:font-semibold
          dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  snippets
                </Link>
              </li>
            </ul>
          </nav>

          {/* 다크모드 */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-gray-300 text-red-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 text-yellow-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

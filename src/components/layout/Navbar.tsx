// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";

export default function Navbar() {
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              내 기술 블로그
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <Link href="/blog" className="text-gray-700 hover:text-gray-900">
              블로그
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              소개
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

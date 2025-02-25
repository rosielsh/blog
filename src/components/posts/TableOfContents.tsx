"use client";

import { Heading } from "@/lib/toc";
import React, { useEffect, useState } from "react";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -40% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  const getIndentClass = (level: number) => {
    switch (level) {
      case 1:
        return "";
      case 2:
        return "ml-2";
      case 3:
        return "ml-4";
      default:
        return "";
    }
  };

  return (
    <nav className="toc ml-4 my-2">
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={getIndentClass(heading.level)}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block transition-colors hover:text-gray-600 pb-[2px] ${
                activeId === heading.id
                  ? "text-blue-600 font-medium"
                  : "text-gray-400"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

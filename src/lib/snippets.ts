import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrism from "rehype-prism-plus";
import React, { ReactElement } from "react";

type MDXContent = ReactElement | React.JSX.Element;

export interface Snippet {
  slug: string;
  filename: string;
  category: string;
  title: string;
  description: string;
  language: string;
  code: string;
  date: string;
  content: MDXContent;
}

interface SnippetFrontMatter {
  title: string;
  description: string;
  language: string;
  code: string;
  date?: string;
}

interface SnippetDataResult {
  frontMatter: SnippetFrontMatter & { date: string };
  content: MDXContent;
}

const snippetsDirectory = path.join(process.cwd(), "src/snippets");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAllCategories(): string[] {
  try {
    const categories = fs.readdirSync(snippetsDirectory).filter((directory) => {
      const stat = fs.statSync(path.join(snippetsDirectory, directory));
      return stat.isDirectory();
    });

    return ["all", ...categories];
  } catch (error) {
    console.log(error);
    return ["all"];
  }
}

export async function getAllSnippets(): Promise<Snippet[]> {
  const categories = getAllCategories().filter((cat) => cat !== "all");

  const snippets: Snippet[] = [];

  for (const category of categories) {
    const categoryPath = path.join(snippetsDirectory, category);

    try {
      if (!fs.existsSync(categoryPath)) {
        console.warn(`카테고리 디렉토리가 없습니다: ${categoryPath}`);
        continue;
      }

      const files = fs.readdirSync(categoryPath);

      for (const file of files) {
        if (file.endsWith(".mdx")) {
          const filename = file.replace(/\.mdx$/, "");
          const filePath = path.join(categoryPath, file);
          const fileContents = fs.readFileSync(filePath, "utf8");

          const { data: frontMatter } = matter(fileContents);
          const slug = slugify(frontMatter.title || filename);
          const { content } = await getSnippetData(category, filename);

          snippets.push({
            slug,
            filename,
            category,
            title: frontMatter.title,
            description: frontMatter.description,
            language: frontMatter.language,
            code: frontMatter.code,
            date: frontMatter.date
              ? new Date(frontMatter.date).toISOString()
              : new Date().toISOString(),
            content,
          });
        }
      }
    } catch (error) {
      console.error(
        `${category} 카테고리의 스니펫을 가져오는 중 오류 발생:`,
        error
      );
    }
  }

  return snippets.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getSnippetsByCategory(
  category: string
): Promise<Snippet[]> {
  if (category === "all") {
    return getAllSnippets();
  }

  const snippets: Snippet[] = [];
  const categoryPath = path.join(snippetsDirectory, category);

  try {
    if (!fs.existsSync(categoryPath)) {
      console.warn(`카테고리 디렉토리가 없습니다: ${categoryPath}`);
      return [];
    }

    const files = fs.readdirSync(categoryPath);

    for (const file of files) {
      if (file.endsWith(".mdx")) {
        const filename = file.replace(/\.mdx$/, "");
        const filePath = path.join(categoryPath, file);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data: frontMatter } = matter(fileContents);
        const slug = slugify(frontMatter.title || filename);
        const { content } = await getSnippetData(category, filename);

        snippets.push({
          slug,
          filename,
          category,
          title: frontMatter.title,
          description: frontMatter.description,
          language: frontMatter.language,
          code: frontMatter.code,
          date: frontMatter.date
            ? new Date(frontMatter.date).toISOString()
            : new Date().toISOString(),
          content,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }

  return snippets.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getSnippetData(
  category: string,
  filename: string
): Promise<SnippetDataResult> {
  const filePath = path.join(snippetsDirectory, category, `${filename}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`파일이 존재하지 않습니다: ${filePath}`);
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data: frontMatter, content: markdownContent } = matter(fileContents);
  const frontMatterData = frontMatter as SnippetFrontMatter;

  const { content } = await compileMDX({
    source: markdownContent,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypePrism],
      },
    },
  });

  return {
    frontMatter: {
      ...frontMatterData,
      date: frontMatter.date
        ? new Date(frontMatter.date).toISOString()
        : new Date().toISOString(),
    },
    content,
  };
}

export async function getSnippetBySlug(
  category: string,
  slug: string
): Promise<Snippet | null> {
  try {
    const allSnippets =
      category === "all"
        ? await getAllSnippets()
        : await getSnippetsByCategory(category);

    const snippet = allSnippets.find((s) => s.slug === slug);

    if (!snippet) {
      console.error(
        `슬러그와 일치하는 스니펫을 찾을 수 없습니다: ${category}/${slug}`
      );
      return null;
    }

    return snippet;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getSnippet(
  category: string,
  title: string
): Promise<Snippet | null> {
  try {
    const isSlug = title === slugify(title);

    if (isSlug) {
      return getSnippetBySlug(category, title);
    }

    try {
      const { frontMatter, content } = await getSnippetData(category, title);

      return {
        slug: slugify(frontMatter.title || title),
        filename: title,
        category,
        title: frontMatter.title,
        description: frontMatter.description,
        language: frontMatter.language,
        code: frontMatter.code,
        date: frontMatter.date,
        content,
      };
    } catch (error) {
      console.log(error);

      const slugifiedTitle = slugify(title);
      const allSnippets =
        category === "all"
          ? await getAllSnippets()
          : await getSnippetsByCategory(category);

      const snippet = allSnippets.find(
        (s) => s.slug === slugifiedTitle || slugify(s.title) === slugifiedTitle
      );

      if (!snippet) {
        console.error("error");
        return null;
      }

      return snippet;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

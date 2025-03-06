import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrism from "rehype-prism-plus";

export interface Snippet {
  slug: string;
  filename: string;
  category: string;
  title: string;
  description: string;
  language: string;
  code: string;
  date: string;
  content: any;
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
    console.error("카테고리 목록을 가져오는 중 오류 발생:", error);
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
    console.error(
      `${category} 카테고리의 스니펫을 가져오는 중 오류 발생:`,
      error
    );
  }

  return snippets.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getSnippetData(category: string, filename: string) {
  const filePath = path.join(snippetsDirectory, category, `${filename}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`파일이 존재하지 않습니다: ${filePath}`);
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data: frontMatter, content: markdownContent } = matter(fileContents);

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
      ...frontMatter,
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
    console.error(
      `스니펫을 가져오는 중 오류 발생 (${category}/${slug}):`,
      error
    );
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

    // 파일 이름을 그대로 사용해 시도
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
    } catch (directError) {
      console.log(
        `직접 파일 접근 실패, 슬러그화된 타이틀로 시도합니다: ${slugify(title)}`
      );

      // 타이틀을 슬러그화하여 시도
      const slugifiedTitle = slugify(title);

      // 모든 스니펫 중에서 슬러그나 제목이 일치하는 것을 찾기
      const allSnippets =
        category === "all"
          ? await getAllSnippets()
          : await getSnippetsByCategory(category);

      const snippet = allSnippets.find(
        (s) => s.slug === slugifiedTitle || slugify(s.title) === slugifiedTitle
      );

      if (!snippet) {
        console.error(
          `일치하는 스니펫을 찾을 수 없습니다: ${category}/${title}`
        );
        return null;
      }

      return snippet;
    }
  } catch (error) {
    console.error(
      `스니펫을 가져오는 중 오류 발생 (${category}/${title}):`,
      error
    );
    return null;
  }
}

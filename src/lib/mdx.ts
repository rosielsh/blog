import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/posts");

export interface PostMetadata {
  title: string;
  date: string;
  desc: string;
  thumbnail?: string;
  category: string;
  fullPath: string; // 파일의 전체 경로(카테고리/제목)
}

// 재귀적으로 디렉토리를 탐색하여 모든 MDX 파일을 찾는 함수
function getMdxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const files = entries.reduce<string[]>((acc, entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // 디렉토리인 경우 재귀적으로 탐색
      return [...acc, ...getMdxFiles(fullPath)];
    } else if (entry.name.endsWith(".mdx")) {
      return [...acc, fullPath];
    }

    return acc;
  }, []);

  return files;
}

// 모든 게시물의 메타데이터
export async function getAllPosts(): Promise<PostMetadata[]> {
  const mdxFiles = getMdxFiles(postsDirectory); // 모든 mdx 파일 경로를 배열로

  const posts = mdxFiles.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    const relativePath = path.relative(postsDirectory, filePath);
    const category = relativePath.split(path.sep)[0];
    const title = path.basename(filePath, ".mdx");
    const fullPath = relativePath.replace(".mdx", "");

    return {
      ...data,
      title,
      category,
      fullPath,
      date: new Date(data.date).toISOString(),
    } as PostMetadata;
  });

  // 날짜 기준 내림차순 정렬
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// 특정 카테고리의 게시물
export async function getPostsByCategory(
  category: string
): Promise<PostMetadata[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

// 모든 카테고리 목록
export async function getAllCategories(): Promise<string[]> {
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

// 게시물 상세 내용
export async function getPostByFullPath(fullPath: string) {
  const filePath = path.join(postsDirectory, `${fullPath}.mdx`); // 전체 파일 경로 - 카테고리/제목.mdx 포함
  const fileContents = fs.readFileSync(filePath, "utf8"); // 해당 파일에 있는 컨텐츠 내용

  // 글 관련 정보
  const { data, content } = matter(fileContents);
  const category = fullPath.split("/")[0];
  const title = path.basename(fullPath);

  return {
    metadata: {
      ...data,
      title,
      category,
      fullPath,
      date: new Date(data.date).toISOString(),
    } as PostMetadata,
    content,
  };
}

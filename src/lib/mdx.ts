import fs from "fs";
import path from "path";
import matter from "gray-matter";

// posts 디렉토리의 절대 경로
const postsDirectory = path.join(process.cwd(), "src/posts");

// 게시물 메타데이터 타입 정의를 확장하여 카테고리 정보 포함
export interface PostMetadata {
  title: string;
  date: string;
  desc: string;
  thumbnail?: string;
  slug: string;
  category: string;
  // 파일의 전체 경로를 저장 (예: 회고/2024-회고)
  fullPath: string;
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
      // MDX 파일인 경우 경로 추가
      return [...acc, fullPath];
    }

    return acc;
  }, []);

  return files;
}

// 모든 게시물의 메타데이터를 가져오는 함수
export async function getAllPosts(): Promise<PostMetadata[]> {
  const mdxFiles = getMdxFiles(postsDirectory);

  const posts = mdxFiles.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    // posts 디렉토리부터의 상대 경로 계산
    const relativePath = path.relative(postsDirectory, filePath);
    // 카테고리는 첫 번째 디렉토리명
    const category = relativePath.split(path.sep)[0];
    // slug는 파일명에서 .mdx 제거
    const slug = path.basename(filePath, ".mdx");
    // fullPath는 카테고리/파일명 형태
    const fullPath = relativePath.replace(".mdx", "");

    return {
      ...data,
      slug,
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

// 특정 카테고리의 게시물만 가져오는 함수
export async function getPostsByCategory(
  category: string
): Promise<PostMetadata[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

// 모든 카테고리 목록을 가져오는 함수
export async function getAllCategories(): Promise<string[]> {
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

// 특정 게시물의 상세 내용을 가져오는 함수
export async function getPostByFullPath(fullPath: string) {
  const filePath = path.join(postsDirectory, `${fullPath}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(fileContents);
  const category = fullPath.split("/")[0];
  const slug = path.basename(fullPath);

  return {
    metadata: {
      ...data,
      slug,
      category,
      fullPath,
      date: new Date(data.date).toISOString(),
    } as PostMetadata,
    content,
  };
}

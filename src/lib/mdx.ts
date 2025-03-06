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
  fullPath: string;
}

function getMdxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const files = entries.reduce<string[]>((acc, entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return [...acc, ...getMdxFiles(fullPath)];
    } else if (entry.name.endsWith(".mdx")) {
      return [...acc, fullPath];
    }

    return acc;
  }, []);

  return files;
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  const mdxFiles = getMdxFiles(postsDirectory);

  const posts = mdxFiles.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    const relativePath = path.relative(postsDirectory, filePath);
    const category = relativePath.split(path.sep)[0];
    const title = path.basename(filePath, ".mdx");
    const decodedTitle = decodeURIComponent(title);
    const fullPath = relativePath.replace(".mdx", "");

    return {
      ...data,
      title: decodedTitle,
      category,
      fullPath,
      date: new Date(data.date).toISOString(),
    } as PostMetadata;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostsByCategory(
  category: string
): Promise<PostMetadata[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

export async function getAllCategories(): Promise<string[]> {
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export async function getPostByFullPath(fullPath: string) {
  const decodedPath = decodeURIComponent(fullPath);
  const filePath = path.join(postsDirectory, `${decodedPath}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const category = decodedPath.split("/")[0];
  const title = decodeURIComponent(path.basename(decodedPath));

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

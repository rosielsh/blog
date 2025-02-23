// PostCard.tsx
import { PostMetadata } from "@/lib/mdx";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  post: PostMetadata;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.category}/${post.title}`} className="group">
      <article className="space-y-4 rounded-lg border p-4 transition-all hover:border-gray-400">
        {post.thumbnail && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-sm text-gray-600">{post.desc}</p>
          <time className="text-sm text-gray-500">
            {new Date(post.date).toLocaleDateString()}
          </time>
        </div>
      </article>
    </Link>
  );
}

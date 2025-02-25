import { PostMetadata } from "@/lib/mdx";
import { CalendarHeart, ChartColumnStacked } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  post: PostMetadata;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.category}/${post.title}`} className="group">
      <article className="space-y-4 rounded-lg border transition-all hover:border-gray-400">
        {post.thumbnail && (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <div className="space-y-2 p-5">
          <div className="flex justify-between items-center">
            <time className="text-sm flex items-center">
              <CalendarHeart size={15} height={20} color="gray" />
              <span className="ml-1">
                {new Date(post.date).toLocaleDateString()}
              </span>
            </time>

            <div className="text-sm flex items-center">
              <ChartColumnStacked size={15} height={20} color="gray" />
              <span className="ml-1 text-gray-500 dark:text-green-200">
                {post.category}
              </span>
            </div>
          </div>

          <div className="h-28">
            <h2 className="text-xl font-bold my-2 text-overflow">
              {post.title}
            </h2>
            <p className="text-sm text-gray-600 text-overflow">{post.desc}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}

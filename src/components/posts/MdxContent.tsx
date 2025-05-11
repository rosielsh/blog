import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import React, { ComponentProps } from "react";

type ImageProps = ComponentProps<typeof Image>;
type HTMLProps<T extends keyof React.JSX.IntrinsicElements> =
  React.JSX.IntrinsicElements[T];

interface CustomImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt?: string;
}

interface CustomLinkProps extends Omit<HTMLProps<"a">, "ref"> {
  href: string;
}

interface HeadingProps extends HTMLProps<"h1" | "h2" | "h3"> {
  children: React.ReactNode;
}

const components = {
  img: ({ src, alt = "blog image", ...props }: CustomImageProps) => (
    <div className="relative my-6 h-96 w-full">
      <Image
        className="rounded-lg object-cover"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={src}
        alt={alt}
        {...props}
      />
    </div>
  ),
  ImageRow: ({
    images,
  }: {
    images: { src: string; alt?: string; width?: string; height?: string }[];
  }) => (
    <div className="flex flex-wrap gap-2 my-6 overflow-x-auto">
      {images.map((img, idx) => (
        <div key={idx} className="relative">
          <Image
            className="rounded-lg"
            src={img.src}
            alt={img.alt || `Image ${idx + 1}`}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "auto", height: "auto", maxHeight: "440px" }}
          />
        </div>
      ))}
    </div>
  ),

  a: ({ href, children, ...props }: CustomLinkProps) => {
    const isInternalLink =
      href && (href.startsWith("/") || href.startsWith("#"));

    if (isInternalLink) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },

  h1: ({ children, ...props }: HeadingProps) => (
    <h1 className="relative mb-4 mt-8 text-2xl font-bold group" {...props}>
      <span className="absolute -left-5 hidden text-gray-400 group-hover:inline">
        #
      </span>
      {children}
    </h1>
  ),

  h2: ({ children, ...props }: HeadingProps) => (
    <h2 className="relative mb-4 mt-8 text-xl font-bold group" {...props}>
      <span className="absolute -left-4 hidden text-gray-400 group-hover:inline">
        #
      </span>
      {children}
    </h2>
  ),

  h3: ({ children, ...props }: HeadingProps) => (
    <h3 className="relative mb-4 mt-6 text-lg font-bold group" {...props}>
      <span className="absolute -left-4 hidden text-gray-400 group-hover:inline">
        #
      </span>
      {children}
    </h3>
  ),

  pre: ({ children, ...props }: HTMLProps<"pre">) => (
    <pre
      className="my-4 overflow-auto rounded-lg bg-gray-100 p-4 text-gray-600 text-sm dark:bg-gray-800 dark:text-gray-300"
      {...props}
    >
      {children}
    </pre>
  ),

  code: ({ children, ...props }: HTMLProps<"code">) => (
    <code
      className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800"
      {...props}
    >
      {children}
    </code>
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-slate prose-lg leading-loose max-w-none dark:prose-invert dark:text-gray-200">
      <MDXRemote source={source} components={components} />
    </div>
  );
}

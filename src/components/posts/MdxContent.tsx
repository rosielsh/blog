import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import React, { ComponentProps } from "react";
import { generateHeadingId } from "@/lib/toc";
import { CodeBlock } from "./CodeBlock";

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

  h1: ({ children, ...props }: HeadingProps) => {
    const text = typeof children === "string" ? children : "";
    const id = generateHeadingId(text);
    return (
      <h1
        id={id}
        className="relative mb-4 mt-8 text-2xl font-bold group"
        {...props}
      >
        <span className="absolute -left-5 hidden text-gray-400 group-hover:inline">
          #
        </span>
        {children}
      </h1>
    );
  },

  h2: ({ children, ...props }: HeadingProps) => {
    const text = typeof children === "string" ? children : "";
    const id = generateHeadingId(text);
    return (
      <h2
        id={id}
        className="relative mb-4 mt-8 text-xl font-bold group"
        {...props}
      >
        <span className="absolute -left-4 hidden text-gray-400 group-hover:inline">
          #
        </span>
        {children}
      </h2>
    );
  },

  h3: ({ children, ...props }: HeadingProps) => {
    const text = typeof children === "string" ? children : "";
    const id = generateHeadingId(text);
    return (
      <h3
        id={id}
        className="relative mb-4 mt-6 text-lg font-bold group"
        {...props}
      >
        <span className="absolute -left-4 hidden text-gray-400 group-hover:inline">
          #
        </span>
        {children}
      </h3>
    );
  },

  pre: ({ children, ...props }: HTMLProps<"pre">) => {
    // pre 태그 안에 code 태그가 있는 경우 (코드 블럭)
    if (React.isValidElement(children)) {
      const codeElement = children as React.ReactElement<HTMLProps<"code">>;
      const codeClassName = codeElement.props.className;

      // language- 클래스가 있으면 코드 블럭으로 처리
      if (codeClassName && codeClassName.includes("language-")) {
        return (
          <CodeBlock className={codeClassName} {...props}>
            {codeElement.props.children as string}
          </CodeBlock>
        );
      }
    }

    // 일반 pre 태그
    return (
      <pre
        className="my-4 overflow-auto rounded-lg bg-gray-100 p-4 text-gray-600 text-sm dark:bg-gray-800 dark:text-gray-300"
        {...props}
      >
        {children}
      </pre>
    );
  },

  code: ({ children, className, ...props }: HTMLProps<"code">) => {
    const isCodeBlock = className?.includes("language-");

    if (isCodeBlock) {
      // 코드 블럭은 pre 컴포넌트에서 처리됨
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    // 인라인 코드
    return (
      <code
        className="rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800 dark:text-gray-300"
        {...props}
      >
        {children}
      </code>
    );
  },
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-slate prose-lg leading-loose max-w-none dark:prose-invert dark:text-gray-200">
      <MDXRemote source={source} components={components} />
    </div>
  );
}

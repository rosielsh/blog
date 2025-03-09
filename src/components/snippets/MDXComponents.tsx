import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { ReactNode, ComponentPropsWithoutRef } from "react";
import { CodeBlock } from "./CodeBlock";

type CustomImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt?: string;
};

type CustomLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  href: string;
  children: ReactNode;
};

type CustomPreProps = {
  children: {
    props: {
      className?: string;
      children: string;
    };
  };
};

type HeadingProps = {
  children: ReactNode;
};

export const components = {
  img: ({ src, alt = "", ...props }: CustomImageProps) => (
    <div className="relative w-full aspect-video my-8 overflow-hidden rounded-lg">
      <Image src={src} alt={alt} fill className="object-cover" {...props} />
    </div>
  ),

  a: ({ href, children, ...props }: CustomLinkProps) => (
    <Link
      href={href}
      className="text-blue-500 hover:text-blue-600 underline"
      {...props}
    >
      {children}
    </Link>
  ),

  pre: ({ children }: CustomPreProps) => {
    const { props } = children;
    const language = props.className
      ? props.className.replace("language-", "")
      : "text";

    return <CodeBlock code={props.children} language={language} />;
  },

  h1: ({ children }: HeadingProps) => (
    <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }: HeadingProps) => (
    <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
  ),
  h3: ({ children }: HeadingProps) => (
    <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>
  ),
};

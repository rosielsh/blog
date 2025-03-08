import Image from "next/image";
import Link from "next/link";
import { CodeBlock } from "./CodeBlock";
import { ReactNode } from "react";

interface ImageProps
  extends Omit<React.ComponentProps<typeof Image>, "src" | "alt"> {
  src: string;
  alt?: string;
}

interface LinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href: string;
  children: ReactNode;
}

interface PreProps {
  children: {
    props: {
      className?: string;
      children: string;
    };
  };
}

interface HeadingProps {
  children: ReactNode;
}

export const components = {
  img: ({ src, alt, ...props }: ImageProps) => (
    <div className="relative w-full aspect-video my-8 overflow-hidden rounded-lg">
      <Image
        src={src}
        alt={alt || ""}
        fill
        className="object-cover"
        {...props}
      />
    </div>
  ),

  a: ({ href, children, ...props }: LinkProps) => (
    <Link
      href={href}
      className="text-blue-500 hover:text-blue-600 underline"
      {...props}
    >
      {children}
    </Link>
  ),

  pre: ({ children }: PreProps) => {
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

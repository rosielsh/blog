import Image from "next/image";
import Link from "next/link";
import { CodeBlock } from "./CodeBlock";

// MDX에서 사용할 사용자 정의 컴포넌트
export const components = {
  // 이미지 컴포넌트 커스터마이징
  img: ({ src, alt, ...props }: any) => (
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

  // 링크 컴포넌트 커스터마이징
  a: ({ href, children, ...props }: any) => (
    <Link
      href={href}
      className="text-blue-500 hover:text-blue-600 underline"
      {...props}
    >
      {children}
    </Link>
  ),

  // 코드 블록 커스터마이징
  pre: ({ children }: any) => {
    const { props } = children;

    // children의 props에서 className을 파싱하여 언어 추출
    const language = props.className
      ? props.className.replace("language-", "")
      : "text";

    return <CodeBlock code={props.children} language={language} />;
  },

  // 제목 컴포넌트 커스터마이징
  h1: ({ children }: any) => (
    <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>
  ),
};

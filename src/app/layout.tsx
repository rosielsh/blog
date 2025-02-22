import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "merri.dev",
  description: "개발 블로그 입니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* 나중에 Navbar 컴포넌트가 여기에 들어갈 것입니다 */}
          <main className="flex-grow">{children}</main>
          {/* 나중에 Footer 컴포넌트가 여기에 들어갈 것입니다 */}
        </div>
      </body>
    </html>
  );
}

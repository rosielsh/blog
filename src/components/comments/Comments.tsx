"use client";

import { useTheme } from "next-themes";
import Giscus from "@giscus/react";

export function Comments() {
  const { theme } = useTheme();

  return (
    <section className="mt-10 pt-8 border-t">
      <Giscus
        id="comments"
        repo="rosielsh/blog"
        repoId="R_kgDONq_4Zw"
        category="Announcements"
        categoryId="DIC_kwDONq_4Z84CnPsE"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme === "dark" ? "dark" : "light"}
        lang="ko"
        loading="lazy"
      />
    </section>
  );
}

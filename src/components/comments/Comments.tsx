"use client";

import { useTheme } from "next-themes";
import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

export function Comments() {
  const { theme } = useTheme();
  const [term, setTerm] = useState("");

  useEffect(() => {
    const path = window.location.pathname;
    const decodedPath = decodeURIComponent(path);
    setTerm(decodedPath);
  }, []);

  if (!term) return null;

  return (
    <section className="mt-10 pt-8 border-t">
      <Giscus
        id="comments"
        repo="rosielsh/blog"
        repoId="R_kgDONq_4Zw"
        category="Announcements"
        categoryId="DIC_kwDONq_4Z84CnPsE"
        mapping="specific"
        term={term}
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

"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function Comments() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-8 border-t border-[var(--border)] pt-8">
      <Giscus
        repo="tkcho/tkcho-blog"
        repoId=""
        category="Blog Comments"
        categoryId=""
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang="ja"
      />
    </div>
  );
}

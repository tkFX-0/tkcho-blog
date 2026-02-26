"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function Comments() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-8 border-t border-[var(--border)] pt-8">
      <Giscus
        repo="tkFX-0/tkcho-blog"
        repoId="R_kgDORZv7Aw"
        category="General"
        categoryId="DIC_kwDORZv7A84C3R0v"
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

"use client";

import { useState } from "react";

interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

function TocItems({ items, depth = 0 }: { items: TocEntry[]; depth?: number }) {
  return (
    <ol style={{ paddingLeft: depth > 0 ? "1.2em" : undefined }}>
      {items.map((item) => (
        <li key={item.url}>
          <a href={item.url}>{item.title}</a>
          {item.items.length > 0 && (
            <TocItems items={item.items} depth={depth + 1} />
          )}
        </li>
      ))}
    </ol>
  );
}

export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (toc.length === 0) return null;

  return (
    <div className="toc">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="toc-header w-full"
      >
        <span>目次</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="toc-body">
          <TocItems items={toc} />
        </div>
      )}
    </div>
  );
}

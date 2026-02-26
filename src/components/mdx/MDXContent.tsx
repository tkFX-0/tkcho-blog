"use client";

import * as runtime from "react/jsx-runtime";
import type { ComponentType } from "react";

interface MDXComponentProps {
  components?: Record<string, ComponentType>;
}

function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default as ComponentType<MDXComponentProps>;
}

interface MDXContentProps {
  code: string;
  components?: Record<string, ComponentType>;
}

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}

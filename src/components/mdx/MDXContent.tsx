"use client";

import * as runtime from "react/jsx-runtime";
import type { ComponentType, ReactNode } from "react";

interface MDXComponentProps {
  components?: Record<string, ComponentType>;
}

function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default as ComponentType<MDXComponentProps>;
}

function ScrollableTable(props: { children?: ReactNode }) {
  return <div className="table-scroll">{props.children}</div>;
}

function TableWrapper(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <ScrollableTable>
      <table {...props} />
    </ScrollableTable>
  );
}

const defaultComponents: Record<string, ComponentType> = {
  table: TableWrapper as ComponentType,
};

interface MDXContentProps {
  code: string;
  components?: Record<string, ComponentType>;
}

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return <Component components={{ ...defaultComponents, ...components }} />;
}

import type { ReactNode, ComponentType } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";
import { PostFrontmatter } from "@/lib/writing";

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark-dimmed",
  keepBackground: false,
};

export async function compileMdxContent(
  content: string,
  frontmatter: PostFrontmatter,
  components?: Record<string, ComponentType<Record<string, unknown>>>
) {
  const result = await compileMDX({
    source: content,
    components,
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
      },
    },
  });

  return result;
}

export const mdxComponents = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="mb-6 mt-10">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3>{children}</h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="whitespace-pre-wrap">{children}</p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-inside list-disc">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-inside list-decimal">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote>{children}</blockquote>
  ),
  a: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  hr: () => <hr />,
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong>{children}</strong>
  ),
};
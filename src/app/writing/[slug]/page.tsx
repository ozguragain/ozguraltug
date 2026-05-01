import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMdxContent, mdxComponents } from "@/components/writing/mdx-components";
import { getPostBySlug, getAllSlugs } from "@/lib/writing";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { content, frontmatter } = post;
  const { content: mdxContent } = await compileMdxContent(content, frontmatter, mdxComponents as any);

  return (
    <Section inset="lg">
      <Container size="content">
        <div className="mx-auto w-full max-w-[var(--max-width-frame)]">
          <div className="enter-rise space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Link
                  href="/writing"
                  className="pressable font-mono text-[0.82rem] font-bold text-text-muted text-gray-700 dark:text-gray-400 transition-[color,transform] duration-200 ease-out hover:text-text"
                >
                  ← back
                </Link>
                <span className="font-mono text-[0.72rem] text-text-muted/40 text-gray-700 dark:text-gray-400">
                  |
                </span>
                <span className="font-mono text-[0.82rem] font-bold text-text-muted text-gray-700 dark:text-gray-400">
                  oz@writing:~$
                </span>
              </div>

              <h1 className="type-display">{frontmatter.title}</h1>

              <div className="flex items-center gap-3 font-mono text-[0.82rem] text-text-muted text-gray-700 dark:text-gray-400">
                <time dateTime={frontmatter.date}>
                  {formatDate(frontmatter.date)}
                </time>
              </div>
            </div>

            <div className="shadow-[inset_0_1px_0_0_hsl(var(--color-border)/0.6)] pt-8">
              <article className="prose-content text-gray-700 dark:text-gray-400">{mdxContent}</article>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
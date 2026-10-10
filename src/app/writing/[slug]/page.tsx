import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { renderPost } from "@/lib/render";
import { getAllSlugs, getPostBySlug } from "@/lib/writing";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { formatDate } from "@/lib/format";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

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

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { markdown, frontmatter } = post;
  const html = await renderPost(markdown);

  return (
    <Section inset="lg">
      <Container size="prose">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link
                href="/writing"
                className="inline-flex min-h-11 items-center text-[0.82rem] font-medium text-text-muted transition-colors duration-fast ease-out hover:text-text"
              >
                ← All writing
              </Link>
            </div>

            <h1 className="type-display">{frontmatter.title}</h1>

            <div className="flex items-center gap-3 font-mono text-[0.82rem] tabular-nums text-text-muted">
              <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
            </div>
          </div>

            <div className="border-t border-border/10 pt-8">
              <article className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
      </Container>
    </Section>
  );
}

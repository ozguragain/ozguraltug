import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMdxContent, mdxComponents } from "@/components/writing/mdx-components";
import { getAllSlugs, getPostBySlug } from "@/lib/writing";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";

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

function formatDate(dateString: string): string {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("en-US", {
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
        <div className="mx-auto w-full max-w-[var(--max-width-prose)]">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Link
                  href="/writing"
                  className="text-[0.82rem] font-medium text-text-muted transition-colors duration-200 ease-out hover:text-text"
                >
                  ← All writing
                </Link>
              </div>

              <h1 className="type-display">{frontmatter.title}</h1>

              <div className="flex items-center gap-3 text-[0.82rem] text-text-muted">
                <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
              </div>
            </div>

            <div className="shadow-[inset_0_1px_0_0_hsl(var(--color-border)/0.6)] pt-8">
              <article className="prose-content">{mdxContent}</article>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

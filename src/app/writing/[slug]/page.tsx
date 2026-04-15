import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { compileMdxContent, mdxComponents } from "@/components/writing/mdx-components";
import { getPostBySlug, getAllSlugs } from "@/lib/writing";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
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
  const { content: mdxContent } = await compileMdxContent(content, frontmatter);

  return (
    <Section inset="lg">
      <Container size="content">
        <div className="mx-auto w-full max-w-[var(--max-width-frame)]">
          <div className="enter-rise space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Link
                  href="/writing"
                  className="font-mono text-[0.82rem] font-bold text-text-muted transition-colors hover:text-text"
                >
                  ← back
                </Link>
                <span className="font-mono text-[0.72rem] text-text-muted/40">
                  |
                </span>
                <span className="font-mono text-[0.82rem] font-bold text-text-muted">
                  oz@writing:~$
                </span>
              </div>

              <h1 className="type-display">{frontmatter.title}</h1>

              <div className="flex items-center gap-3 font-mono text-[0.82rem] text-text-muted">
                <time dateTime={frontmatter.date}>
                  {formatDate(frontmatter.date)}
                </time>
              </div>
            </div>

            <div className="border-t border-border/60 pt-8">
              <article className="prose-content">{mdxContent}</article>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
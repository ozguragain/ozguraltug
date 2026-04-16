import { cookies } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PostCard } from "@/components/writing/post-card";
import { getSortedPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Technical writing on software engineering, systems, and developer tooling.",
};

export default async function WritingPage() {
  const posts = getSortedPosts();
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has("editor_auth");

  return (
    <Section inset="lg">
      <Container size="content">
        <div className="mx-auto w-full max-w-[var(--max-width-frame)]">
          <div className="enter-rise space-y-8">
            <div className="space-y-2">
              <p className="font-mono text-[0.82rem] font-bold text-text-muted">
                oz@writing:~$
              </p>
              <h1 className="type-display">Writing</h1>
              <p className="font-mono text-[0.92rem] font-bold text-text-muted sm:text-[0.96rem]">
                Technical notes on software engineering and beyond.
              </p>
              {isAuthenticated && (
                <Link
                  href="/writing/new"
                  className="inline-block rounded border border-border/60 px-3 py-1.5 font-mono text-[0.78rem] font-bold text-text-muted transition-colors hover:border-text-muted hover:text-text"
                >
                  + new post
                </Link>
              )}
            </div>

            <div className="border-t border-border/60 pt-6">
              {posts.length === 0 ? (
                <div className="space-y-2 py-8">
                  <p className="font-mono text-[0.88rem] font-bold text-text-muted">
                    no posts found
                  </p>
                  <p className="font-mono text-[0.82rem] font-bold text-text-muted/60">
                    check back later
                  </p>
                </div>
              ) : (
                <>
                  <div className="border-b border-border/40 pb-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-mono text-[0.72rem] uppercase tracking-wider text-text-muted/60">
                        title
                      </span>
                      <span className="shrink-0 font-mono text-[0.72rem] uppercase tracking-wider text-text-muted/60">
                        date
                      </span>
                    </div>
                  </div>
                  <div className="py-2">
                    {posts.map((post) => (
                      <PostCard key={post.slug} post={post} showEditLink={isAuthenticated} />
                    ))}
                  </div>
                  <div className="border-t border-border/40 pt-4">
                    <p className="font-mono text-[0.78rem] font-bold text-text-muted">
                      {posts.length} {posts.length === 1 ? "post" : "posts"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
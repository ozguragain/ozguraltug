import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PostCard } from "@/components/writing/post-card";
import { getSortedPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Technical writing on software engineering, systems, and developer tooling.",
};

export default function WritingPage() {
  const posts = getSortedPosts();

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
                      <PostCard key={post.slug} post={post} />
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
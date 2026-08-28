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
        <div className="mx-auto w-full max-w-[var(--max-width-prose)]">
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="type-display">Writing</h1>
              <p className=" text-[0.92rem] text-text-muted sm:text-[0.96rem]">
                Technical notes on software engineering and beyond.
              </p>
            </div>

            <div className="shadow-[inset_0_1px_0_0_hsl(var(--color-border)/0.6)] pt-6">
              {posts.length === 0 ? (
                <div className="space-y-2 py-8">
                  <p className=" text-[0.88rem] text-text-muted">no posts found</p>
                  <p className=" text-[0.82rem] text-text-muted/60">check back later</p>
                </div>
              ) : (
                <>
                  <div className="shadow-[inset_0_-1px_0_0_hsl(var(--color-border)/0.4)] pb-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className=" text-[0.72rem] uppercase tracking-wider text-text-muted/60">
                        title
                      </span>
                      <span className="shrink-0 text-[0.72rem] uppercase tracking-wider text-text-muted/60">
                        date
                      </span>
                    </div>
                  </div>
                  <div className="py-2">
                    {posts.map((post) => (
                      <div key={post.slug}>
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                  <div className="shadow-[inset_0_1px_0_0_hsl(var(--color-border)/0.4)] pt-4">
                    <p className=" text-[0.78rem] text-text-muted">
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

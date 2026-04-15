import Link from "next/link";
import type { Post } from "@/lib/writing";

type PostCardProps = {
  post: Post;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ post }: PostCardProps) {
  const { slug, frontmatter } = post;

  return (
    <article className="group">
      <Link
        href={`/writing/${slug}`}
        className="flex items-baseline justify-between gap-4 py-2.5 transition-opacity duration-200 hover:opacity-70"
      >
        <span className="font-mono text-[0.92rem] font-bold tracking-[-0.02em] text-text/72 sm:text-[0.96rem]">
          {frontmatter.title}
        </span>
        <span className="shrink-0 font-mono text-[0.78rem] text-text-muted sm:text-[0.82rem]">
          {formatDate(frontmatter.date)}
        </span>
      </Link>
    </article>
  );
}
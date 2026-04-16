import Link from "next/link";
import type { Post } from "@/lib/writing";

type PostCardProps = {
  post: Post;
  showEditLink?: boolean;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ post, showEditLink }: PostCardProps) {
  const { slug, frontmatter } = post;

  return (
    <article className="group">
      <div className="flex items-baseline justify-between gap-4 py-2.5">
        <Link
          href={`/writing/${slug}`}
          className="flex-1 transition-opacity duration-200 hover:opacity-70"
        >
          <span className="font-mono text-[0.92rem] font-bold tracking-[-0.02em] text-text/72 sm:text-[0.96rem]">
            {frontmatter.title}
          </span>
          <span className="ml-3 shrink-0 font-mono text-[0.78rem] text-text-muted sm:text-[0.82rem]">
            {formatDate(frontmatter.date)}
          </span>
        </Link>
        {showEditLink && (
          <Link
            href={`/writing/edit/${slug}`}
            className="shrink-0 rounded border border-border/60 px-2 py-1 font-mono text-[0.72rem] font-bold text-text-muted transition-colors hover:border-text-muted hover:text-text"
          >
            edit
          </Link>
        )}
      </div>
    </article>
  );
}
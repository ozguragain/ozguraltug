import Link from "next/link";
import type { Post } from "@/lib/writing";
import { formatDate } from "@/lib/format";

export function PostCard({ post }: { post: Post }) {
  const { slug, frontmatter } = post;

  return (
    <article className="group">
      <div className="flex items-start justify-between gap-4 py-2.5">
        <Link
          href={`/writing/${slug}`}
          className="group flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1 min-h-[44px] py-2 -my-2 transition-[color,transform] duration-fast ease-out active:scale-[0.98] active:duration-instant hover:text-text"
        >
          <h2 className="text-[0.92rem] font-medium tracking-[-0.02em] text-text text-wrap-balance sm:text-[0.96rem]">
            {frontmatter.title}
          </h2>
          <span
            aria-hidden="true"
            className="hidden flex-1 self-center border-t border-dashed border-border/15 sm:block"
          />
          <time
            dateTime={frontmatter.date}
            className="shrink-0 font-mono text-[0.8125rem] tabular-nums tracking-[-0.01em] text-text-muted transition-colors group-hover:text-text"
          >
            {formatDate(frontmatter.date)}
          </time>
          <span
            aria-hidden="true"
            className="inline-flex -translate-x-1.5 opacity-0 transition-[transform,opacity] duration-fast ease-out group-hover:translate-x-0 group-hover:opacity-100"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

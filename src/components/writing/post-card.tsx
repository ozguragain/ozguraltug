import Link from "next/link";
import type { Post } from "@/lib/writing";

function formatDate(dateString: string): string {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ post }: { post: Post }) {
  const { slug, frontmatter } = post;

  return (
    <article className="group">
      <div className="flex items-baseline justify-between gap-4 py-2.5">
        <Link
          href={`/writing/${slug}`}
          className="pressable flex-1 transition-[color,transform] duration-250 ease-out hover:text-text"
        >
          <span className=" text-[0.92rem] font-semibold text-text/80 sm:text-[0.96rem]">
            {frontmatter.title}
          </span>
          <span className="ml-3 shrink-0 text-[0.78rem] text-text-muted sm:text-[0.82rem]">
            {formatDate(frontmatter.date)}
          </span>
        </Link>
      </div>
    </article>
  );
}

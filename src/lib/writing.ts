import fs from "fs";
import path from "path";
import { parseFrontmatter, readFrontmatter } from "mdp";

const CONTENT_DIR = path.join(process.cwd(), "src/content/writing");

export type PostFrontmatter = {
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
};

export type PostWithContent = Post & {
  markdown: string;
};

function getPostFileNames(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }
  return fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".md"));
}

function resolveFilePath(slug: string): string | null {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  return fs.existsSync(file) ? file : null;
}

function toTimestamp(dateString: string): number {
  const t = Date.parse(dateString);
  return Number.isNaN(t) ? 0 : t;
}

function frontmatterOf(source: string): PostFrontmatter {
  return parseFrontmatter(readFrontmatter(source)) as unknown as PostFrontmatter;
}

function parsePost(slug: string): PostWithContent | null {
  const fullPath = resolveFilePath(slug);
  if (!fullPath) return null;
  const source = fs.readFileSync(fullPath, "utf8");
  return {
    slug,
    frontmatter: frontmatterOf(source),
    markdown: source,
  };
}

export function getSortedPosts(): Post[] {
  const posts: Post[] = getPostFileNames().map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const source = fs.readFileSync(path.join(CONTENT_DIR, fileName), "utf8");
    return { slug, frontmatter: frontmatterOf(source) };
  });

  return posts.sort((a, b) => toTimestamp(b.frontmatter.date) - toTimestamp(a.frontmatter.date));
}

export function getPostBySlug(slug: string): PostWithContent | null {
  try {
    return parsePost(slug);
  } catch {
    return null;
  }
}

export function getAllSlugs(): string[] {
  return getPostFileNames().map((name) => name.replace(/\.md$/, ""));
}

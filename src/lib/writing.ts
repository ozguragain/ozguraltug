import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
  content: string;
};

function getPostFileNames(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
}

function resolveFilePath(slug: string): string | null {
  const md = path.join(CONTENT_DIR, `${slug}.md`);
  const mdx = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (fs.existsSync(md)) return md;
  if (fs.existsSync(mdx)) return mdx;
  return null;
}

function toTimestamp(dateString: string): number {
  const t = Date.parse(dateString);
  return Number.isNaN(t) ? 0 : t;
}

function parsePost(slug: string): PostWithContent | null {
  const fullPath = resolveFilePath(slug);
  if (!fullPath) return null;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
  };
}

export function getSortedPosts(): Post[] {
  const fileNames = getPostFileNames();
  const posts: Post[] = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx?$/, "");
    const fullPath = path.join(CONTENT_DIR, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    return {
      slug,
      frontmatter: data as PostFrontmatter,
    };
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
  return getPostFileNames().map((name) => name.replace(/\.mdx?$/, ""));
}

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

function getPostSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
}

function parsePost(slug: string): PostWithContent {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
  };
}

export function getSortedPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs.map((fileName) => {
    const slug = fileName.replace(/\.mdx?$/, "");
    const fullPath = path.join(CONTENT_DIR, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      frontmatter: data as PostFrontmatter,
    };
  });

  return posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date);
    const dateB = new Date(b.frontmatter.date);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getPostBySlug(slug: string): PostWithContent | null {
  try {
    return parsePost(slug);
  } catch {
    return null;
  }
}

export function getAllSlugs(): string[] {
  return getPostSlugs().map((slug) => slug.replace(/\.mdx?$/, ""));
}
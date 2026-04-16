import { NextRequest, NextResponse } from "next/server";
import { getFileContent, createGitHubConfig } from "@/lib/github";
import matter from "gray-matter";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const config = createGitHubConfig();
    const filename = `${slug}.mdx`;
    const content = await getFileContent(config, `writing/${filename}`);

    if (!content) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const { data, content: body } = matter(content);

    return NextResponse.json({
      slug,
      frontmatter: data,
      content: body,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch post" },
      { status: 500 }
    );
  }
}

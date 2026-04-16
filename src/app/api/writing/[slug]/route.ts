import { NextRequest, NextResponse } from "next/server";
import { getFileContent, deleteFile, createGitHubConfig } from "@/lib/github";
import { revalidatePath } from "next/cache";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src/content/writing");

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
    const content = await getFileContent(config, filename);

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

export async function DELETE(
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
    await deleteFile(config, `${slug}.mdx`, `Delete post: ${slug}`);

    const localPath = path.join(CONTENT_DIR, `${slug}.mdx`);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    revalidatePath("/writing");
    revalidatePath(`/writing/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete post" },
      { status: 500 }
    );
  }
}

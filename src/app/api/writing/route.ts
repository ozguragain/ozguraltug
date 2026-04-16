import { NextRequest, NextResponse } from "next/server";
import { createOrUpdateFile, createGitHubConfig } from "@/lib/github";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, frontmatter, content } = body;

    if (!slug || !content) {
      return NextResponse.json(
        { error: "Missing required fields: slug, content" },
        { status: 400 }
      );
    }

    const frontmatterStr = `---
title: "${frontmatter.title || ""}"
date: "${frontmatter.date || new Date().toISOString().split("T")[0]}"
excerpt: "${frontmatter.excerpt || ""}"
tags: ${JSON.stringify(frontmatter.tags || [])}
---

${content}`;

    const config = createGitHubConfig();
    const filename = `${slug}.mdx`;

    await createOrUpdateFile(
      config,
      {
        path: filename,
        content: frontmatterStr,
      },
      `chore: ${frontmatter.title ? `Update "${frontmatter.title}"` : `Create "${slug}"`} post via editor`
    );

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save post" },
      { status: 500 }
    );
  }
}

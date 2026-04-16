import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorShell } from "@/components/editor/editor-shell";
import { Editor } from "@/components/writing/editor";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Edit: ${slug}`,
    description: `Edit post: ${slug}`,
  };
}

export default async function EditPostPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/writing/${slug}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error("Failed to fetch post");
    }

    const data = await response.json();

    return (
      <EditorShell>
        <Editor
          initialSlug={slug}
          initialFrontmatter={data.frontmatter}
          initialContent={data.content}
        />
      </EditorShell>
    );
  } catch {
    notFound();
  }
}
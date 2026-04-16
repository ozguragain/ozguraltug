"use client";

import { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { compileMdxContent, mdxComponents } from "@/components/writing/mdx-components";

type Frontmatter = {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
};

type EditorProps = {
  initialSlug?: string;
  initialFrontmatter?: Frontmatter;
  initialContent?: string;
};

export function Editor({
  initialSlug = "",
  initialFrontmatter,
  initialContent = "",
}: EditorProps) {
  const [slug, setSlug] = useState(initialSlug);
  const [frontmatter, setFrontmatter] = useState<Frontmatter>({
    title: initialFrontmatter?.title || "",
    date:
      initialFrontmatter?.date ||
      new Date().toISOString().split("T")[0],
    excerpt: initialFrontmatter?.excerpt || "",
    tags: initialFrontmatter?.tags || [],
  });
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState<React.ReactNode>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }, []);

  const handleTitleChange = (value: string) => {
    setFrontmatter((prev) => ({ ...prev, title: value }));
    if (!slug || slug === generateSlug(frontmatter.title)) {
      setSlug(generateSlug(value));
    }
  };

  const updatePreview = useCallback(async () => {
    if (!content) {
      setPreview(null);
      return;
    }
    setIsLoading(true);
    try {
      const result = await compileMdxContent(content, frontmatter, mdxComponents as any);
      setPreview(result.content);
    } catch {
      setPreview(
        <p className="text-red-500">Error rendering preview</p>
      );
    }
    setIsLoading(false);
  }, [content, frontmatter]);

  const handleSave = async () => {
    if (!slug) {
      setMessage({ type: "error", text: "Slug is required" });
      return;
    }
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, frontmatter, content }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }
      setMessage({ type: "success", text: "Post saved successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save post",
      });
    }
    setIsSaving(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={frontmatter.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title..."
            className="bg-transparent font-mono text-[0.92rem] font-bold text-text/72 placeholder:text-text-muted focus:outline-none sm:text-[0.96rem]"
          />
          <span className="font-mono text-[0.78rem] text-text-muted">
            {slug && `${slug}.mdx`}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={updatePreview}
            disabled={isLoading}
            className="rounded border border-border/60 px-3 py-1.5 font-mono text-[0.78rem] font-bold text-text-muted transition-colors hover:border-text-muted hover:text-text disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !slug}
            className="rounded bg-text px-3 py-1.5 font-mono text-[0.78rem] font-bold text-bg transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`rounded px-3 py-2 font-mono text-[0.82rem] ${
            message.type === "success"
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-mono text-[0.72rem] uppercase tracking-wider text-text-muted">
                  Date
                </label>
                <input
                  type="date"
                  value={frontmatter.date}
                  onChange={(e) =>
                    setFrontmatter((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded border border-border/60 bg-transparent px-2 py-1 font-mono text-[0.82rem] text-text focus:border-text-muted focus:outline-none"
                />
              </div>
              <div>
                <label className="font-mono text-[0.72rem] uppercase tracking-wider text-text-muted">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={frontmatter.tags.join(", ")}
                  onChange={(e) =>
                    setFrontmatter((prev) => ({
                      ...prev,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="go, cli, tools"
                  className="mt-1 w-full rounded border border-border/60 bg-transparent px-2 py-1 font-mono text-[0.82rem] text-text placeholder:text-text-muted focus:border-text-muted focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="font-mono text-[0.72rem] uppercase tracking-wider text-text-muted">
                Excerpt
              </label>
              <input
                type="text"
                value={frontmatter.excerpt}
                onChange={(e) =>
                  setFrontmatter((prev) => ({
                    ...prev,
                    excerpt: e.target.value,
                  }))
                }
                placeholder="Brief description of the post..."
                className="mt-1 w-full rounded border border-border/60 bg-transparent px-2 py-1 font-mono text-[0.82rem] text-text placeholder:text-text-muted focus:border-text-muted focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-[0.72rem] uppercase tracking-wider text-text-muted">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="post-url-slug"
                className="mt-1 w-full rounded border border-border/60 bg-transparent px-2 py-1 font-mono text-[0.82rem] text-text placeholder:text-text-muted focus:border-text-muted focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded border border-border/60">
            <CodeMirror
              value={content}
              onChange={(value) => setContent(value)}
              extensions={[markdown()]}
              className="h-[calc(100%-8rem)] overflow-auto"
              basicSetup={{
                lineNumbers: false,
                foldGutter: false,
                highlightActiveLine: false,
              }}
              theme="dark"
              placeholder="Write your post in Markdown..."
            />
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded border border-border/60">
          <div className="border-b border-border/60 bg-bg px-3 py-2">
            <span className="font-mono text-[0.72rem] uppercase tracking-wider text-text-muted">
              Preview
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {preview ? (
              <article className="prose-content">{preview}</article>
            ) : (
              <p className="font-mono text-[0.82rem] text-text-muted">
                Click &quot;Preview&quot; to see your post
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

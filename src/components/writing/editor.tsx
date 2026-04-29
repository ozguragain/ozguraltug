"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { indentWithTab } from "@codemirror/commands";
import { EditorView, keymap } from "@codemirror/view";
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

type ToolbarAction = {
  label: string;
  icon: React.ReactNode;
  shortcut: string;
  insert: (value: string, selection: { from: number; to: number }) => { value: string; cursorOffset: number };
};

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    label: "Bold",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      </svg>
    ),
    shortcut: "⌘B",
    insert: (value, sel) => {
      const selected = value.slice(sel.from, sel.to);
      const wrapped = `**${selected || "bold text"}**`;
      return { value: wrapped, cursorOffset: selected ? 0 : -2 };
    },
  },
  {
    label: "Italic",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="4" x2="10" y2="4" />
        <line x1="14" y1="20" x2="5" y2="20" />
        <line x1="15" y1="4" x2="9" y2="20" />
      </svg>
    ),
    shortcut: "⌘I",
    insert: (value, sel) => {
      const selected = value.slice(sel.from, sel.to);
      const wrapped = `*${selected || "italic text"}*`;
      return { value: wrapped, cursorOffset: selected ? 0 : -1 };
    },
  },
  {
    label: "Heading",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h8" />
        <path d="M4 18V6" />
        <path d="M12 18V6" />
        <path d="M17 12l3-2v8" />
      </svg>
    ),
    shortcut: "⌘H",
    insert: (value, sel) => {
      const lineStart = value.lastIndexOf("\n", sel.from - 1) + 1;
      const prefix = value.slice(lineStart, lineStart + 2);
      const level = prefix.startsWith("##") ? "" : "## ";
      const insertText = level + (value.slice(sel.from, sel.to) || "Heading");
      return { value: insertText, cursorOffset: 0 };
    },
  },
  {
    label: "Link",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    shortcut: "⌘K",
    insert: (value, sel) => {
      const selected = value.slice(sel.from, sel.to);
      const wrapped = `[${selected || "text"}](url)`;
      return { value: wrapped, cursorOffset: selected ? -5 : -5 };
    },
  },
  {
    label: "Code",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16,18 22,12 16,6" />
        <polyline points="8,6 2,12 8,18" />
      </svg>
    ),
    shortcut: "⌘E",
    insert: (value, sel) => {
      const selected = value.slice(sel.from, sel.to);
      const wrapped = `\`${selected || "code"}\``;
      return { value: wrapped, cursorOffset: selected ? 0 : -1 };
    },
  },
  {
    label: "List",
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="6" x2="20" y2="6" />
        <line x1="9" y1="12" x2="20" y2="12" />
        <line x1="9" y1="18" x2="20" y2="18" />
        <circle cx="5" cy="6" r="1" fill="currentColor" />
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="5" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
    shortcut: "",
    insert: (value, sel) => {
      const selected = value.slice(sel.from, sel.to);
      const lines = selected ? selected.split("\n") : ["List item"];
      const wrapped = lines.map((l) => `- ${l}`).join("\n");
      return { value: wrapped, cursorOffset: 0 };
    },
  },
];

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

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
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const router = useRouter();
  const editorRef = useRef<any>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const autoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setHasUnsavedChanges(true);
    saveTimeoutRef.current = setTimeout(() => {
      if (content && slug) {
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
      }
    }, 3000);
  }, [content, slug]);

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
    autoSave();
  }, [autoSave]);

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
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      setMessage({ type: "success", text: "Post saved successfully!" });
      router.push(`/writing/${slug}`);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save post",
      });
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!slug) return;
    if (!window.confirm(`Are you sure you want to delete "${frontmatter.title}"?`)) {
      return;
    }
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/writing/${slug}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete");
      }
      window.location.href = "/writing";
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete post",
      });
      setIsSaving(false);
    }
  };

  const insertMarkdown = useCallback((action: ToolbarAction) => {
    const editor = editorRef.current;
    if (!editor) return;
    const view = editor.view;
    if (!view) return;
    const { from, to } = view.state.selection.main;
    const currentValue = view.state.doc.toString();
    const { value: newText, cursorOffset } = action.insert(currentValue, { from, to });
    view.dispatch({
      changes: { from, to, insert: newText },
      selection: { anchor: from + newText.length + cursorOffset },
    });
    view.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        const keyMap: Record<string, number> = { b: 0, i: 1, k: 3, e: 4 };
        const actionIndex = keyMap[e.key.toLowerCase()];
        if (actionIndex !== undefined) {
          e.preventDefault();
          insertMarkdown(TOOLBAR_ACTIONS[actionIndex]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [insertMarkdown]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const wordCount = countWords(content);
  const charCount = content.length;
  const lineCount = content ? content.split("\n").length : 0;

  return (
    <div className="mx-auto h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-[calc(100vh-8rem)] flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between rounded-xl bg-bg/60 px-5 py-3.5 shadow-[0_0_0_1px_hsl(var(--color-border)/0.08),0_2px_4px_hsl(var(--color-border)/0.06),0_8px_24px_-8px_hsl(var(--color-border)/0.1)]">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={frontmatter.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title..."
              className="min-h-[40px] bg-transparent font-mono text-[0.92rem] font-bold text-text/72 placeholder:text-text-muted/60 transition-colors duration-150 ease-out focus:outline-none sm:text-[0.96rem]"
            />
            {slug && (
              <span className="rounded-md bg-bg-muted/50 px-2.5 py-1 font-mono text-[0.7rem] text-text-muted/70">
                {slug}.mdx
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Save status indicator */}
            {hasUnsavedChanges && (
              <span className="flex items-center gap-1.5 font-mono text-[0.72rem] text-text-muted/50">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500/60" />
                Unsaved
              </span>
            )}
            {lastSaved && !hasUnsavedChanges && (
              <span className="font-mono text-[0.72rem] text-text-muted/40">
                Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <button
              onClick={updatePreview}
              disabled={isLoading}
              className="pressable inline-flex min-h-[44px] items-center gap-2 rounded-lg px-5 font-mono text-[0.84rem] font-semibold text-text-muted/80 shadow-[0_0_0_1px_hsl(var(--color-border)/0.12)] transition-[color,box-shadow,transform] duration-200 ease-out hover:shadow-[0_0_0_1px_hsl(var(--color-text-muted)/0.3)] hover:text-text disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {isLoading ? "Loading..." : "Preview"}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !slug}
              className="pressable inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-text px-5 font-mono text-[0.84rem] font-semibold text-bg shadow-[0_1px_2px_hsl(var(--color-text)/0.1)] transition-[opacity,box-shadow,transform] duration-200 ease-out hover:shadow-[0_2px_6px_hsl(var(--color-text)/0.15)] disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17,21 17,13 7,13 7,21" />
                <polyline points="7,3 7,8 15,8" />
              </svg>
              {isSaving ? "Saving..." : "Save"}
            </button>
            {initialSlug && (
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="pressable inline-flex min-h-[44px] items-center gap-2 rounded-lg px-5 font-mono text-[0.84rem] font-semibold text-red-500/80 shadow-[0_0_0_1px_hsl(0_100%_50%/0.15)] transition-[color,box-shadow,transform] duration-200 ease-out hover:bg-red-500/8 hover:shadow-[0_0_0_1px_hsl(0_100%_50%/0.3)] disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3,6 5,6 21,6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                {isSaving ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded-lg px-4 py-2.5 font-mono text-[0.82rem] shadow-[0_0_0_1px_inset,0_2px_8px_-2px] ${
              message.type === "success"
                ? "bg-green-500/8 text-green-500 shadow-[0_0_0_1px_hsl(142_76%_36%/0.15)_inset,0_2px_8px_-2px_hsl(142_76%_36%/0.08)]"
                : "bg-red-500/8 text-red-500 shadow-[0_0_0_1px_hsl(0_100%_50%/0.15)_inset,0_2px_8px_-2px_hsl(0_100%_50%/0.08)]"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Main content */}
        <div className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
          {/* Left: Metadata + Editor */}
          <div className="flex min-h-0 flex-col gap-4">
            {/* Metadata panel */}
            <div className="rounded-xl bg-bg/60 p-3.5 shadow-[0_0_0_1px_hsl(var(--color-border)/0.08),0_2px_4px_hsl(var(--color-border)/0.06),0_8px_24px_-8px_hsl(var(--color-border)/0.1)]">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="mb-1.5 block font-mono text-[0.64rem] font-semibold uppercase tracking-wider text-text-muted/60">
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
                    className="min-h-[36px] w-full rounded-md bg-transparent px-2.5 font-mono text-[0.8rem] text-text shadow-[0_0_0_1px_hsl(var(--color-border)/0.12)] transition-[box-shadow,color] duration-150 ease-out focus:shadow-[0_0_0_1px_hsl(var(--color-text-muted)/0.3)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[0.64rem] font-semibold uppercase tracking-wider text-text-muted/60">
                    Tags
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
                    placeholder="go, cli"
                    className="min-h-[36px] w-full rounded-md bg-transparent px-2.5 font-mono text-[0.8rem] text-text placeholder:text-text-muted/50 shadow-[0_0_0_1px_hsl(var(--color-border)/0.12)] transition-[box-shadow,color] duration-150 ease-out focus:shadow-[0_0_0_1px_hsl(var(--color-text-muted)/0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[0.64rem] font-semibold uppercase tracking-wider text-text-muted/60">
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
                    placeholder="Brief description..."
                    className="min-h-[36px] w-full rounded-md bg-transparent px-2.5 font-mono text-[0.8rem] text-text placeholder:text-text-muted/50 shadow-[0_0_0_1px_hsl(var(--color-border)/0.12)] transition-[box-shadow,color] duration-150 ease-out focus:shadow-[0_0_0_1px_hsl(var(--color-text-muted)/0.3)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[0.64rem] font-semibold uppercase tracking-wider text-text-muted/60">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="post-slug"
                    className="min-h-[36px] w-full rounded-md bg-transparent px-2.5 font-mono text-[0.8rem] text-text placeholder:text-text-muted/50 shadow-[0_0_0_1px_hsl(var(--color-border)/0.12)] transition-[box-shadow,color] duration-150 ease-out focus:shadow-[0_0_0_1px_hsl(var(--color-text-muted)/0.3)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Editor panel */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-xl shadow-[0_0_0_1px_hsl(var(--color-border)/0.08),0_2px_4px_hsl(var(--color-border)/0.06),0_8px_24px_-8px_hsl(var(--color-border)/0.1)]">
              {/* Markdown toolbar */}
              <div className="flex items-center gap-0.5 border-b border-border/8 bg-bg/40 px-3 py-1.5">
                {TOOLBAR_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => insertMarkdown(action)}
                    title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ""}`}
                    className="pressable inline-flex h-7 w-7 items-center justify-center rounded text-text-muted/60 transition-colors duration-150 ease-out hover:text-text"
                  >
                    {action.icon}
                  </button>
                ))}
                <div className="mx-1.5 h-4 w-px bg-border/30" />
                <button
                  type="button"
                  onClick={() => setShowLineNumbers((v) => !v)}
                  title="Toggle line numbers"
                  className={`pressable inline-flex h-7 items-center gap-1 rounded px-2 font-mono text-[0.68rem] transition-colors duration-150 ease-out ${
                    showLineNumbers ? "text-text" : "text-text-muted/50 hover:text-text-muted/80"
                  }`}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="10" y1="6" x2="21" y2="6" />
                    <line x1="10" y1="12" x2="21" y2="12" />
                    <line x1="10" y1="18" x2="21" y2="18" />
                    <path d="M3 6h.01" />
                    <path d="M3 12h.01" />
                    <path d="M3 18h.01" />
                  </svg>
                  Lines
                </button>
                <div className="flex-1" />
                {/* Keyboard shortcuts hint */}
                <span className="hidden font-mono text-[0.64rem] text-text-muted/40 sm:flex">
                  ⌘B bold · ⌘I italic · ⌘K link
                </span>
              </div>

              {/* CodeMirror editor */}
              <div className="flex-1 overflow-hidden">
                <CodeMirror
                  ref={editorRef}
                  value={content}
                  onChange={handleContentChange}
                  extensions={[
                    markdown(),
                    keymap.of([indentWithTab]),
                    EditorView.lineWrapping,
                  ]}
                  className="h-full"
                  basicSetup={{
                    lineNumbers: showLineNumbers,
                    foldGutter: showLineNumbers,
                    highlightActiveLine: true,
                    highlightActiveLineGutter: true,
                  }}
                  theme="dark"
                  placeholder="Write your post in Markdown..."
                />
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between border-t border-border/8 bg-bg/40 px-3 py-1.5 font-mono text-[0.68rem] text-text-muted/50">
                <div className="flex items-center gap-3">
                  <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
                  <span>{charCount} {charCount === 1 ? "char" : "chars"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{lineCount} {lineCount === 1 ? "line" : "lines"}</span>
                  <span className="text-text-muted/30">Markdown</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Preview panel */}
          <div className="flex flex-col overflow-hidden rounded-xl shadow-[0_0_0_1px_hsl(var(--color-border)/0.08),0_2px_4px_hsl(var(--color-border)/0.06),0_8px_24px_-8px_hsl(var(--color-border)/0.1)]">
            <div className="border-b border-border/8 bg-bg/60 px-4 py-2.5">
              <span className="font-mono text-[0.64rem] font-semibold uppercase tracking-wider text-text-muted/60">
                Preview
              </span>
            </div>
            <div className="flex-1 overflow-auto p-5">
              {preview ? (
                <article className="prose-content">{preview}</article>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-text-muted/40">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                  <p className="font-mono text-[0.78rem]">
                    Click &quot;Preview&quot; to render
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { EditorShell } from "@/components/editor/editor-shell";
import { Editor } from "@/components/writing/editor";

export const metadata: Metadata = {
  title: "New Post",
  description: "Create a new post",
};

export default function NewPostPage() {
  return (
    <EditorShell>
      <Editor />
    </EditorShell>
  );
}
import { compileHtml } from "@ozguragain/mdp";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypePrettyCode from "rehype-pretty-code";
import { toHtml } from "hast-util-to-html";
import { visit } from "unist-util-visit";

const prettyCodeOptions = {
  theme: {
    dark: "github-dark-dimmed",
    light: "github-light",
  },
  keepBackground: false,
} as const;

type HastElement = {
  tagName: string;
  properties?: Record<string, unknown>;
  children?: HastElement[];
};

/**
 * Marks http(s) links to open in a new tab. Rendering is plain HTML now, so
 * the attributes are set on the tree while it is already in hand.
 */
function externalLinks() {
  return (tree: unknown) => {
    visit(tree as never, "element", (node: unknown) => {
      const el = node as HastElement;
      if (el.tagName !== "a") return;
      const href = el.properties?.href;
      if (typeof href !== "string" || !/^https?:\/\//.test(href)) return;
      el.properties = { ...el.properties, target: "_blank", rel: "noopener noreferrer" };
    });
  };
}

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypePrettyCode, prettyCodeOptions)
  .use(externalLinks);

/**
 * Compile markdown into the HTML the post page renders. mdp does the markdown
 * work; rehype-pretty-code colours the code blocks it emits.
 */
export async function renderPost(markdown: string): Promise<string> {
  const html = compileHtml(markdown);
  const tree = await processor.run(processor.parse(html) as never);
  return toHtml(tree as never);
}

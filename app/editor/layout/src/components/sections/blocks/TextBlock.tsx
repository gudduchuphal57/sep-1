import type { TextBlock as TextBlockData } from "../types/section";

type TextBlockProps = {
  block: TextBlockData;
  className?: string;
};

export default function TextBlock({ block, className }: TextBlockProps) {
  if (block.role === "heading") {
    return <h1 className={className}>{block.content}</h1>;
  }

  if (block.role === "subheading" || block.role === "pretitle") {
    return <p className={className}>{block.content}</p>;
  }

  return <p className={className}>{block.content}</p>;
}

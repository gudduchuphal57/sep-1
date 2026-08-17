import Link from "next/link";
import type { ButtonBlock as ButtonBlockData } from "../types/section";

type ButtonBlockProps = {
  block: ButtonBlockData;
  className?: string;
};

export default function ButtonBlock({ block, className }: ButtonBlockProps) {
  return (
    <Link href={block.href} className={className}>
      {block.label}
    </Link>
  );
}

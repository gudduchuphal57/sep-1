import Link from "next/link";
import type { LogoBlock as LogoBlockData } from "../types/section";

type LogoBlockProps = {
  block: LogoBlockData;
  className?: string;
};

export default function LogoBlock({ block, className }: LogoBlockProps) {
  return (
    <Link href={block.href} className={className}>
      {block.text}
    </Link>
  );
}

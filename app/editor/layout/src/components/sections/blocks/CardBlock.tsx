import Image from "next/image";
import type { CardBlock as CardBlockData } from "../types/section";
import BlockRenderer from "./BlockRenderer";

type CardBlockProps = {
  block: CardBlockData;
  className?: string;
};

export default function CardBlock({ block, className }: CardBlockProps) {
  return (
    <article className={className}>
      {block.image && (
        <div className="relative h-60 overflow-hidden rounded-2xl">
          <Image
            src={block.image}
            alt={block.alt ?? block.title ?? ""}
            data-editor-media
            data-editor-media-type="image"
            data-editor-media-src={block.image}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      {block.category && <p className="mt-4 text-sm font-semibold">{block.category}</p>}
      {block.title && <h3 className="mt-3 text-2xl font-bold">{block.title}</h3>}
      {block.desc && <p className="mt-3 text-sm leading-relaxed">{block.desc}</p>}
      {block.blocks?.map((item) => <BlockRenderer key={item.id} block={item} />)}
    </article>
  );
}

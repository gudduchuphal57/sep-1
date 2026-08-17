import type { ListBlock as ListBlockData } from "../types/section";

type ListBlockProps = {
  block: ListBlockData;
  className?: string;
};

export default function ListBlock({ block, className }: ListBlockProps) {
  return (
    <div className={className}>
      {block.title && <h3>{block.title}</h3>}
      <ul>
        {block.items.map((item, index) => (
          <li key={index}>{typeof item === "string" ? item : item.label}</li>
        ))}
      </ul>
    </div>
  );
}

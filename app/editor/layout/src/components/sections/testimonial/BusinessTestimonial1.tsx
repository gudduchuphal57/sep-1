import type { SectionProps } from "../../../types/section";

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function BusinessTestimonial1({ data = {} }: SectionProps) {
  const items = data.testimonialItems ?? [];

  return (
    <section className="w-full bg-[#1c1b19] px-8 py-24 md:px-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex w-full items-center justify-center">
          <div className="flex-grow border-t border-[#33312c]" />
          {data.pretitle && (
            <span className="px-6 text-xs font-medium uppercase tracking-[0.2em] text-[#cfa94e]">
              {data.pretitle}
            </span>
          )}
          <div className="flex-grow border-t border-[#33312c]" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex flex-col justify-between border border-[#33312c] p-10"
            >
              <div>
                <div className="mb-4 font-serif text-5xl leading-none text-[#5c4d29]">
                  &ldquo;
                </div>
                <p className="mb-10 font-serif text-[17px] italic leading-relaxed text-[#d4cfc3]">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="mt-auto flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#5c4d29] bg-[#2a261e] text-sm font-medium tracking-wider text-[#cfa94e]">
                  {getInitials(item.name)}
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 text-[15px] font-medium text-white">
                    {item.name}
                  </span>
                  <span className="text-[12px] text-[#8c887d]">
                    {item.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
